//****************************************//
//   Create Cast Shadow v1.2
//****************************************//

/**
 * Applies a custom Preset to create a shadow based on the silhouette of the reference layer.
 */
function createCastShadow(){
    
    //Making sure that the Folder.current is the right one for the relative path of the Preset.
    var scriptFolder = new Folder( "F:/AE - Scripts/CTbox" );
    var testFile = new File( scriptFolder.fsName + "/CTbox.jsx" );
	if( !testFile.exists ){
        scriptFolder = new Folder( Folder.userData.fsName + "/Adobe/After Effects/" + app.version.slice( 0 , 4 ) + "/Scripts/ScriptUI Panels" );
        testFile = new File( scriptFolder.fsName + "/CTbox.jsx" )
    }
    if( !testFile.exists ){
        scriptFolder = new Folder( Folder.appPackage.fsName + "/Scripts/ScriptUI Panels" );
    }
    //Starting the true work.
    var LayerSelection = CTcheckSelectedLayers ()
    if( LayerSelection.length > 0 ){
        for( var i = 0 ; i < LayerSelection.length ; i++ ){
            //Opening the UndoGroup.
            app.beginUndoGroup( { en: "Creating Cast Shadow." , fr: "Creation de l'ombre projetée." } );
            //Creating the Shadow layer from the selected layer.
            var SilhouetteShadowLayer = LayerSelection[i].duplicate();
            SilhouetteShadowLayer.moveAfter( LayerSelection[i] );
            SilhouetteShadowLayer.name = LayerSelection[i].name + " - SilhouetteShadow";
            SilhouetteShadowLayer.label = 8 ;
            SilhouetteShadowLayer.parent = LayerSelection[i];
            SilhouetteShadowLayer.shy = true ;
            SilhouetteShadowLayer.blendingMode = BlendingMode.MULTIPLY ;
            //Cleaning the layer and applying the preset.
            LayerSelection[i].selected = false ;
            SilhouetteShadowLayer.selected = true ;
            cleanLayerChoiceDialog( false , false , false );
            SilhouetteShadowLayer.applyPreset( new File( scriptFolder.fsName + "/CTboxElements/PseudoEffects/SilhouetteCastShadow v1.ffx" ) );
            SilhouetteShadowLayer.selected = false ;
            //Closing the UndoGroup.
            app.endUndoGroup();
        }
        //Recreating the original layer selection.
        for( var i = 0 ; i < LayerSelection.length ; i++ ){
            LayerSelection[i].selected = true ;
        }
        CTalertDlg( { en: "I'm Done" , fr: "J'ai Fini" } , { en: "I've created your silhouette Shadow" , fr: "J'ai fini de créer l'ombre Silhouette." } );
    }
    
}