//****************************************//
//  Add Separator v1.0
//****************************************//

//  Functions adding a separator layer in your active comp.
/**
 * Changes the collapse transformation status.
 */
function addSeparator(){
    var modifiers = modifiersStatuses() ;
    var layerSelection = CTcheckSelectedLayers();
    var separator = null ;
    app.beginUndoGroup("Add Separator.")
    if( layerSelection.length > 0 ){
        if( !modifiers.ctrlState && !modifiers.majState && !modifiers.altState ){
            var highestLayer = layerSelection[0];
            if( layerSelection.length > 1 ){
                highestLayer = sortLayersByIndex( layerSelection )[0];
            }
            separator = createShape();
            separator.name = "----------------------------------------";
            separator.moveBefore( highestLayer );
        }else if( modifiers.ctrlState && !modifiers.majState && !modifiers.altState ){
            alert("ctrl");
        }else if( !modifiers.ctrlState && modifiers.majState && !modifiers.altState ){
            var highestLayer = layerSelection[0];
            var separatorPosition = getAveragePosition( layerSelection );
            if( layerSelection.length > 1 ){
                highestLayer = sortLayersByIndex( layerSelection )[0];
            }
            separator = createShape();
            separator.property( "ADBE Transform Group" ).property( "ADBE Position" ).setValue( separatorPosition );
            separator.name = "---------- Controller ----------";
            separator.moveBefore( highestLayer );
            for( var i = 0 ; i < layerSelection.length ; i++ ){
                if( layerSelection[i].parent == null ){
                    layerSelection[i].parent = separator ;
                }
            }
        }else if( !modifiers.ctrlState && !modifiers.majState && modifiers.altState ){
            for( var i = 0 ; i < layerSelection.length ; i++ ){
                separator = createShape();
                separator.name = "----------------------------------------";
                separator.moveBefore( layerSelection[i] );
            }
        }else if( modifiers.ctrlState && modifiers.majState && !modifiers.altState ){
            alert("ctrl + maj");
        }else if( !modifiers.ctrlState && modifiers.majState && modifiers.altState ){
            alert("maj+alt");
        }else if( modifiers.ctrlState && !modifiers.majState && modifiers.altState ){
            alert("ctrl+alt");
        }else if( modifiers.ctrlState && modifiers.majState && modifiers.altState ){
            alert( "ctrl+maj+alt");
        }
    } else {
        separator = createShape()
        separator.name = "----------------------------------------";
    }
    app.endUndoGroup();
}
/**
 * Create the Shape layer for Separator
 */
function createShape(){

    var shapeLayer = app.project.activeItem.layers.addShape();
    shapeLayer.property( "ADBE Transform Group" ).property( "ADBE Position" ).setValue( [ -50 , -50 ] );
    shapeLayer.guideLayer = true ;
    shapeLayer.label = 0 ;
    return shapeLayer ;

}
/**
 * Sort an array of layers according to their index
 * @param { Array } layers Array containing the layers to sort.
 */
function sortLayersByIndex( layers ){

    var sortedLayers = layers.sort( function( a , b ){ return parseFloat( a.index ) - parseFloat( b.index ) } );
    return sortedLayers ;

}
/**
 * Get the average position of a group of layers
 * @param { Array } layers Array containing the layers to get the average position from.
 */
function getAveragePosition( layers ){
    
    var averagePosition = [ 0 , 0 , 0 ];
    for( var i = 0 ; i < layers.length ; i++ ){
        var hasParent = false;
        if( layers[i].parent != null ){
            hasParent = true ;
            var savedParent = layers[i].parent ;
            layers[i].parent = null ;
        }
        averagePosition += layers[i].property( "ADBE Transform Group" ).property( "ADBE Position" ).value ;
        if( hasParent ){ layers[i].parent = savedParent ; }
    }
    averagePosition = averagePosition / layers.length ;
    return averagePosition ;

}