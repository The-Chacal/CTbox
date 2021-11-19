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
    var layerSelection = CTcheckSelectedLayers ()
    if( layerSelection.length > 0 ){
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            //Opening the UndoGroup.
            app.beginUndoGroup( { en: "Creating Cast Shadow." , fr: "Creation de l'ombre projetée." } );
            //Creating the Shadow layer from the selected layer.
            var SilhouetteShadowLayer = layerSelection[i].duplicate();
            SilhouetteShadowLayer.moveAfter( layerSelection[i] );
            SilhouetteShadowLayer.name = layerSelection[i].name + " - SilhouetteShadow";
            SilhouetteShadowLayer.label = 8 ;
            SilhouetteShadowLayer.parent = layerSelection[i];
            SilhouetteShadowLayer.shy = true ;
            SilhouetteShadowLayer.blendingMode = BlendingMode.MULTIPLY ;
            //Cleaning the layer and applying the preset.
            layerSelection[i].selected = false ;
            SilhouetteShadowLayer.selected = true ;
            cleanLayerChoiceDialog( false , false , false );
            SilhouetteShadowLayer.applyPreset( new File( scriptFolder.fsName + "/CTboxElements/PseudoEffects/CastShadowSettings v1.ffx" ) );
            SilhouetteShadowLayer.applyPreset( new File( scriptFolder.fsName + "/CTboxElements/PseudoEffects/CastShadow v2.ffx" ) );
            //Adjusting the expressions.
            updateExp( "XXX" , app.project.activeItem.name , true , false , false );
            updateExp( "YYY" , SilhouetteShadowLayer.name , true , false , false );
            //Checking if the reference layer has a bottom detected and linking the Cast Shadow to it if so.
            if( layerSelection[i].property( "ADBE Effect Parade" ).property( "CTbox - Content Lowest Point" ) != null ){
                SilhouetteShadowLayer.property( "ADBE Effect Parade" ).property( "CTbox - Cast Shadow - Settings" )(1).expression = "comp(\"" + app.project.activeItem.name + "\").layer(\"" + layerSelection[i].name + "\").effect(\"CTbox - Content Lowest Point\")(\"Lowest Point\") + value";
                SilhouetteShadowLayer.property( "ADBE Effect Parade" ).property( "CTbox - Cast Shadow - Settings" )(1).setValue( [ 0 , 0 ] );
            }
            //Unselecting the Cast Shadow Layer.
            SilhouetteShadowLayer.selected = false ;
            //Closing the UndoGroup.
            app.endUndoGroup();
        }
        //Recreating the original layer selection.
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            layerSelection[i].selected = true ;
        }
        CTalertDlg( { en: "I'm Done" , fr: "J'ai Fini" } , { en: "I've created your silhouette Shadow" , fr: "J'ai fini de créer l'ombre Silhouette." } );
    }
    
}