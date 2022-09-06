//****************************************//
//  Collapse Transformation Manager v1.0
//****************************************//

//  Functions changing the collapse transformation option trough comps
/**
 * Changes the collapse transformation status.
 */
function collapseTransformationManager(){

    var layerSelection = CTcheckSelectedLayers()
    if( layerSelection.length > 0 ){
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            //Opening the UndoGroup.
            app.beginUndoGroup( "Managing the Collapse option" );
            //Checing the current collapse transformation value of the layer and updating it accordingly.
            var collapseTransformationStatus = !layerSelection[i].collapseTransformation ;
            switchCollapseTransformationStatus( layerSelection[i] , collapseTransformationStatus );
            //Closing the UndoGroup.
            app.endUndoGroup()
        }
        CTalertDlg( "I'm Done" , "   I've finished managing the collapse option of your Layers" );
    }
    
}

/**
 * Recursive function going trough the contained Comps to update the collapse transformation option.
 * @param { object } layer Layer to work on.
 * @param { boolean } status Collapse transformation option state.
 */
function switchCollapseTransformationStatus( layer , status ) {

    if( layer.canSetCollapseTransformation ){
        var isLocked = layer.locked ;
        if( isLocked ){ layer.locked = false ; }
        layer.collapseTransformation = status ;
        if( layer.source != undefined && layer.source.typeName == "Composition" ){
            for( var i = 1 ; i <= layer.source.numLayers ; i++ ){
                switchCollapseTransformationStatus( layer.source.layer(i) , status );
            }
        }
        if( isLocked ){ layer.locked = true ; }
    }
    
}