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
    if( layerSelection.length > 0 ){
        var layersToAnalyse = []
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
            //Creating variables for the start and end of the analysis depending of the shortcuts.
            var analysisStartTime = layer.inPoint ;
            var analysisEndTime = layer.outPoint ;
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
            if( layer.analysisDuration <= 0 ){
                layer.toBeProcessed = false ;
            }
            //Creating a variables for the existance of previously created lowest Point and effects active.
            layer.hasEffectActive = false ;
            layer.existingLowestPoint = false ;
            layer.lowestPointKeys = [];
            //Check if the Content Lowest Point has already been detected or not.
            if( layerSelection[i].property("ADBE Effect Parade").property( "CTbox - Content Lowest Point" ) != null ){
                layer.existingLowestPoint = true ;
                layer.lowestPointKeys = CTsavePropertyKeys( layerSelection[i].property("ADBE Effect Parade").property( "CTbox - Content Lowest Point" ).property( 2 ) );
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
        //Opening the dialog allowing the user to choose whether to continue or abort an analyse.
        layersToAnalyse = layerAnalysisChoiceDialog( layersToAnalyse );
        //Analysing the layers selected.
        if( layersToAnalyse.length > 0 ){
            //Getting the saved Parameters.
            var verticalOriginalStep = CTgetSavedString( "CTboxSave" , "verticalOriginalStep" );
            if( verticalOriginalStep == null ){ verticalOriginalStep = 50 };
            var horizontalOriginalStep = CTgetSavedString( "CTboxSave" , "horizontalOriginalStep" );
            if( horizontalOriginalStep == null ){ horizontalOriginalStep = 20 };
            var horizontalScanHeight = CTgetSavedString( "CTboxSave" , "horizontalScanHeight" );
            if( horizontalScanHeight == null ){ horizontalScanHeight = 50 };
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
                    //Adding a Slider with expression to get the lowest Y in with alpha.
                    var Yslider = layersToAnalyse[i].object.property("ADBE Effect Parade").addProperty( "ADBE Slider Control" );
                    Yslider.name = "BottomY" ;
                    Yslider.property(1).expression = "//---- Code ----\
const originalStep = " + verticalOriginalStep + " ;\
var bottomY = thisLayer.height ;\
var step = originalStep ;\
var alpha = 0 ;\
for( var i = bottomY - 1 ; i >= 0 ; i -= parseInt( step ) ){\
	alpha = thisLayer.sampleImage( [ thisLayer.width / 2 , i ] , [ thisLayer.width / 2 , .5 ] , true )[3].toFixed(2);\
	if( i == bottomY - 1 && alpha > 0 ){\
		break ;\
	}\
	if( step == -1 && alpha == 0 ){\
		bottomY = i ;\
		break ;\
	} else if( step == 1 && alpha > 0 ){\
		bottomY = i + 1 ;\
		break ;\
	} else if( step > 0 && alpha > 0 ){\
		step = ( step * -.5 ).toFixed(0);\
	} else if( step < 0 && alpha == 0 ){\
		step = ( step * -.5 ).toFixed(0);\
	}\
}\
//---- Result ----\
bottomY" ;
                    //Converting the expression to keys.
                    Yslider.property(1).selected = true ;
                    app.executeCommand( 2639 ); //Execute the command "Animation > Keyframe Assistant > Convert Expression to Keyframes".
                    //Adding a Slider with expression to get the leftmostpoint with alpha.
                    var XleftSlider = layersToAnalyse[i].object.property("ADBE Effect Parade").addProperty( "ADBE Slider Control" );
                    XleftSlider.name = "leftX" ;
                    XleftSlider.property(1).expression = "//---- Code ----\
const originalStep = " + horizontalOriginalStep + " ;\
const locatorHeight = " + horizontalScanHeight + " ;\
var leftX = 0 ;\
var step = originalStep ;\
var alpha = 0 ;\
for( var i = leftX ; i < thisLayer.width ; i += parseInt( step ) ){\
	alpha = thisLayer.sampleImage( [ i , effect( \"BottomY\" )(1) - locatorHeight / 2 ] , [ .5 , locatorHeight / 2 ] , true )[3].toFixed(2);\
		if( i == leftX && alpha > 0 ){\
		break ;\
	}\
	if( step == -1 && alpha == 0 ){\
		leftX = i + 1 ;\
		break ;\
	} else if( step == 1 && alpha > 0 ){ \
		leftX = i ;\
		break ;\
	} else if( step > 0 && alpha > 0 ){\
		step = ( step * -.5 ).toFixed(0);\
	} else if( step < 0 && alpha == 0 ){\
		step = ( step * -.5 ).toFixed(0);\
	}\
}\
//---- Result ----\
leftX" ;
                    //Converting the expression to keys.
                    XleftSlider.property(1).selected = true ;
                    app.executeCommand( 2639 ); //Execute the command "Animation > Keyframe Assistant > Convert Expression to Keyframes".
                    //Adding a Slider with expression to get the rightmost point with alpha.
                    var XrightSlider = layersToAnalyse[i].object.property("ADBE Effect Parade").addProperty( "ADBE Slider Control" );
                    XrightSlider.name = "rightX" ;
                    XrightSlider.property(1).expression = "//---- Code ----\
const originalStep = " + horizontalOriginalStep + " ;\
const locatorHeight = " + horizontalScanHeight + " ;\
var rightX = thisLayer.height ;\
var step = originalStep ;\
var alpha = 0 ;\
for( var i = rightX - 1 ; i >= 0 ; i -= parseInt( step ) ){\
	alpha = thisLayer.sampleImage( [ i , effect( \"BottomY\" )(1) - locatorHeight / 2 ] , [ .5 , locatorHeight / 2 ] , true )[3].toFixed(2);\
	if( i == rightX - 1 && alpha > 0 ){\
		break ;\
	}\
	if( step == -1 && alpha == 0 ){\
		rightX = i ;\
		break ;\
	} else if( step == 1 && alpha > 0 ){\
		rightX = i + 1 ;\
		break ;\
	} else if( step > 0 && alpha > 0 ){\
		step = ( step * -.5 ).toFixed(0);\
	} else if( step < 0 && alpha == 0 ){\
		step = ( step * -.5 ).toFixed(0);\
	}\
}\
//---- Result ----\
rightX" ;
                    //Converting the expression to keys.
                    XrightSlider.property(1).selected = true ;
                    app.executeCommand( 2639 ); //Execute the command "Animation > Keyframe Assistant > Convert Expression to Keyframes".
                    //Applying the final preset.
                    if( !layersToAnalyse[i].existingLowestPoint ){ layersToAnalyse[i].object.applyPreset( new File( scriptFolder.fsName + "/CTboxElements/06_PseudoEffects/LayerLowestPoint v1.ffx" ) ); }
                    var lowestPoint = layersToAnalyse[i].object.property("ADBE Effect Parade").property("CTbox - Content Lowest Point");
                    lowestPoint.property(2).expression = "//---- Links ----\
var BottomY = effect( \"BottomY\" )(1);\
var leftX = effect( \"leftX\" )(1);\
var rightX = effect( \"rightX\" )(1);\
\
//---- Code ----\
var X = ( leftX + rightX ) / 2 ;\
var Y = BottomY ;\
\
//---- Result ----\
[ X , Y ]";
                    //Converting the expression to keys.
                    lowestPoint.property(2).selected = true ;
                    app.executeCommand( 2639 ); //Execute the command "Animation > Keyframe Assistant > Convert Expression to Keyframes".
                    //PArsing the keys to put them in hold mode and remove the keys that have the same value as the previous one.
                    for( var j = 1 ; j <= lowestPoint.property(2).numKeys ; j++ )
                    {
                        if( j > 1 && JSON.stringify( lowestPoint.property(2).keyValue(j) ) == JSON.stringify( lowestPoint.property(2).keyValue( j - 1 ) ) ){
                            lowestPoint.property(2).removeKey(j);
                            j-- ;
                            continue ;
                        }
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
                    layersToAnalyse[i].object.property("ADBE Effect Parade").property( "BottomY" ).remove();
                    layersToAnalyse[i].object.property("ADBE Effect Parade").property( "leftX" ).remove();
                    layersToAnalyse[i].object.property("ADBE Effect Parade").property( "rightX" ).remove();
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