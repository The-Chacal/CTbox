//****************************************//
//   Layer Bottom Detector
//****************************************//

/**
 * Adds a Point effect giving the lowest point of the layer's content trough time.
 * @param { boolean } promptEndAlert Announces the end of its work.
 * @param { boolean } hasUndoGroup Creates an undoGroup.
 * @returns { boolean } Success.
 */
function getLayerBottom( promptEndAlert , hasUndoGroup ){

    //Getting the path to the Script on the Computer.
    var scriptFolder = CTgetScriptFolder();
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
            layer.analysisDuration = analysisEndTime - analysisStartTime ;
            //Changing the toBeProcessed value to false if the duration of the analysis is 0s.
            if( layer.analysisDuration == 0 ){
                layer.toBeProcessed = false ;
            }
            //Creating a variables for the existance of previously created lowest Point and effects active.
            layer.hasEffectActive = false ;
            layer.existingLowestPoint = false ;
            layer.lowestPointKeys = [];
            //Check if the Content lowest point has already been detected or not.
            if( layerSelection[i].property("ADBE Effect Parade").property( "CTbox - Content Lowest Point" ) != null ){
                layer.existingLowestPoint = true ;
                layer.lowestPointKeys = CTsavePropertyKeys( layerSelection[i].property("ADBE Effect Parade").property( "CTbox - Content Lowest Point" ).property( 2 ) );
            }
            //Checks if there is any effects on the layer and asks to continue or not if there is some.
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
        layersToAnalyse = layerBottomDetectionDialog( layersToAnalyse );
        //Analysing the layers selected.
        if( layersToAnalyse.length > 0 ){
            for( var i = 0 ; i < layersToAnalyse.length ; i++ ){
                if( layersToAnalyse[i].toBeProcessed ){
                    promptEndAlert = true ;
                    //Opening the UndoGroup.
                    if( hasUndoGroup ){ app.beginUndoGroup( "Lowest Point Detection" ); }
                    //Selecting the layer to work on.
                    layersToAnalyse[i].object.selected = true ;
                    //Setting the in and out Points of the layer for the analysis.
                    layersToAnalyse[i].object.inPoint = layersToAnalyse[i].analysisStartTime ;
                    layersToAnalyse[i].object.outPoint = layersToAnalyse[i].analysisEndTime ;
                    //Getting the saved Parameters.
                    var verticalOriginalStep = CTgetSavedString( "CTboxSave" , "verticalOriginalStep" );
                    if( verticalOriginalStep == null ){ verticalOriginalStep = 50 };
                    var horizontalOriginalStep = CTgetSavedString( "CTboxSave" , "horizontalOriginalStep" );
                    if( horizontalOriginalStep == null ){ horizontalOriginalStep = 20 };
                    var horizontalScanHeight = CTgetSavedString( "CTboxSave" , "horizontalScanHeight" );
                    if( horizontalScanHeight == null ){ horizontalScanHeight = 50 };
                    //Adding sliders with expression to get the final point.
                    var Yslider = layersToAnalyse[i].object.property("ADBE Effect Parade").addProperty( "ADBE Slider Control" );
                    Yslider.name = "DetectedY";
                    Yslider.property(1).expression = "var originalStep = " + verticalOriginalStep + " ;\
    var H = thisLayer.height - 1;\
    var Y = searchFromHeight( H , originalStep , H );\
    \
    function searchFromHeight( searchedY , Step , StartY ){\
    \
        for( var i = StartY + .5 ; i >= 0 ; i -= Step )\
        {\
            var Alpha = thisLayer.sampleImage( [ thisLayer.width / 2 , i ] , [ thisLayer.width / 2 , .5 ] , true )[3];\
            if( Alpha != 0 && i == thisLayer.height - .5)\
            {\
                searchedY = i + .5 ;\
                break ;\
            } else if( Alpha != 0 ){\
                searchedY = preciseY( searchedY , Math.floor( Step / 2 ) , i - .5 + Math.floor( Step / 2 ) , 1 );\
                break ;\
            }\
        }\
        return searchedY ;\
    \
    }\
    //direction : 0 to Top, 1 to Bottom.\
    function preciseY( searchedY , Step , StartY, direction ){\
    \
        var Alpha = thisLayer.sampleImage( [ thisLayer.width / 2 , StartY + .5 ] , [ thisLayer.width / 2 , .5 ] , true )[3];\
        if( Step == 1 ){\
            if( Alpha == 0 )\
            {\
                searchedY = StartY - Step ;\
                return searchedY ;\
            } else if( direction = 1 ){\
                searchedY = StartY + Step ;\
                return searchedY ;\
            } else {\
                searchedY = StartY ;\
                return searchedY ;\
            }\
        } else if( Alpha == 0 ){\
            searchedY = preciseY( searchedY , Math.floor( Step / 2 ) , StartY - Math.floor( Step / 2 ) , 0 );\
            return searchedY ;\
        } else {\
            searchedY = preciseY( searchedY , Math.floor( Step / 2 ) , StartY + Math.floor( Step / 2 ) , 1 );\
            return searchedY ;\
        }\
    \
    }\
    \
    Y";
                    var XleftSlider = layersToAnalyse[i].object.property("ADBE Effect Parade").addProperty( "ADBE Slider Control" );
                    XleftSlider.name = "DetectedXleft";
                    XleftSlider.property(1).expression = "var originalStep = " + horizontalOriginalStep + " ;\
    var originalHeight = " + horizontalScanHeight + " ;\
    var W = thisLayer.width - 1 ;\
    var Y = effect(\"DetectedY\")(1);\
    var X = searchFromX0( 0 , Y , originalStep , W );\
    \
    function searchFromX0( searchedX , Y ,  Step , EndX ){\
    \
        for( var i = 0 + .5 ; i <= EndX - .5 ; i += Step )\
        {\
            var Alpha = thisLayer.sampleImage( [ i , Y - 25 ] , [ .5 , 25 ] , true )[3];\
            if( Alpha != 0 && i == .5)\
            {\
                searchedX = 0 ;\
                break ;\
            } else if( Alpha != 0 ){\
                searchedX = preciseX( searchedX , Y , Math.floor( Step / 2 ) , i - .5 - Math.floor( Step / 2 ) , 0 );\
                break ;\
            }\
        }\
        return searchedX ;\
    \
    }\
    //direction : 0 to Left, 1 to Right.\
    function preciseX( searchedX , Y , Step , StartX, direction ){\
    \
        var Alpha = thisLayer.sampleImage( [ StartX + .5 , Y - originalHeight ] , [ .5 , originalHeight ] , true )[3];\
        if( Step == 1 ){\
            if( Alpha == 0 )\
            {\
                searchedX = StartX + Step ;\
                return searchedX ;\
            } else if( direction = 1 ){\
                searchedX = StartX - Step ;\
                return searchedX ;\
            } else {\
                searchedX = StartX ;\
                return searchedX ;\
            }\
        } else if( Alpha == 0 ){\
            searchedX = preciseX( searchedX , Y , Math.floor( Step / 2 ) , StartX + Math.floor( Step / 2 ) , 1 );\
            return searchedX ;\
        } else {\
            searchedX = preciseX( searchedX , Y , Math.floor( Step / 2 ) , StartX - Math.floor( Step / 2 ) , 0 );\
            return searchedX ;\
        }\
    \
    }\
    \
    X";
                    var XrightSlider = layersToAnalyse[i].object.property("ADBE Effect Parade").addProperty( "ADBE Slider Control" );
                    XrightSlider.name = "DetectedXright";
                    XrightSlider.property(1).expression = "var originalStep = " + horizontalOriginalStep + " ;\
    var originalHeight = " + horizontalScanHeight + " ;\
    var W = thisLayer.width - 1 ;\
    var Y = effect(\"DetectedY\")(1);\
    var X = searchFromWidth( W , Y , originalStep , W );\
    \
    function searchFromWidth( searchedX , Y ,  Step , StartX ){\
    \
        for( var i = StartX + .5 ; i >= 0 ; i -= Step )\
        {\
            var Alpha = thisLayer.sampleImage( [ i , Y - originalHeight ] , [ .5 , originalHeight ] , true )[3];\
            if( Alpha != 0 && i == thisLayer.width - .5)\
            {\
                searchedX = i + .5 ;\
                break ;\
            } else if( Alpha != 0 ){\
                searchedX = preciseX( searchedX , Y , Math.floor( Step / 2 ) , i - .5 + Math.floor( Step / 2 ) , 1 );\
                break ;\
            }\
        }\
        return searchedX ;\
    \
    }\
    //direction : 0 to Left, 1 to Right.\
    function preciseX( searchedX , Y , Step , StartX, direction ){\
    \
        var Alpha = thisLayer.sampleImage( [ StartX + .5 , Y - 20 ] , [ .5 , 20 ] , true )[3];\
        if( Step == 1 ){\
            if( Alpha == 0 )\
            {\
                searchedX = StartX - Step ;\
                return searchedX ;\
            } else if( direction = 1 ){\
                searchedX = StartX + Step ;\
                return searchedX ;\
            } else {\
                searchedX = StartX ;\
                return searchedX ;\
            }\
        } else if( Alpha == 0 ){\
            searchedX = preciseX( searchedX , Y , Math.floor( Step / 2 ) , StartX - Math.floor( Step / 2 ) , 0 );\
            return searchedX ;\
        } else {\
            searchedX = preciseX( searchedX , Y , Math.floor( Step / 2 ) , StartX + Math.floor( Step / 2 ) , 1 );\
            return searchedX ;\
        }\
    \
    }\
    \
    X";
                    //Applying the final preset.
                    if( !layersToAnalyse[i].existingLowestPoint ){ layersToAnalyse[i].object.applyPreset( new File( scriptFolder.fsName + "/CTboxElements/PseudoEffects/LayerLowestPoint v1.ffx" ) ); }
                    var lowestPoint = layersToAnalyse[i].object.property("ADBE Effect Parade").property("CTbox - Content Lowest Point");
                    lowestPoint.property(2).expression = "//---------- Links ----------\
    var DetectedY = effect(\"DetectedY\")(1);\
    var DetectedXleft = effect(\"DetectedXleft\")(1);\
    var DetectedXright = effect(\"DetectedXright\")(1);\
    \
    //---------- Code ----------\
    var X = ( DetectedXleft + DetectedXright ) / 2 ;\
    var Y = DetectedY ;\
    \
    //---------- End ----------\
    [ X , Y ]"
                    lowestPoint.property(2).selected = true ;
                    app.executeCommand( 2639 ); //Execute the command "Animation > Keyframe Assistant > Convert Expression to Keyframes".
                    for( var j = 1 ; j <= lowestPoint.property(2).numKeys ; j++ )
                    {
                        lowestPoint.property(2).setInterpolationTypeAtKey( j , KeyframeInterpolationType.HOLD , KeyframeInterpolationType.HOLD );
                    }
                    if( layersToAnalyse[i].existingLowestPoint && layersToAnalyse[i].lowestPointKeys.length > 0 ){
                        for( j = 0 ; j < layersToAnalyse[i].lowestPointKeys.length ; j++ ){
                            if( layersToAnalyse[i].lowestPointKeys[j].time < analysisStartTime || layersToAnalyse[i].lowestPointKeys[j].time.toFixed(2) >= analysisEndTime.toFixed(2) ){
                                lowestPoint.property(2).setValueAtTime( layersToAnalyse[i].lowestPointKeys[j].time , layersToAnalyse[i].lowestPointKeys[j].value );
                                lowestPoint.property(2).setInterpolationTypeAtKey( lowestPoint.property(2).nearestKeyIndex( layersToAnalyse[i].lowestPointKeys[j].time ) , layersToAnalyse[i].lowestPointKeys[j].inInterpolationType , layersToAnalyse[i].lowestPointKeys[j].outInterpolationType );
                            }
                        }
                    }
                    lowestPoint.property(2).selected = false ;
                    //Removing the expression of the final point.
                    lowestPoint.property(2).expression = "" ;
                    //Removing the now useless Sliders with heavy expressions.
                    layersToAnalyse[i].object.property("ADBE Effect Parade").property( "DetectedY" ).remove();
                    layersToAnalyse[i].object.property("ADBE Effect Parade").property( "DetectedXleft" ).remove();
                    layersToAnalyse[i].object.property("ADBE Effect Parade").property( "DetectedXright" ).remove();
                    //Restoring the in and out Points of the layer.
                    layersToAnalyse[i].object.inPoint = layersToAnalyse[i].inPoint ;
                    layersToAnalyse[i].object.outPoint = layersToAnalyse[i].outPoint ;
                    //Unselecting the active layer.
                    layersToAnalyse[i].selected = false ;
                    //Closing the UndoGroup
                    if( hasUndoGroup ){ app.endUndoGroup(); }
                }
            }
            //Recreating the original layer selection.
            for( var i = 0 ; i < layerSelection.length ; i++ ){
                layerSelection[i].selected = true ;
            }
            if( promptEndAlert ){
                CTalertDlg( "I'm Done" , "   I've finished detecting the lowest point of your layer(s)." );
            }
        }
        return true ;
    }
    
}
/**
 * Opens a dialog after checking the options of the layers to let the user decide if he wants to pursue or not for each layer.
 * @param { array } layers An array containing the layer object and caracteristics for the layer bottom detection.
 */
