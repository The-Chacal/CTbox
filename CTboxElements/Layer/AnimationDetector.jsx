//****************************************//
//  Animation Detector
//****************************************//

//  Functions adding a Marker on the layer as soon as there is some change in it.
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
    btnA.onClick = function(){ var precisionParameter = CTcleanNumberString( precisionValue.text , false ); var toleranceParameter = CTcleanNumberString( toleranceValue.text , false ); if(  precisionParameter != null && toleranceParameter != null ){ { CTsaveString( "CTboxSave" , "PrecisionDegree" , precisionValue.text ); CTsaveString( "CTboxSave" , "ToleranceDegree" , toleranceValue.text ); animDetectionDlg.close(); };};};
    //Showing UI
    animDetectionDlg.show();
}
/**
 * Detects the animation on the layer by using an expression, converting to keys, then to markers.
 * @returns { boolean } Success
 */
function detectAnimation(){

    //Getting the saved parameters.
    var precisionDegree = CTgetSavedString( "CTboxSave" , "PrecisionDegree" );
    if( precisionDegree == null ){ precisionDegree = 1 };
    var toleranceDegree = CTgetSavedString( "CTboxSave" , "ToleranceDegree" );
    if( toleranceDegree == null ){ toleranceDegree = 0 };
    //Getting to work.
    var layerSelection = CTcheckSelectedLayers();
    if( layerSelection.length > 0 ){
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            //Opening the UndoGroup.
            app.beginUndoGroup( "Animation Detection." );
            //Checking if there is any effects on the layer.
            if( layerSelection[i].property( "ADBE Effect Parade" ).numProperties > 0 ){
                for( var j = 1 ; j <= layerSelection[i].property( "ADBE Effect Parade" ).numProperties ; j++ ){
                    if( layerSelection[i].property( "ADBE Effect Parade" ).property(j).active ){
                        if( !CTchoiceDlg( "So..." , "   This action is heavy duty.\n   You should disable your effects that do not alter the position of the animation first.\n\n   Do we continue or do you modify?" , "Continue" , "Modify" ) ){
                            return false ;
                        } else {
                            break ;
                        }
                    }
                }
            }
            //Adding the expression detecting the movement
            var changeDetector = layerSelection[i].property( "ADBE Effect Parade" ).addProperty( "ADBE Slider Control" );
            changeDetector.name = "LayerColorControl" ;
            changeDetector = changeDetector.property(1);
            changeDetector.expression = "var Precision = Math.pow( 2 , " + precisionDegree + " );\
var Tolerance = " + toleranceDegree + ";\
var Setting = [thisLayer.width / Precision , thisLayer.height / Precision ];\
var AverageDelta = 0;\
for( var y = Setting[1] ; y < thisLayer.height ; y += 2 * Setting[1] )\
{\
    for( var x = Setting[0] ; x < thisLayer.width ; x += 2 * Setting[0] )\
    {\
        var ColorA = thisLayer.sampleImage( [ x , y ] , Setting , postEffect = true , time );\
        var ColorB = thisLayer.sampleImage( [ x , y ] , Setting , postEffect = true , time - thisComp.frameDuration );\
        var DeltaAB = 0 ;\
        for( var i = 0 ; i < 4 ; i++ )\
        {\
            DeltaAB += Math.max( 0 , Math.abs( ColorA[i] - ColorB[i] ) * 100 - Tolerance );\
        }\
        AverageDelta = ( AverageDelta + DeltaAB / 4 );\
    }\
}\
if( AverageDelta == 0 )\
{ 0; } else { 1; }";
            changeDetector.selected = true ;
            app.executeCommand( 2639 ); //Execute the commande "Animation > Keyframe Assistant > Convert Expression to Keyframes".
            changeDetector.selected = false ;
            changeDetector.expression = "" ;
            for( j = 1 ; j <= changeDetector.numKeys ; j ++ ){
                if( j == 1 || changeDetector.keyValue( j ) == 1 ){
                    layerSelection[i].property(1).addKey( changeDetector.keyTime( j ) );
                }
            }
            changeDetector.parentProperty.remove();
            //Closing the UndoGroup.
            app.endUndoGroup();
        }
        //Recreating the original layer selection.
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            layerSelection[i].selected = true ;
        }
        CTalertDlg( "I'm Done" , "   I've finished detecting Animation on your layers." );
        return true ;
    }
    return false ;
    
}