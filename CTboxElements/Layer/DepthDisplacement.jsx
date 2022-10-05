//****************************************//
//  Move Layer in Depth
//****************************************//

//  Script moving a layer along the Z axis keeping its visual size
/**
 * Creates the UI 
 */
function depthChoice (){
    
    var depthChoiceDlg = new Window( "palette" , "Move in Depth" );
    depthChoiceDlg.global = depthChoiceDlg.add( "Panel" , undefined , "Depth Setting : " );
    depthChoiceDlg.global.orientation = "Column" ;
        var depthWanted = depthChoiceDlg.global.add( "EditText{ justify : 'center' , characters : 10 , properties : { enabled : true } }" );
        depthWanted.text = "Z wanted" ;
        var moveInDepth = depthChoiceDlg.global.add( "Button" , undefined , "Move" );
    //UI Events.
    depthWanted.onActivate = function(){ if( depthWanted.text == "Z wanted" ) { depthWanted.text = "" ; } } ;
    depthWanted.onChange = function(){ movingInDepth( depthWanted.text ) } ;
    moveInDepth.onClick  = function(){ movingInDepth( depthWanted.text ) } ;
    //Showing UI
    depthChoiceDlg.show()

}
/**
 * Moves the Layer along the Z axis.
 * @param { number } Depth Z value wanted.
 */
function movingInDepth( Depth ){

    if( !isNaN( Depth ) && app.project.activeItem != undefined ){
        var layerSelection = CTcheckSelectedLayers();
        if( layerSelection.length > 1 || layerSelection.length == 1 && layerSelection[0] != app.project.activeItem.activeCamera ){
            //Checking that there is an active Camera. Creates one if not.
            if( app.project.activeItem.activeCamera == null ){
                var NewCamera = app.project.activeItem.layers.addCamera( "Forgotten Camera" , [ app.project.activeItem.width / 2 , app.project.activeItem.height / 2 ] );
                NewCamera.property(2).property(2).setValue( [ app.project.activeItem.width / 2 , app.project.activeItem.height / 2 , NewCamera.property(2).property(2).value[2] ] );
            }
            //Moving layers.
            for( var i = 0 ; i < layerSelection.length ; i++ ){
                if( layerSelection[i] != app.project.activeItem.activeCamera ){
                    //Opening the UndoGroup
                    app.beginUndoGroup( "Layer Displacement" );
                    var MovedLayer = layerSelection[i] ;
                    //Checking if the layer has the 3D option active.
                    if( !MovedLayer.threeDLayer ){
                        if( CTchoiceDlg( "So..." , "   The Layer \"" + layerSelection[i].name + "\"  is not a 3D Layer.\r   Do you want me set it in 3D and continue?"  ) ){
                            layerSelection[i].threeDLayer = true ;
                        } else {
                            //Closing the UndoGroup if the user don't want the layer be 3D actived.
                            app.endUndoGroup();
                            continue ;
                        }
                    }
                    //Saving current time.
                    var currentTime = app.project.activeItem.time ;
                    //Unparenting the Layer.
                    var layerParent = layerSelection[i].parent ;
                    layerSelection[i].parent = null ;
                    //Unparenting the Camera
                    var camera = app.project.activeItem.activeCamera;
                    var cameraParent = camera.parent ;
                    camera.parent = null ;
                    //Getting the properties needed for calculus.
                    var currentPos = MovedLayer.property( "ADBE Transform Group" ).property( "ADBE Position" ).value ;
                    var currentScale = MovedLayer.property( "ADBE Transform Group" ).property( "ADBE Scale" ).value ;
                    var chosenZ = parseFloat( Depth );
                    var cameraPos = camera.property( "ADBE Transform Group" ).property( "ADBE Position" ).value ;
                    //Calculating the ratio between the current position and the wanted one.
                    var ratio = ( chosenZ - cameraPos[2] ) / ( currentPos[2] - cameraPos[2] ) ;
                    //Calculating the new Position and Scale.
                    var newPos = cameraPos + ( currentPos - cameraPos ) * ratio ;
                    var newScale = currentScale * ratio ;
                    //Applying the new values.
                    if( MovedLayer.property( "ADBE Transform Group" ).property( "ADBE Position" ).numKeys == 0 ){
                        MovedLayer.property( "ADBE Transform Group" ).property( "ADBE Position" ).setValue( newPos );
                    } else {
                        MovedLayer.property( "ADBE Transform Group" ).property( "ADBE Position" ).setValueAtTime( currentTime , newPos );
                    }
                    if( MovedLayer.property( "ADBE Transform Group" ).property( "ADBE Scale" ).numKeys == 0 ){
                        MovedLayer.property( "ADBE Transform Group" ).property( "ADBE Scale" ).setValue( newScale );
                    } else {
                        MovedLayer.property( "ADBE Transform Group" ).property( "ADBE Scale" ).setValueAtTime( currentTime , newScale );
                    }
                    //Restoring the parenting.
                    layerSelection[i].parent = layerParent ;
                    camera.parent = cameraParent ;
                    //Closing the UndoGroup.
                    app.endUndoGroup();
                }
            }
            CTalertDlg( "I'm Done" , "   I've finished moving your layers." );
        }
    }
    
}