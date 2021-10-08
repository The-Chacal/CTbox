//****************************************//
//  Apply Gradient v1.2
//****************************************//

/**
 * Creates a Gradient in multiply mode over the layer.
 */
function applyGradient(){

    //Making sure that the Folder.current is the right one for the relative path of the Preset.
    Folder.current = new Folder( "F:/AE - Scripts/CTbox" );
    if( !Folder.current.exists ){ Folder.current = Folder.userData.fsName + "/Adobe/After Effects/ " + app.version.slice( 0 , 4 ) + "/Scripts/ScriptUI Panels/" ; }
    if( !Folder.current.exists ){ Folder.current = Folder.appPackage.fsName + "/Scripts/ScriptUI Panels/" ; }
    //Starting the true work.
    var layerSelection = CTcheckSelectedLayers ();
    if( layerSelection.length > 0 ){
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            //Opening the UndoGroup
            app.beginUndoGroup( { en: "Applying Gradient." , fr: "Ajout de Dégradé." } );
            //Creating the Gradient layer from the selected layer.
            layerSelection[i].selected = true ;
            var gradientLayer = layerSelection[i].duplicate();
            gradientLayer.name = layerSelection[i].name + " - Gradient";
            gradientLayer.label = 11 ;
            gradientLayer.parent = layerSelection[i];
            gradientLayer.shy = true ;
            gradientLayer.blendingMode = BlendingMode.MULTIPLY ;
            //Applying the settings preset on the Reference layer.
            layerSelection[i].applyPreset( new File( "CTboxElements/PseudoEffects/CharacterGradientSettings v1.ffx" ) );
            layerSelection[i].selected = false ;
            //Applying the gradient preset on the Gradient layer.
            gradientLayer.selected = true ;
            cleanLayerChoiceDialog( false , false , false );
            gradientLayer.applyPreset( new File( "CTboxElements/PseudoEffects/CharacterGradient v1.ffx" ) );
            gradientLayer.effect("CTbox - Set Matte")(1).setValue( layerSelection[i].index );
            gradientLayer.selected = false ;
            //Closing the UndoGroup
            app.endUndoGroup();
        }
        //Recreatings the original layer selection.
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            layerSelection[i].selected = true ;
        }
        CTalertDlg( { en: "I'm Done" , fr: "J'ai Fini" } , { en: "I've created the Gradient for your layer(s)." , fr: "J'ai fini de créer le degradé pour le(s) calque(s)." } );
    }
    
}