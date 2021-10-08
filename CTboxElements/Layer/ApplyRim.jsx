//****************************************//
//  Apply Rim v1.2
//****************************************//

/**
 * Creates a Rim Light in Overlay mode over the layer
 */
function applyRim(){

    //Making sure that the Folder.current is the right one for the relative path of the Preset.
    Folder.current = new Folder( "F:/AE - Scripts/CTbox" );
    if( !Folder.current.exists ){ Folder.current = Folder.userData.fsName + "/Adobe/After Effects/ " + app.version.slice( 0 , 4 ) + "/Scripts/ScriptUI Panels/" ; }
    if( !Folder.current.exists ){ Folder.current = Folder.appPackage.fsName + "/Scripts/ScriptUI Panels/" ; }
    //Starting the true work.
    var layerSelection = CTcheckSelectedLayers();
    if( layerSelection.length > 0 ){
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            //Opening the UndoGroup.
            app.beginUndoGroup( { en: "Applying Rim." , fr: "Ajout de Liseré." } );
            //Creating the Gradient layer from the selected layer.
            layerSelection[i].selected = true ;
            var rimLayer = layerSelection[i].duplicate();
            rimLayer.name = layerSelection[i].name + " - Rim";
            rimLayer.label = 2 ;
            rimLayer.parent = layerSelection[i];
            rimLayer.shy = true ;
            rimLayer.blendingMode = BlendingMode.OVERLAY ;
            //Applying the settings preset on the Reference layer.
            layerSelection[i].applyPreset( new File( "CTboxElements/PseudoEffects/CharacterRimSettings v1.ffx" ) );
            layerSelection[i].selected = false ;
            //Applying the gradient preset on the Rim layer.
            rimLayer.selected = true ;
            cleanLayerChoiceDialog( false , false , false );
            rimLayer.applyPreset( new File( "CTboxElements/PseudoEffects/CharacterRim v1.ffx" ) );
            rimLayer.effect("CTbox - Set Matte")(1).setValue( layerSelection[i].index );
            rimLayer.selected = false ;
            //Closing the UndoGroup
            app.endUndoGroup();
        }
        //Recreating the original layer selection.
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            layerSelection[i].selected = true ;
        }
        CTalertDlg( { en: "I'm Done" , fr: "J'ai Fini" } , { en: "I've created the Rim for your layer(s)." , fr: "J'ai fini de créer le liseré pour le(s) calque(s)." } );
    }
    
}