function layerBottomDetectionDialog( layers ){
    var dlg = new Window( "dialog" , "Layer Bottom Detection Choice" , undefined , { borderless : true } );
    dlg.spacing = 2 ;
    //Creating lines for each layer selected.
    for( var i = 0 ; i < layers.length ; i++ ){
        //Creating the warning text according to the  characteristics of the layer.
        var warningText = "";
        if( layers[i].analysisDuration.toFixed(2) == 0 ){
            warningText = " > This layer is out of Bounds.";
        }
        if( warningText != " > This layer is out of Bounds." && layers[i].existingLowestPoint ){
            warningText += " > This layer has already been analysed for lowest point.";
        }
        if( warningText != " > This layer is out of Bounds." && layers[i].hasEffectActive ){
            warningText += " > This layer has active effects.";
        }
        if( warningText != " > This layer is out of Bounds." && layers[i].object.width > 3000 ){
            warningText += " > This layer is more than 3000px in width.";
        }
        if( warningText != " > This layer is out of Bounds." && layers[i].object.height > 3000 ){
            warningText += " > This layer is more than 3000px in height.";
        }
        if( warningText != " > This layer is out of Bounds." && layers[i].analysisDuration.toFixed(2) > 3 ){
            warningText += " > This layer will be analysed over more than 5s.";
        }
        if( warningText == "" ){
            warningText = " > Nothing to worry about."
        } else if( warningText != " > This layer is out of Bounds." && warningText != " > This layer has already been analysed for lowest point." ){
            warningText = warningText.replace( /. > /gm , ".\n > " );
            warningText += "\n\n   This might affect the length of the analysis in heavy proportions...\n    Even cause crashes..."
        }
        //Actually creating the lines.
        var line = dlg.add( "panel" , undefined , layers[i].index + " - " + layers[i].name + " :" );
        line.alignChildren = [ "left" , "center" ];
        line.spacing = 2 ;
        line.margins = [ 5 , 10 , 5 , 5 ];
            var layerWarnings = line.add( "Panel" , undefined , "Warning : " );
            layerWarnings.alignment = "Fill" ;
            layerWarnings.margins = [ 15 , 10 , 5 , 5 ];
                var warnings = {}
                if( warningText == " > This layer is out of Bounds." || warningText == " > Nothing to worry about."){
                    warnings = layerWarnings.add( "statictext" , undefined , warningText , { multiline : false } );
                } else { 
                    warnings = layerWarnings.add( "statictext" , undefined , warningText , { multiline : true } );
                }
                warnings.alignment = "Fill" ;
            var layerChoice = line.add( "group" );
                layerChoice.add( "statictext" , undefined , "Discard this layer ?");
                var layerDiscard = layerChoice.add( "radiobutton" , undefined , " - Yes.");
                layerDiscard.characters = 4 ;
                var layerNotDiscard = layerChoice.add( "radiobutton" , undefined , " - No.");
                layerNotDiscard.characters = 4 ;
                layerNotDiscard.value = true ;
        
        //Updating radio buttons according to the warning message.
        if( warnings.text == " > This layer is out of Bounds." ){
            layerDiscard.value = true ;
            layerDiscard.enabled = false ;
            layerNotDiscard.enabled = false ;
        }
    }
    //Creating the rest of the dialog.
    var saveChoiceLine = dlg.add( "panel" , undefined , "Think about it twice :" );
    saveChoiceLine.spacing = 0 ;
    saveChoiceLine.alignment = "fill" ;
    saveChoiceLine.alignChildren = "fill"
        var saveChoiceText = saveChoiceLine.add( "statictext" , undefined , "   Do you want me to save before I start?" );
        saveChoiceText.characters = 23 ;
        saveChoiceText.alignment = "center" ;
        var saveRadiosLine = saveChoiceLine.add( "group" );
        saveRadiosLine.alignment = "center" ;
            var saveTheFile = saveRadiosLine.add( "radiobutton" , undefined , " - Yes" );
            saveTheFile.characters = 4 ;
            saveTheFile.value = true ;
            var saveNotTheFile = saveRadiosLine.add( "radiobutton" , undefined , " - No" );
            saveNotTheFile.characters = 3 ;
    var btnsRow = dlg.add( "group" );
        btnsRow.orientation = "row" ;
        btnsRow.spacing = 0 ;
        var btnSize = [ 60 , 20 ];
            var btnA = btnsRow.add( "button" , undefined , "Proceed" );
            btnA.size = btnSize ;
            var btnB = btnsRow.add( "button" , undefined , "Cancel" );
            btnB.size = btnSize ;
    //UI parameters
    dlg.defaultElement = btnA ;
    //UI Events.
    btnA.onClick = function(){
        if( saveTheFile.value ){
            app.project.save();
        }
        for( i = 0 ; i < dlg.children.length - 2 ; i++ ){
            if( dlg.children[i].children[1].children[1].value ){
                layers[i].toBeProcessed = false ;
            }
        }
        dlg.close() ; }
    btnB.onClick = function(){ layers = []; dlg.close() ; }
    //Showing UI.
    dlg.show();
    return layers;
} 
/**
 * Opens a dialog allowing the user to set the option of the search for layer lowest point
 */
