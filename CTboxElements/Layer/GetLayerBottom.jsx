//****************************************//
//   Get Layer's Content Lowest Point v2.3
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
    //Starting the true work.
    var layerSelection = CTcheckSelectedLayers() ;
    if( layerSelection.length > 0 ){
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            //Check if the Content lowest point has already been detected or not.
            if( layerSelection[i].property("ADBE Effect Parade").property( "CTbox - Content Lowest Point" ) != null && !CTchoiceDlg( "Arg..." , { en: "   It seems like you have already detected the content lowest point for the layer \"" + layerSelection[i].name + "\".\n\n   Are you sure that you want to do it again?" , fr: "   Il semblerait que tu ais déjà détecté le point le plus bas de ce calque \"" + layerSelection[i].name + "\".\n\n   Es-tu sûr de vouloir le refaire?" })){
                return false ;
            }
            //Checks if there is any effects on the layer and asks to continue or not if there is some.
            if( layerSelection[i].property("ADBE Effect Parade").numProperties > 0 ){
                for( var j = 1 ; j <= layerSelection[i].property("ADBE Effect Parade").numProperties ; j++ ){
                    if( layerSelection[i].property("ADBE Effect Parade").property(j).name != "CTbox - Content Lowest Point" && layerSelection[i].property("ADBE Effect Parade").property(j).active ){
                        if( !CTchoiceDlg( { en: "So..." , fr: "Alors..."} , { en: "   This action is heavy duty.\n   You should disable your effects that do not alter the position of the animation first.\n\n   Do we continue or do you modify?" , fr: "   Cette action est lourde à éxécuter.\n   Mieux vaut désactiver tes effets non-nécessaires à cette détection d'abord\n\n   On Continue ou tu modifies?" } , { en: "Continue" , fr: "Continuer" } , { en: "Modify" , fr: "Modifier" } ) ){
                            return false ;
                        } else {
                            break ;
                        }
                    } 
                }
            }
            //Opening the UndoGroup.
            if( hasUndoGroup ){ app.beginUndoGroup( { en: "Lowest Point Detection" , fr: "Detection du point le plus bas." } ); }
            //Getting the saved Parameters.
            var verticalOriginalStep = CTgetSavedString( "CTboxSave" , "verticalOriginalStep" );
            if( verticalOriginalStep == null ){ verticalOriginalStep = 50 };
            var horizontalOriginalStep = CTgetSavedString( "CTboxSave" , "horizontalOriginalStep" );
            if( horizontalOriginalStep == null ){ horizontalOriginalStep = 20 };
            var horizontalScanHeight = CTgetSavedString( "CTboxSave" , "horizontalScanHeight" );
            if( horizontalScanHeight == null ){ horizontalScanHeight = 50 };
            //Adding sliders with expression to get the final point.
            var Yslider = layerSelection[i].property("ADBE Effect Parade").addProperty( "ADBE Slider Control" );
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
            var XleftSlider = layerSelection[i].property("ADBE Effect Parade").addProperty( "ADBE Slider Control" );
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
            var XrightSlider = layerSelection[i].property("ADBE Effect Parade").addProperty( "ADBE Slider Control" );
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
            layerSelection[i].applyPreset( new File( scriptFolder.fsName + "/CTboxElements/PseudoEffects/LayerLowestPoint v1.ffx" ) );
            var lowestPoint = layerSelection[i].property("ADBE Effect Parade").property("CTbox - Content Lowest Point");
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
            lowestPoint.property(2).selected = false ;
            //Removing the expression of the final point.
            lowestPoint.property(2).expression = "" ;
            //Removing the now useless Sliders with heavy expressions.
            layerSelection[i].property("ADBE Effect Parade").property( "DetectedY" ).remove();
            layerSelection[i].property("ADBE Effect Parade").property( "DetectedXleft" ).remove();
            layerSelection[i].property("ADBE Effect Parade").property( "DetectedXright" ).remove();
            //Closing the UndoGroup
            if( hasUndoGroup ){ app.endUndoGroup(); }
        }
        //Recreating the original layer selection.
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            layerSelection[i].selected = true ;
        }
        if( promptEndAlert ){
            CTalertDlg( { en: "I'm Done" , fr: "J'ai Fini" } , { en: "I've finished detecting the lowest point of your layer(s)." , fr: "J'ai fini de detecter le bas de ton/tes calque(s)." } );
        }
        return true ;
    }
    
}
/**
 * Opens a dialog allowing the user to set the option of the search for layer lowest point
 */
function getLayerBottomOptions(){

    var getLayerBottomOptionsDialog = new Window( "dialog" , undefined , undefined , { borderless : true } );
    getLayerBottomOptionsDialog.spacing = 0 ;
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
        btnsRow.margins = [ 0 , 2 , 0 , 0 ];
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