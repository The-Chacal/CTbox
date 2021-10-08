//****************************************//
//  Copy Markers v1.0
//****************************************//

//  Functions copying markers from one to a selection of others.
/**
 * Creates the UI.
 */
function copyMarkerChoice(){

    if( app.project.activeItem != undefined && app.project.activeItem.numLayers > 1 ){
        //Saving the names of the active Composition layers.
        var compActive = app.project.activeItem ;
        var compLayersNames = [] ;
        for( var i = 1 ; i <= compActive.layers.length ; i++ ){
            compLayersNames.push( i + " - " + compActive.layer(i).name );
        }
        //Creating the UI.
        var copyMarkerChoiceDlg = new Window( "palette" , { en: "Choose your Layers." , fr: "Choisis tes Calques." } );
        copyMarkerChoiceDlg.global = copyMarkerChoiceDlg.add( "Group" );
        copyMarkerChoiceDlg.global.preferredSize = [ 300 , -1 ];
        copyMarkerChoiceDlg.global.orientation = "Column" ;
        copyMarkerChoiceDlg.global.alignChildren = "fill" ;
        copyMarkerChoiceDlg.global.spacing = 0 ;
            var Bloc1 = copyMarkerChoiceDlg.global.add( "Panel" , undefined , { en: "Markers to Copy : " , fr: "Marqueurs à Copier : " } );
            Bloc1.alignChildren = "Fill" ;
                var refLayerSelector = Bloc1.add( "Dropdownlist" , undefined , compLayersNames );
                refLayerSelector.title = { en: "Source Layer" , fr: "Calque Source : " } ;
                refLayerSelector.titleLayout.characters = 10 ;
            var Bloc2 = copyMarkerChoiceDlg.global.add( "Panel" , undefined , { en: "Layers to Modifiy" , fr: "Calque(s) à Modifier : " } );
            Bloc2.alignChildren = "Fill" ;
            Bloc2.spacing = 2 ;
                Bloc2.rows = Bloc2.add( "Group" );
                Bloc2.rows.alignChildren = "Fill" ;
                Bloc2.rows.orientation = "Column" ;
                Bloc2.rows.spacing = 2
                    var rows = {} ;
                Bloc2.Btns = Bloc2.add( "Group" );
                Bloc2.Btns.alignment = "Right" ;
                Bloc2.Btns.spacing = 2 ;
                Bloc2.Btns.margins = [ 0 , 2 , 0 , 0 ] ;
                    var addRowBtn = Bloc2.Btns.add( "IconButton" , undefined , new File( Folder.appPackage.fsName + "/PNG/SP_Add_Sm_N_D.png") );
                    addRowBtn.size = [ 20 , 20 ] ;
                    var deleteRowBtn = Bloc2.Btns.add( "IconButton" , undefined , new File( Folder.appPackage.fsName + "/PNG/SP_Minus_Sm_N_D.png") );
                    deleteRowBtn.size = [ 20 , 20 ] ;
            var Bloc3 = copyMarkerChoiceDlg.global.add( "Group" );
            Bloc3.orientation = "Row" ;
            Bloc3.alignment = "Center" ;
            Bloc3.margins = [ 5 , 5 , 5 , 0];
                var B3Btn1 = Bloc3.add( "Button" , undefined , { en: "Copy" , fr: "Copier" } );
                B3Btn1.size = [ 75 , 25 ] ;
                var B3Btn2 = Bloc3.add( "Button" , undefined , { en: "Cancel" , fr: "Annuler" } );
                B3Btn2.size = [ 75 , 25 ] ;
        //UI Events.
        addRowBtn.onClick = function() { rowManager( Bloc2.rows , rows , 1 , compLayersNames ) ; };
        deleteRowBtn.onClick = function() { rowManager( Bloc2.rows , rows , -1 , compLayersNames ) ; };
        B3Btn1.onClick = function() { if( copyMarkers( refLayerSelector.selection.index + 1 , Bloc2.rows ) ) { copyMarkerChoiceDlg.close(); } };
        B3Btn2.onClick = function() { copyMarkerChoiceDlg.close(); };
        //Updating the UI according to the number of selected layers.
        var LayerSelection = CTcheckSelectedLayers() ;
        if( LayerSelection.length > 1 ){
            rows = rowManager( Bloc2.rows , rows , LayerSelection.length - 1 , compLayersNames );
        } else {
            rows = rowManager( Bloc2.rows , rows , 1 , compLayersNames );
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
        copyMarkerChoiceDlg.defaultElement = B3Btn1 ;
        copyMarkerChoiceDlg.cancelElement = B3Btn2 ;
        //Showing UI.
        copyMarkerChoiceDlg.show();
    }

}
/**
 * Adds/Removes rows from the UI. 
 * @param { string } DlgGroup Name of the concerned Container.
 * @param { Object } rows Contains the Rows objects.
 * @param { number} nbRows Number of Rows to add/remove. 
 * @param { array} ItemList Contains the Names to display in the dropdownlists.
 * @returns { object } Contains the updated Rows.
 */
function rowManager( DlgGroup, rows , nbRows , ItemList ){

    if( nbRows > 0 && DlgGroup.children.length <= ItemList.length - 2 )//-2 pour ne pas compter l'item vide ni l'item utilisé comme référence.
    {
        var NbExistingRows = DlgGroup.children.length ;
        for( var i = 1 ; i <= nbRows ; i++ )
        {
            rows[ "Row" + ( NbExistingRows + i ) ] = DlgGroup.add( "Dropdownlist" , undefined , ItemList );
            rows[ "Row" + ( NbExistingRows + i ) ].title = { en: "Layer " + parseFloat( NbExistingRows + i ) + " : " , fr: "Calque " + parseFloat( NbExistingRows + i ) + " : " } ;
            rows[ "Row" + ( NbExistingRows + i ) ].titleLayout.characters = 10 ;
            rows[ "Row" + ( NbExistingRows + i ) ].selection = rows[ "Row" + ( NbExistingRows + i ) ].items[ i - 1 ] ;
        }
    } else if( nbRows < 0 && DlgGroup.children.length > 1) {
        var NbRows = DlgGroup.children.length ;
        DlgGroup.remove( DlgGroup.children[ NbRows - 1 ] );
    }
    DlgGroup.window.preferredSize = [ 300 , -1 ];
    DlgGroup.window.layout.layout( true );
    return rows

}
/**
 * Copies the Markers from the Reference Layer to the selected Layers. 
 * @param { number } RefLayerIndex The index of the reference Layer.
 * @param { object } DlgGroup Contains the Rows.
 * @returns { boolean } Success.
 */
function copyMarkers( RefLayerIndex , DlgGroup ){

    var compActive = app.project.activeItem ;
    var MarkersToCopy = [] ;
    //Getting any marker on the reference Layer.
    if( compActive.layer( RefLayerIndex ).property(1).numKeys > 0 ){   
        for( var i = 1 ; i <= compActive.layer( RefLayerIndex ).property(1).numKeys ; i++ ){
            MarkersToCopy.push( compActive.layer( RefLayerIndex ).property(1).keyTime( i ) );
        }
    } else {
        CTalertDlg( { en: "No, no , no..." , fr: "Non, non, non..." } , { en: "   There is no Markers on the Source Layer.\n   What do you want me to do???" , fr: "   Il n'y a pas de marqueurs sur le Calque Source.\n   Tu veux que je fasse quoi???"});
        return false ;
    }
    //Creating an array with the indexes of the target layers.
    var LayersToModifyIndex = [] ;
    for( i = 0 ; i < DlgGroup.children.length ; i++ ){
        if( DlgGroup.children[i].selection.index + 1 != RefLayerIndex ){
            for( var j = 0 ; j < LayersToModifyIndex.length ; j++ ){
                if( DlgGroup.children[i].selection.index + 1 == LayersToModifyIndex[j] ){
                    LayersToModifyIndex.push( DlgGroup.children[i].selection.index + 1 );
                    break ;
                }
            }
        }
    }
    //Copying the markers on the targeted layers
    for( i = 0 ; i < LayersToModifyIndex.length ; i++ ){
        //Opening the UndoGroup.
        app.beginUndoGroup( { en: "Markers Copy" , fr: "Copie de Marqueurs" } );
        for( var j = 0 ; j < MarkersToCopy.length ; j++ ){
            compActive.layer( LayersToModifyIndex[i] ).property(1).addKey( MarkersToCopy[j] );
        }
        //Closing the UndoGroup.
        app.endUndoGroup();

    }
    CTalertDlg( { en: "I'm Done" , fr: "J'ai Fini" } , { en: "I've finished copying Markers." , fr: "J'ai finis de copier les Marqueurs demandés." } );
    return true ;

}