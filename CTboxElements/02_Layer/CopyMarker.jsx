//****************************************//
//  Markers Copier
//****************************************//

//  Functions copying markers from one to a selection of others.
/**
 * Creates the UI.
 */
function copyMarkerChoice(){

    if( app.project.activeItem != undefined && app.project.activeItem.numLayers > 1 ){
        //Getting the path to the Script on the Computer.
        var scriptFolder = CTgetScriptFolder();
        //Getting the names of the active Composition layers.
        var compLayersNames = getLayersNames();
        //Creating the dialog.
        var copyMarkerChoiceDlg = new Window( "palette" , "Choose your Layers." );
        copyMarkerChoiceDlg.preferredSize = [ 300 , -1 ];
        copyMarkerChoiceDlg.alignChildren = "fill" ;
        copyMarkerChoiceDlg.margins = [ 10 , 5 , 10 , 10 ];
        copyMarkerChoiceDlg.spacing = 2 ;
            var block01 = copyMarkerChoiceDlg.add( "panel" , undefined , "Markers to Copy : " );
            block01.alignChildren = "fill" ;
            block01.margins = [ 5 , 10 , 5 , 5 ];
                var refLayerSelector = block01.add( "dropdownlist" , undefined , compLayersNames );
                refLayerSelector.title = "Source Layer" ;
                refLayerSelector.titleLayout.characters = 10 ;
            var block02 = copyMarkerChoiceDlg.add( "panel" , undefined , "Layers to Modifiy" );
            block02.alignChildren = "fill" ;
            block02.margins = [ 5 , 10 , 5 , 5 ];
            block02.spacing = 2 ;
                block02.rows = block02.add( "group" );
                block02.rows.alignChildren = "fill" ;
                block02.rows.orientation = "column" ;
                block02.rows.spacing = 2
                    var rows = {} ;
                block02.Btns = block02.add( "group" );
                block02.Btns.alignment = "right" ;
                block02.Btns.spacing = 2 ;
                block02.Btns.margins = [ 0 , 2 , 0 , 0 ] ;
                    var btnSize = [ 16 , 16 ];
                    var refreshLayersListBtn = block02.Btns.add( "iconButton" , undefined , new File( scriptFolder.fsName + "/CTboxElements/05_PNGs/w12-Actualise.png") );
                    refreshLayersListBtn.size = btnSize ;
                    var addRowBtn = block02.Btns.add( "iconButton" , undefined , new File( scriptFolder.fsName + "/CTboxElements/05_PNGs/w12-Plus.png") );
                    addRowBtn.size = btnSize ;
                    var deleteRowBtn = block02.Btns.add( "iconButton" , undefined , new File( scriptFolder.fsName + "/CTboxElements/05_PNGs/w12-Minus.png") );
                    deleteRowBtn.size = btnSize ;
            var block03 = copyMarkerChoiceDlg.add( "group" );
            block03.orientation = "row" ;
            block03.alignment = "right" ;
            block03.spacing = 0 ;
            block03.margins = [ 0 , 0 , 0 , 0];
                var B03BtnA = block03.add( "button" , undefined , "Copy" );
                B03BtnA.size = [ 75 , 25 ] ;
                var B03BtnB = block03.add( "button" , undefined , "Cancel" );
                B03BtnB.size = [ 75 , 25 ] ;
        //UI Events.
        refreshLayersListBtn.onClick = function(){ refreshLayersList( refLayerSelector ); for( var i = 0 ; i < block02.rows.children.length ; i++ ){ refreshLayersList( block02.rows.children[i] ); } }
        addRowBtn.onClick = function() { rowManager( block02.rows , rows , 1 ) ; };
        deleteRowBtn.onClick = function() { rowManager( block02.rows , rows , -1 ) ; };
        B03BtnA.onClick = function() { if( copyMarkers( refLayerSelector.selection.index + 1 , block02.rows ) ) { copyMarkerChoiceDlg.close(); } };
        B03BtnB.onClick = function() { copyMarkerChoiceDlg.close(); };
        //Updating the UI according to the number of selected layers.
        var LayerSelection = CTcheckSelectedLayers() ;
        if( LayerSelection.length > 1 ){
            rows = rowManager( block02.rows , rows , LayerSelection.length - 1 , compLayersNames );
        } else {
            rows = rowManager( block02.rows , rows , 1 , compLayersNames );
        }
        if( LayerSelection.length >= 1 ){
            refLayerSelector.selection = refLayerSelector.items[ LayerSelection[0].index - 1 ];
            if( LayerSelection.length > 1 ){
                for( var i = 1 ; i < LayerSelection.length ; i ++ ){
                    rows[ "Row" + i ].selection = rows[ "Row" + i ].items[ LayerSelection[i].index - 1 ];
                }
            } else {
                rows[ "Row1" ].selection = rows[ "Row1" ].items[0] ;
            }
        } else {
            refLayerSelector.selection = refLayerSelector.items[0];
            rows[ "Row1" ].selection = rows[ "Row1" ].items[1] ;
        }
        //UI Parameters.
        copyMarkerChoiceDlg.defaultElement = B03BtnA ;
        copyMarkerChoiceDlg.cancelElement = B03BtnB ;
        //Showing UI.
        copyMarkerChoiceDlg.show();
    }

}
/**
 * Refresh the items of a dropdownlist.
 * @param { Object } dropdownlist The dropdownlist to update.
 */
