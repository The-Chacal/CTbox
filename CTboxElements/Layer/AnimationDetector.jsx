//****************************************//
//  Animation Detector v1.1
//****************************************//

//  Functions adding a Marker on the layer as soon as there is some change in it.
/**
 * Creates the UI
 */
function animDetectionDlg(){
    
    var animDetectionDlg = new Window( "palette" , { en: "Detection Settings" , fr: "Paramètres de Detection"} );
    animDetectionDlg.global = animDetectionDlg.add( "group" );
    animDetectionDlg.global.preferredSize = [ 200 , -1 ];
    animDetectionDlg.global.orientation = "Column" ;
    animDetectionDlg.global.alignChildren = "fill" ;
    animDetectionDlg.global.spacing = 0 ;
        var presetLine = animDetectionDlg.global.add( "group" );
        presetLine.alignChildren = [ "center" , "fill"];
            presetLine.add( "statictext{ text: 'Preset : ' , characters: 5 }" );
            var presetSelector = presetLine.add( "dropdownlist" , undefined , [ { en: "None" , fr: "Aucun" } , "Anim 2D/3D" , "Stopmotion" ] );
            presetSelector.selection = presetSelector.items[0];
        var settings = animDetectionDlg.global.add( "panel" , undefined , { en: "Settings : " , fr: "Paramètres" } );
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
        var buttons = animDetectionDlg.global.add( "group" );
        buttons.alignChildren = [ "center" , "fill"];
        buttons.margins = 5 ;
            var BtnA = buttons.add( "button" , undefined , { en: "Continue" , fr: "Continuer" } );
            var BtnB = buttons.add( "button" , undefined , { en: "Cancel" , fr: "Annuler" } );
    //UI Parameters
    animDetectionDlg.defaultElement = BtnA ;
    animDetectionDlg.cancelElement = BtnB ;
    //Getting saved settings.
    var savedPrecisionDegree = CTgetSavedString( "CTboxSave" , "precisionDegree" );
    var savedToleranceDegree = CTgetSavedString( "CTboxSave" , "toleranceDegree" );
    //UI Events
    presetSelector.onChange = function(){ if( presetSelector.selection.text == "Anim 2D/3D"){ precisionValue.text = 1 , precisionSlider.value = 1 , toleranceValue.text = 0 , toleranceSlider.value = 0 } else if( presetSelector.selection.text == "Stopmotion"){ precisionValue.text = 4 , precisionSlider.value = 4 , toleranceValue.text = 1 , toleranceSlider.value = 1 } };
    precisionValue.onChange = function(){ precisionSlider.value = precisionValue.text };
    precisionSlider.onChanging = function(){ precisionValue.text = Math.round( precisionSlider.value ); };
    toleranceValue.onChange = function(){ toleranceSlider.value = toleranceValue.text };
    toleranceSlider.onChanging = function(){ toleranceValue.text = Math.round( toleranceSlider.value * 10 ) /10 ; };
    BtnA.onClick = function(){ if( detectAnimation( precisionValue.text , toleranceValue.text ) ){ animDetectionDlg.close(); } };
    BtnB.onClick = function(){ animDetectionDlg.close(); };
    //Showing UI
    if( savedPrecisionDegree != null && savedToleranceDegree != null ){ precisionSlider.value = savedPrecisionDegree ; precisionValue.text = precisionSlider.value; toleranceSlider.value = savedToleranceDegree ; toleranceValue.text = toleranceSlider.value ; }
    animDetectionDlg.show();
}
/**
 * Detects the animation on the layer by using an expression, converting to keys, then to markers.
 * @param { number } precisionDegree The degree of precision expected.
 * @param { number } toleranceDegree The degree of tolerance wanted.
 * @returns { boolean } Success
 */
function detectAnimation( precisionDegree , toleranceDegree ){

    //Saving the parameters if they are valid.
    precisionDegree = CTcleanNumberString( precisionDegree , false );
    toleranceDegree = CTcleanNumberString( toleranceDegree , false );
    if( precisionDegree == null || toleranceDegree == null ){ return false ;}
    CTsaveString( "CTboxSave" , "precisionDegree" , precisionDegree );
    CTsaveString( "CTboxSave" , "toleranceDegree" , toleranceDegree );

    var layerSelection = CTcheckSelectedLayers();
    if( layerSelection.length > 0 ){
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            //Opening the UndoGroup.
            app.beginUndoGroup( { en: "Animation Detection." , fr: "Detection de l'Animation." } );
            //Checking if there is any effects on the layer.
            if( layerSelection[i].property( "ADBE Effect Parade" ).numProperties > 0 ){
                for( var j = 1 ; j <= layerSelection[i].property( "ADBE Effect Parade" ).numProperties ; j++ ){
                    if( layerSelection[i].property( "ADBE Effect Parade" ).property(j).active ){
                        if( !CTchoiceDlg( { en: "So..." , fr: "Alors..."} , { en: "   This action is heavy duty.\n   You should disable your effects that do not alter the position of the animation first.\n\n   Do we continue or do you modify?" , fr: "   Cette action est lourde à éxécuter.\n   Mieux vaut désactiver tes effets non-nécessaires à cette détection d'abord\n\n   On Continue ou tu modifies?" } , { en: "Continue" , fr: "Continuer" } , { en: "Modify" , fr: "Modifier" } ) ){
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
        CTalertDlg( { en: "I'm Done" , fr: "J'ai Fini" } , { en: "I've finished detecting Animation on your layers." , fr: "   J'ai fini de détecter les phases d'anim de tes calques." } );
        return true ;
    }
    return false ;
    
}