//****************************************//
//  Animation Detector
//****************************************//

/**
 * Detects the animation on the layer by using an expression, converting to keys, then to markers.
 * @returns { boolean } Success
 */
function detectAnimation(){

    //Saving the modifiers keys statuses.
    var modifiers = CTmodifiersStatuses() ;
    //Starting the true work.
    var layerSelection = CTcheckSelectedLayers() ;
    var layersToAnalyse = []
    if( layerSelection.length > 0 ){
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            //Creating an object to store layers properties.
            var layer = new Object();
            //Storing layer object and layer name.
            layer.toBeProcessed = true ;
            layer.object = layerSelection[i];
            layer.index = layerSelection[i].index ;
            layer.name = layerSelection[i].name ;
            layer.inPoint = layerSelection[i].inPoint ;
            layer.outPoint = layerSelection[i].outPoint ;
            //Saving the start and end time of the layer.
            var layerInPoint = layerSelection[i].inPoint ;
            var layerOutPoint = layerSelection[i].outPoint ;
            //Creating variables for the start and end of the analysis depending of the shortcuts.
            var analysisStartTime = layerInPoint ;
            var analysisEndTime = layerOutPoint ;
            var activeItem = app.project.activeItem ;
            if( modifiers.ctrlState && modifiers.majState ){
                var currentTime = activeItem.time ;
                if( currentTime < analysisStartTime ){
                    analysisEndTime = analysisStartTime ;
                } else if( currentTime >= analysisEndTime ){
                    analysisStartTime = analysisEndTime ;
                } else {
                    analysisStartTime = activeItem.time ;
                    analysisEndTime = analysisStartTime + activeItem.frameDuration ;
                }
            } else if( modifiers.ctrlState ){
                var workAreaStartTime = activeItem.workAreaStart ;
                var workAreaEndTime = workAreaStartTime + activeItem.workAreaDuration ;
                if( workAreaStartTime > analysisStartTime ){
                    analysisStartTime = workAreaStartTime ;
                }
                if( workAreaEndTime < analysisEndTime ){
                    analysisEndTime = workAreaEndTime ;
                }
            }
            //storing the analysis limits and duration.
            layer.analysisStartTime = analysisStartTime ;
            layer.analysisEndTime = analysisEndTime ;
            layer.analysisDuration = analysisEndTime.toFixed(2) - analysisStartTime.toFixed(2) ;
            //Changing the toBeProcessed value to false if the duration of the analysis is 0s.
            if( layer.analysisDuration <= 0 ){
                layer.toBeProcessed = false ;
            }
            //Creating a variables for the existance of previously detected animation and effects active.
            layer.hasEffectActive = false ;
            layer.existingAnimDetection = false ;
            layer.lowestPointKeys = [];
            //Check if the animation has already been detected or not.
            if( layerSelection[i].property( "ADBE Marker" ).numKeys > 0 ){
                layer.existingAnimDetection = true ;
            }
            //Checks if there is any effects on the layer.
            if( layerSelection[i].property("ADBE Effect Parade").numProperties > 0 ){
                for( var j = 1 ; j <= layerSelection[i].property("ADBE Effect Parade").numProperties ; j++ ){
                    if( layerSelection[i].property("ADBE Effect Parade").property(j).name != "CTbox - Content Lowest Point" && layerSelection[i].property("ADBE Effect Parade").property(j).active ){
                        layer.hasEffectActive = true ;
                        break ;
                    } 
                }
            }
            //Storing the layer object in the array.
            layersToAnalyse.push( layer );
        }
        //Opening the dialog allowing the user to chooser whether to continue or abort an analyse.
        layersToAnalyse = layerAnalysisChoiceDialog( layersToAnalyse );
        //Analysing the layers selected.
        if( layersToAnalyse.length > 0 ){
            //Getting the saved parameters.
            var precisionDegree = CTgetSavedString( "CTboxSave" , "PrecisionDegree" );
            if( precisionDegree == null ){ precisionDegree = 1 };
            var toleranceDegree = CTgetSavedString( "CTboxSave" , "ToleranceDegree" );
            if( toleranceDegree == null ){ toleranceDegree = 0 };
            for( var i = 0 ; i < layersToAnalyse.length ; i++ ){
                if( layersToAnalyse[i].toBeProcessed ){
                    //Opening the UndoGroup.
                    app.beginUndoGroup( "Animation Detection" );
                    //Selecting the layer to work on.
                    layersToAnalyse[i].object.selected = true ;
                    //Setting the in and out Points of the layer for the analysis.
                    layersToAnalyse[i].object.inPoint = layersToAnalyse[i].analysisStartTime ;
                    layersToAnalyse[i].object.outPoint = layersToAnalyse[i].analysisEndTime ;
                    //Adding sliders to do the real analysis.
                    var nbOfSliders = Math.pow( precisionDegree , 2 );
                    var analysisSliders = [] ;
                    for( var j = 0 ; j < nbOfSliders ; j++ ){
                        var x = Math.floor( j / precisionDegree );
                        var y = j % precisionDegree ;
                        var changeDetector = layersToAnalyse[i].object.property( "ADBE Effect Parade" ).addProperty( "ADBE Color Control" );
                        changeDetector.name = "x" + x + "y" + y ;
                        changeDetector = changeDetector.property(1);
                        changeDetector.expression = "//---- Links ----\
var layerToAnalyse = thisLayer ;\
var precisionDegree = " + precisionDegree + " ;\
\
//---- Code ----\
var xNb = thisProperty.propertyGroup().name.slice( 1 , thisProperty.propertyGroup().name.search( \"y\" ) );\
var yNb = thisProperty.propertyGroup().name.slice( thisProperty.propertyGroup().name.search( \"y\" ) + 1 , thisProperty.propertyGroup().name.length );\
var xStep = layerToAnalyse.width / precisionDegree ;\
var yStep = layerToAnalyse.height / precisionDegree ;\
var x = xStep / 2 + xNb * xStep ;\
var y = yStep / 2 + yNb * yStep ;\
var averageColor = layerToAnalyse.sampleImage( [ x , y ] , [ xStep / 2 , yStep / 2 ] , true );\
\
//---- Result ----\
averageColor" ;
                        changeDetector.selected = true ;
                        app.executeCommand( 2639 ); //Execute the commande "Animation > Keyframe Assistant > Convert Expression to Keyframes".
                        changeDetector.selected = false ;
                        analysisSliders.push( changeDetector );
                    }
                    if( layersToAnalyse[i].existingAnimDetection ){
                        for( j = 1 ; j <= layersToAnalyse[i].object.property( "ADBE Marker" ).numKeys ; j++ ){
                            if( layersToAnalyse[i].object.property( "ADBE Marker" ).keyTime( j ).toFixed(2) >= layersToAnalyse[i].analysisStartTime && layersToAnalyse[i].object.property( "ADBE Marker" ).keyTime( j ).toFixed(2) < layersToAnalyse[i].analysisEndTime.toFixed(2) ){
                                layersToAnalyse[i].object.property( "ADBE Marker" ).removeKey( j );
                                j -= 1 ;
                            }
                        }
                    }
                    for( j = analysisStartTime ; j < analysisEndTime ; j += app.project.activeItem.frameDuration ){
                        for( var k = 0 ; k < nbOfSliders ; k++ ){
                            var isDifferent = false ;
                            var currentSlider = layersToAnalyse[i].object.property( "ADBE Effect Parade" ).property( "x" + Math.floor( k / precisionDegree ) + "y" + k % precisionDegree ).property(1);
                            for( var l = 0 ; l < 4 ; l++ ){
                                if( j == layersToAnalyse[i].inPoint || Math.abs( currentSlider.keyValue( currentSlider.nearestKeyIndex(j) )[l] - currentSlider.keyValue( currentSlider.nearestKeyIndex( j -  app.project.activeItem.frameDuration ) )[l] ) * 100 - toleranceDegree > 0 ){
                                    layersToAnalyse[i].object.property( "ADBE Marker").addKey(j);
                                    isDifferent = true ;
                                    break ;
                                }
                            }
                            if( isDifferent ){ break ; };
                        }
                    }
                    for( j = 0 ; j < nbOfSliders ; j++ ){
                        layersToAnalyse[i].object.property( "ADBE Effect Parade" ).property( "x" + Math.floor( j / precisionDegree ) + "y" + j % precisionDegree ).remove();
                    }
                    //Restoring the in and out Points of the layer.
                    layersToAnalyse[i].object.inPoint = layersToAnalyse[i].inPoint ;
                    layersToAnalyse[i].object.outPoint = layersToAnalyse[i].outPoint ;
                    //Closing the UndoGroup.
                    app.endUndoGroup();
                }
            }
            //Recreating the original layer selection.
            for( var i = 0 ; i < layersToAnalyse.length ; i++ ){
                layersToAnalyse[i].selected = true ;
            }
            CTalertDlg( "I'm Done" , "   I've finished detecting Animation on your layers." );
            return true ;
        }
    }
    return false ;
    
}
/**
 * Opens a dialog to choose options for the detection.
 */