function refreshLayersList( dropdownlist ){

    //Saving the selection of the dropdownlist.
    var oldSelection = dropdownlist.selection.index ;
    //Getting the new list of names.
    var compLayersNames = getLayersNames();
    if( compLayersNames.length > 0 ){
        //Clearing all the items of the list.
        dropdownlist.removeAll();
        //Updating the list of items.
        for( var i = 0 ; i < compLayersNames.length ; i++ )
        {
            dropdownlist.add( "item" , compLayersNames[i] );
        }
        //Checking if the old selection is now out of range.
        if( oldSelection > dropdownlist.items.length ){ oldSelection = dropdownlist.items.length ;}
        //Restoring selection.
        dropdownlist.selection = dropdownlist.items[ oldSelection ];
    }

}
/** 
 * Gets the names of the layers in the active Composition.
 * @returns { Array } The layers names.
*/
function getLayersNames(){

    var compActive = app.project.activeItem ;
    var compLayersNames = [] ;
    for( var i = 1 ; i <= compActive.layers.length ; i++ ){
        compLayersNames.push( i + " - " + compActive.layer(i).name );
    }
    return compLayersNames ;

}
/**
 * Adds/Removes rows from the UI. 
 * @param { Object } dlgGroup Container.
 * @param { Object } rows Contains the Rows objects.
 * @param { number} nbRows Number of Rows to add/remove. 
 * @returns { object } Contains the updated Rows.
 */
function rowManager( dlgGroup, rows , nbRows ){

    var itemsList = getLayersNames();
    if( nbRows > 0 && dlgGroup.children.length <= itemsList.length - 2 )//-2 pour ne pas compter l'item vide ni l'item utilisé comme référence.
    {
        var NbExistingRows = dlgGroup.children.length ;
        for( var i = 1 ; i <= nbRows ; i++ )
        {
            rows[ "Row" + ( NbExistingRows + i ) ] = dlgGroup.add( "dropdownlist" , undefined , itemsList );
            rows[ "Row" + ( NbExistingRows + i ) ].title = "Layer " + parseFloat( NbExistingRows + i ) + " : " ;
            rows[ "Row" + ( NbExistingRows + i ) ].titleLayout.characters = 10 ;
            rows[ "Row" + ( NbExistingRows + i ) ].selection = rows[ "Row" + ( NbExistingRows + i ) ].items[ i - 1 ] ;
        }
    } else if( nbRows < 0 && dlgGroup.children.length > 1) {
        var NbRows = dlgGroup.children.length ;
        dlgGroup.remove( dlgGroup.children[ NbRows - 1 ] );
    }
    dlgGroup.window.preferredSize = [ 300 , -1 ];
    dlgGroup.window.layout.layout( true );
    return rows

}
/**
 * Copies the Markers from the Reference Layer to the selected Layers. 
 * @param { number } RefLayerIndex The index of the reference Layer.
 * @param { object } dlgGroup Contains the Rows.
 * @returns { boolean } Success.
 */
function copyMarkers( RefLayerIndex , dlgGroup ){

    var compActive = app.project.activeItem ;
    var MarkersToCopy = [] ;
    //Getting any marker on the reference Layer.
    if( compActive.layer( RefLayerIndex ).property(1).numKeys > 0 ){   
        for( var i = 1 ; i <= compActive.layer( RefLayerIndex ).property(1).numKeys ; i++ ){
            MarkersToCopy.push( compActive.layer( RefLayerIndex ).property(1).keyTime( i ) );
        }
    } else {
        CTalertDlg( "No, no , no..." , "   There is no Markers on the Source Layer.\n   What do you want me to do???" );
        return false ;
    }
    //Creating an array with the indexes of the target layers.
    var layersToModifyIndexes = [] ;
    for( i = 0 ; i < dlgGroup.children.length ; i++ ){
        if( dlgGroup.children[i].selection.index + 1 != RefLayerIndex ){
            var isSaved = false
            for( var j = 0 ; j < layersToModifyIndexes.length ; j++ ){
                if( dlgGroup.children[i].selection.index + 1 == layersToModifyIndexes[j] ){
                    isSaved = true ;
                    break ;
                }
            }
            if( !isSaved ){ layersToModifyIndexes.push( dlgGroup.children[i].selection.index + 1 ); }
        }
    }
    //Copying the markers on the targeted layers
    for( i = 0 ; i < layersToModifyIndexes.length ; i++ ){
        //Opening the UndoGroup.
        app.beginUndoGroup( "Markers Copy" );
        for( var j = 0 ; j < MarkersToCopy.length ; j++ ){
            compActive.layer( layersToModifyIndexes[i] ).property(1).addKey( MarkersToCopy[j] );
        }
        //Closing the UndoGroup.
        app.endUndoGroup();

    }
    CTalertDlg( "I'm Done" , "    I've finished copying Markers." );
    return true ;

}