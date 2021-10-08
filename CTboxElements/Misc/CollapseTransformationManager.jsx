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
            if( layerSelection[i].source != undefined && layerSelection[i].source.typeName == "Composition" ){
                //Opening the UndoGroup.
                app.beginUndoGroup( { en: "Managing the Collapse option" , fr: "Gestion de la Rasteurisation" });
                //Checing the current collapse transformation value of the layer and updating it accordingly.
                var isLocked = layerSelection[i].locked
                if( isLocked ){ layerSelection[i].locked = false ; }
                var CollapseTransformationStatus = !layerSelection[i].collapseTransformation ;
                layerSelection[i].collapseTransformation = CollapseTransformationStatus ;
                switchCollapseTransformationStatus( layerSelection[i].source , CollapseTransformationStatus );
                if( isLocked ){ layerSelection[i].locked = true ; }
                //Closing the UndoGroup.
                app.endUndoGroup()
            }
        }
        CTalertDlg( { en: "I'm Done" , fr: "J'ai Fini" } , { en: "I've finished managing the collapse option of your Layers" , fr: "J'ai fini de gérer la rasteurisation de tes Calques." } );
    }
    
}

/**
 * Recursive function going trough the contained Comps to update the collapse transformation option.
 * @param { object } item Comp to work in.
 * @param { boolean } status Collapse transformation option state.
 */
function switchCollapseTransformationStatus( item , status ) {
    
    for( var i = 1 ; i <= item.numLayers ; i++ ){
        if( item.layer(i).source != undefined && item.layer(i).source.typeName == "Composition" ){
            var isLocked = item.layer(i).locked ;
            if( isLocked ){ item.layer(i).locked = false ; }
            item.layer(i).collapseTransformation = status ;
            ChangeCollapseTransformationStatus( item.layer(i).source , status );
            if( isLocked ){ item.layer(i).locked = true ; }
        }
    }
    
}