function getLayerBottomOptions(){

    var getLayerBottomOptionsDialog = new Window( "dialog" , undefined , undefined , { borderless : true } );
    getLayerBottomOptionsDialog.spacing = 2 ;
        var mainGroup = getLayerBottomOptionsDialog.add( "panel" , undefined , "Get Layer Bottom Options :" );
        mainGroup.orientation = "column" ;
        mainGroup.spacing = 2 ;
            var optn01row = mainGroup.add( "group" );
            optn01row.orientation = "row" ;
                optn01row.add( "staticText{ text : 'Vrtl Step :' , justify : 'left' , characters : 6 }" );
                var optn01value = optn01row.add( "editText{ justify : 'center' }" );
                optn01value.characters = 3 ;
                var optn01slider = optn01row.add( "slider" , undefined , 50 , 2 , 2160 );
                optn01slider.size = [ 150 , 17.5 ];
            var optn02row = mainGroup.add( "group" );
            optn02row.orientation = "row" ;
                optn02row.add( "staticText{ text : 'Hrzl Step :' , justify : 'left' , characters : 6 }" );
                var optn02value = optn02row.add( "editText{ justify : 'center' }" );
                optn02value.characters = 3 ;
                var optn02slider = optn02row.add( "slider" , undefined , 20 , 2 , 3840 );
                optn02slider.size = [ 150 , 17.5 ];
            var optn03row = mainGroup.add( "group" );
            optn03row.orientation = "row" ;
                optn03row.add( "staticText{ text : 'Hrzl Size :' , justify : 'left' , characters : 6 }" );
                var optn03value = optn03row.add( "editText{ justify : 'center' }" );
                optn03value.characters = 3 ;
                var optn03slider = optn03row.add( "slider" , undefined , 50 , 2 , 2160 );
                optn03slider.size = [ 150 , 17.5 ];
        var btnsRow = getLayerBottomOptionsDialog.add( "group" );
        btnsRow.orientation = "row" ;
        btnsRow.spacing = 0 ;
        var btnSize = [ 60 , 20 ];
            var btnA = btnsRow.add( "button" , undefined , "Ok" );
            btnA.size = btnSize ;
            var btnB = btnsRow.add( "button" , undefined , "Default" );
            btnB.size = btnSize ;
            var btnC = btnsRow.add( "button" , undefined , "Cancel" );
            btnC.size = btnSize ;
    //Updating the UI with saved values.
    var savedVerticalOriginalStep = CTgetSavedString( "CTboxSave" , "verticalOriginalStep" );
    if( savedVerticalOriginalStep == null ){ savedVerticalOriginalStep = 50 };
    var savedHorizontalOriginalStep = CTgetSavedString( "CTboxSave" , "horizontalOriginalStep" );
    if( savedHorizontalOriginalStep == null ){ savedHorizontalOriginalStep = 20 };
    var savedHorizontalScanHeight = CTgetSavedString( "CTboxSave" , "horizontalScanHeight" );
    if( savedHorizontalScanHeight == null ){ savedHorizontalScanHeight = 25 };
    optn01value.text = savedVerticalOriginalStep ;
    optn01slider.value = savedVerticalOriginalStep ;
    optn02value.text = savedHorizontalOriginalStep ;
    optn02slider.value = savedHorizontalOriginalStep ;
    optn03value.text = savedHorizontalScanHeight ;
    optn03slider.value = savedHorizontalScanHeight ;
    //UI Events.
    optn01slider.onChanging = function(){ optn01value.text = Math.round ( optn01slider.value ); };
    optn01value.onChange = function(){ optn01slider.value = optn01value.text };
    optn02slider.onChanging = function(){ optn02value.text = Math.round ( optn02slider.value ); };
    optn02value.onChange = function(){ optn02slider.value = optn02value.text };
    optn03slider.onChanging = function(){ optn03value.text = Math.round ( optn03slider.value ); };
    optn03value.onChange = function(){ optn03slider.value = optn03value.text };
    btnA.onClick = function(){ CTsaveString( "CTboxSave" , "verticalOriginalStep" , optn01value.text ); CTsaveString( "CTboxSave" , "horizontalOriginalStep" , optn02value.text ); CTsaveString( "CTboxSave" , "horizontalScanHeight" , optn03value.text ); getLayerBottomOptionsDialog.close(); };
    btnB.onClick = function(){ optn01value.text = 50 ; optn01value.notify();  optn02value.text = 20 ; optn02value.notify(); optn03value.text = 50 ; optn03value.notify(); };
    //Showing UI.
    getLayerBottomOptionsDialog.show();

}