function getAnimDetectionOptions(){
    
    var animDetectionDlg = new Window( "dialog" , undefined , undefined , { borderless :true } );
    animDetectionDlg.alignChildren = "fill" ;
    animDetectionDlg.spacing = 2 ;
        var presetLine = animDetectionDlg.add( "group" );
        presetLine.alignChildren = [ "center" , "fill" ];
            presetLine.add( "statictext{ text: 'Preset : ' , characters: 5 }" );
            var presetSelector = presetLine.add( "dropdownlist" , undefined , [ "None" , "Anim 2D/3D" , "Stopmotion" ] );
            presetSelector.selection = presetSelector.items[0];
        var settings = animDetectionDlg.add( "panel" , undefined , "Settings : " );
        settings.alignChildren = "Fill" ;
        settings.spacing = 0 ;
            var settingsLine1 = settings.add( "group" );
            settingsLine1.alignChildren = [ "center" , "fill"];
            settingsLine1.orientation = "Row" ;
                settingsLine1.add( "statictext" , undefined , "Precision :" );
                var precisionValue = settingsLine1.add( "edittext{ text: '1' , justify: 'center' , characters: 4 }" );
            var precisionSlider = settings.add( "slider" , undefined , 1 , 1 , 10 );
            var settingsLine2 = settings.add( "group" )
            settingsLine2.orientation = "Row" ;
            settingsLine2.alignChildren = [ "center" , "fill"];
                settingsLine2.add( "statictext" , undefined , "Tolerance :" );
                var toleranceValue = settingsLine2.add( "edittext{ text: '0' , justify: 'center' , characters: 4 }" );
            var toleranceSlider = settings.add( "slider" , undefined , 0 , 0 , 5 );
        var btnsRow = animDetectionDlg.add( "group" );
        btnsRow.orientation = "row" ;
        btnsRow.alignChildren = [ "center" , "fill" ];
        btnsRow.spacing = 0 ;
        var btnSize = [ 60 , 20 ];
            var btnA = btnsRow.add( "button" , undefined , "Ok" );
            btnA.size = btnSize ;
            var btnB = btnsRow.add( "button" , undefined , "Cancel" );
            btnB.size = btnSize ;
    //Updating the UI with saved values.
    var savedPresetName = CTgetSavedString( "CTboxSave" , "PresetName" );
    if( savedPresetName == null ){ savedPresetName = "None" };
    savedPresetName = DropdownlistIndexOf( presetSelector.items , savedPresetName );
    presetSelector.selection = presetSelector.items[ savedPresetName ];
    var savedPrecisionDegree = CTgetSavedString( "CTboxSave" , "PrecisionDegree" );
    if( savedPrecisionDegree == null ){ savedPrecisionDegree = 1 };
    precisionValue.text = savedPrecisionDegree ;
    precisionSlider.value = savedPrecisionDegree ;
    var savedToleranceDegree = CTgetSavedString( "CTboxSave" , "ToleranceDegree" );
    if( savedToleranceDegree == null ){ savedToleranceDegree = 0 };
    toleranceValue.text = savedToleranceDegree ;
    toleranceSlider.value = savedToleranceDegree ;
    //UI Events
    presetSelector.onChange = function(){ if( presetSelector.selection.text == "Anim 2D/3D"){ precisionValue.text = 1 , precisionSlider.value = 1 , toleranceValue.text = 0 , toleranceSlider.value = 0 } else if( presetSelector.selection.text == "Stopmotion"){ precisionValue.text = 4 , precisionSlider.value = 4 , toleranceValue.text = 1 , toleranceSlider.value = 1 } };
    precisionValue.onChange = function(){ precisionSlider.value = precisionValue.text };
    precisionSlider.onChanging = function(){ precisionValue.text = Math.round( precisionSlider.value ); };
    toleranceValue.onChange = function(){ toleranceSlider.value = toleranceValue.text };
    toleranceSlider.onChanging = function(){ toleranceValue.text = Math.round( toleranceSlider.value * 10 ) /10 ; };
    btnA.onClick = function(){ var precisionParameter = CTcleanNumberString( precisionValue.text , false ); var toleranceParameter = CTcleanNumberString( toleranceValue.text , false ); if(  precisionParameter != null && toleranceParameter != null ){ { CTsaveString( "CTboxSave" , "PresetName" , presetSelector.selection.text ); CTsaveString( "CTboxSave" , "PrecisionDegree" , precisionValue.text ); CTsaveString( "CTboxSave" , "ToleranceDegree" , toleranceValue.text ); animDetectionDlg.close(); };};};
    //Showing UI
    animDetectionDlg.show();
}