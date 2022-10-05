//****************************************//
//  Markers for Keys Creator
//****************************************//

//  Functions creating a Marker for each animation Key on the layer.
/**
 * Creates the UI allowing the user to choose which type of keys he wants as markers.
 */
function createMarkersForKeysChoice(){
    
    var createMarkersForKeysChoiceDlg = new Window( "palette" , "Choice of the properties to analyse" );
    createMarkersForKeysChoiceDlg.global = createMarkersForKeysChoiceDlg.add( "Group" );
    createMarkersForKeysChoiceDlg.global.preferredSize = [ 150 , -1 ];
        createMarkersForKeysChoiceDlg.global.orientation = "Column" ;
        createMarkersForKeysChoiceDlg.global.alignChildren = "fill" ;
            createMarkersForKeysChoiceDlg.global.Optns = createMarkersForKeysChoiceDlg.global.add( "Panel" , undefined , "Analyse : " );
            createMarkersForKeysChoiceDlg.global.Optns.alignChildren = "Left" ;
            createMarkersForKeysChoiceDlg.global.Optns.margins = [ 10 , 15 , 10 , 0 ];
                var checkTransformProperties = createMarkersForKeysChoiceDlg.global.Optns.add( "Checkbox" , undefined , " - Transformations." );
                checkTransformProperties.characters = 15 ;
                checkTransformProperties.value = true ;
                var checkEffects = createMarkersForKeysChoiceDlg.global.Optns.add( "Checkbox" , undefined , " - Effects." );
                checkEffects.characters = 15 ;
                checkEffects.value = true ;
                var checkLayerStyles = createMarkersForKeysChoiceDlg.global.Optns.add( "Checkbox" , undefined , " - Layer Styles." );
                checkLayerStyles.characters = 15 ;
                checkLayerStyles.value = true ;
            createMarkersForKeysChoiceDlg.global.Btns = createMarkersForKeysChoiceDlg.global.add( "Group" ) ;
            createMarkersForKeysChoiceDlg.global.Btns.alignment = "Center" ;
                var BtnA = createMarkersForKeysChoiceDlg.global.Btns.add( "Button" , undefined , "Confirm" );
                var BtnB = createMarkersForKeysChoiceDlg.global.Btns.add( "Button" , undefined , "Cancel" );
        //UI Events
        BtnA.onClick = function(){ if( layerAnalyser( checkTransformProperties.value , checkEffects.value , checkLayerStyles.value ) ){ createMarkersForKeysChoiceDlg.close(); } }
        BtnB.onClick = function(){ createMarkersForKeysChoiceDlg.close() } ;
        //UI Parameters
        createMarkersForKeysChoiceDlg.active = true ;
        createMarkersForKeysChoiceDlg.defaultElement = BtnA ; 
        //Showing UI
        createMarkersForKeysChoiceDlg.show()
}
/**
 * Adds a Marker for each key found. 
 * @param { boolean } checkTransformProperties Checks the Transform properties of the Layer.
 * @param { boolean } checkEffects Checks the Effects of the Layer.
 * @param { boolean } checkLayerStyles Checks the Layer Styles of the Layer.
 * @returns { boolean } Succes.
 */
function layerAnalyser( checkTransformProperties , checkEffects , checkLayerStyles ){
    
    var LayerSelection = CTcheckSelectedLayers();
    if( LayerSelection.length > 0 ){
        for( var z = 0 ; z < LayerSelection.length ; z++ ){
            //Opening the UndoGroup
            app.beginUndoGroup( "Markers Creation" );
            //Adding Markers for each animaton Key found.
            var CurrentLayer = LayerSelection[z];
            if( checkTransformProperties ){
                markersForKeys( CurrentLayer , CurrentLayer.property(6) , 1 );
            }
            if( checkEffects ){
                markersForKeys( CurrentLayer , CurrentLayer.property( "ADBE Effect Parade" ) , 2 );
            }
            if( checkLayerStyles ){
                markersForKeys( CurrentLayer , CurrentLayer.property(7) , 3 );
            }
            //Closing The UndoGroup
            app.endUndoGroup();
        }
        CTalertDlg( "I'm Done" , "   I've finished creating Markers on your layers." );
        return true ;
    } else {
        return false ;
    }
    
}
/**
 * Recursive function parsing a layer properties in search for keys.
 * @param { object } layerToTreat Layer to work on.
 * @param { object } item PropertyGroup to parse.
 * @param { number } Colour Index of the colour wanted for the Marker. [ 0 - 17 ].  
 */
function markersForKeys( layerToTreat , item , Colour ) {
    
    var myMarker = new MarkerValue("");
    for( var i = 1 ; i <= item.numProperties ; i++ ){
        if( item.property(i).numProperties != undefined ){
            markersForKeys( layerToTreat , item.property(i) , Colour )
        } else {
            if( item.property(i).numKeys > 0 ){
                for( var j = 1 ; j <= item.property(i).numKeys ; j++ ){
                    var KeyTime = parseFloat( item.property(i).keyTime( j ) );
                    myMarker.label = Colour ;
                    layerToTreat.property(1).setValueAtTime( KeyTime , myMarker );
                }
            }
        }
    }
    
}