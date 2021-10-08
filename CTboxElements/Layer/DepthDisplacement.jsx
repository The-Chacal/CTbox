//****************************************//
//  Move Layer in Depth v1.0
//****************************************//

//  Script moving a layer along the Z axis keeping its visual size
/**
 * Creates the UI 
 */
function depthChoice (){
    
    var DepthChoiceDlg = new Window( "palette" , { en: "Depth displacement" , fr: "Déplacement en Z" } );
    DepthChoiceDlg.global = DepthChoiceDlg.add( "Panel" , undefined , { en: "Depth Setting : " , fr: "Choix de la valeur en Z :" } );
    DepthChoiceDlg.global.orientation = "Column" ;
        var DepthWanted = DepthChoiceDlg.global.add( "EditText{ justify : 'center' , characters : 10 , properties : { enabled : true } }" );
        DepthWanted.text = { en: 'Z wanted' , fr: 'Z voulu' };
        var MoveInDepth = DepthChoiceDlg.global.add( "Button" , undefined , { en:"Move" , fr: "Déplacer" } );
    //UI Events.
    DepthWanted.onActivate = function(){ if( DepthWanted.text == { en: "Z wanted" , fr: "Z voulu" } ) { DepthWanted.text = "" ; } } ;
    DepthWanted.onChange = function(){ movingInDepth( DepthWanted.text ) } ;
    MoveInDepth.onClick  = function(){ movingInDepth( DepthWanted.text ) } ;
    //Showing UI
    DepthChoiceDlg.show()

}
/**
 * Moves the Layer along the Z axis.
 * @param { number } Depth Z value wanted.
 */
function movingInDepth( Depth ){

    if( !isNaN( Depth ) && app.project.activeItem != undefined ){
        var LayerSelection = CTcheckSelectedLayers();
        if( LayerSelection.length > 1 || LayerSelection.length == 1 && LayerSelection[0] != app.project.activeItem.activeCamera ){
            //Checking that there is an active Camera. Creates one if not.
            if( app.project.activeItem.activeCamera == null ){
                var NewCamera = app.project.activeItem.layers.addCamera( { en: "Forgotten Camera" , fr: "Caméra Oubliée" } , [ app.project.activeItem.width / 2 , app.project.activeItem.height / 2 ] );
                NewCamera.property(2).property(2).setValue( [ app.project.activeItem.width / 2 , app.project.activeItem.height / 2 , NewCamera.property(2).property(2).value[2] ] );
            }
            //Moving layers.
            for( var i = 0 ; i < LayerSelection.length ; i++ ){
                if( LayerSelection[i] != app.project.activeItem.activeCamera ){
                    //Opening the UndoGroup
                    app.beginUndoGroup( { en: "Layer Displacement" , fr: "Déplacement du Calque." } );
                    var MovedLayer = LayerSelection[i] ;
                    //Checking if the layer has the 3D option active.
                    if( !MovedLayer.threeDLayer ){
                        if( CTchoiceDlg( { en: "So..." , fr: "Alors..." } , { en: "The Layer \"" + LayerSelection[i].name + "\"  is not a 3D Layer.\r   Do you want me set it in 3D and Continue?" , fr: "Le Calque \"" + LayerSelection[i].name + "\"  n'est pas un calque 3D.\r   Je te le mets en 3D et on continue?" } ) ){
                            LayerSelection[i].threeDLayer = true ;
                        } else {
                            //Closing the UndoGroup if the user don't want the layer be 3D actived.
                            app.endUndoGroup();
                            continue ;
                        }
                    }
                    var CurrentTime = app.project.activeItem.time ;
                    var CurrentPosRel = MovedLayer.transform.position.value ;
                    var CurrentPos = getCurrentPosition( MovedLayer );
                    var CurrentSize = MovedLayer.transform.scale.value ;
                    var ChosenZ = parseFloat( Depth );
                    var CameraPos = getCurrentPosition ( app.project.activeItem.activeCamera );
                    //Calculating the ratio between the current position and the wanted one.
                    var Ratio = ( ChosenZ - CameraPos[2] ) / ( CurrentPos[2] - CameraPos[2] ) ;
                    //Calculating the new Size and Position.
                    var newPos = CameraPos + ( CurrentPos - CameraPos ) * Ratio - CurrentPos + CurrentPosRel ;
                    var newSize = CurrentSize * Ratio ;
                    //Applying the new values.
                    if( MovedLayer.transform.position.numKeys == 0 && MovedLayer.transform.scale.numKeys == 0){
                        MovedLayer.transform.position.setValue( newPos );
                        MovedLayer.transform.scale.setValue( newSize );
                    } else {
                        MovedLayer.transform.position.setValueAtTime( CurrentTime , newPos );
                        MovedLayer.transform.scale.setValueAtTime( CurrentTime , newSize );
                    }
                    //Closing the UndoGroup.
                    app.endUndoGroup();
                }
            }
            CTalertDlg( { en: "I'm Done" , fr: "J'ai Fini" } , { en: "I've finished moving your layers." , fr: "J'ai fini de déplacer tes Calques." } );
        }
    }
    
}
/**
 * Recursive function to get the absolute position of the layer in the comp.
 * @param { object } Layer Layer you want the absolute position of.
 * @returns { array } The position value of the Layer.
 */
function getCurrentPosition( Layer ){

    var CurrentPos = Layer.transform.position.value ;
    if( Layer.parent != null ){
        CurrentPos += getCurrentPosition( Layer.parent );
    }
    return CurrentPos ;

}