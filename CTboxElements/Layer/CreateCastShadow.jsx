//****************************************//
//   Create Cast Shadow v1.4
//****************************************//

/**
 * Applies a custom Preset to create a shadow based on the silhouette of the reference layer.
 */
function createCastShadow(){
    
    var layerSelection = CTcheckSelectedLayers();
    if( layerSelection.length > 0 ){
        //Getting the id option status
        var hasID = JSON.parse( CTgetSavedString( "CTboxSave" , "CastShadowId" ) );
        if( hasID == null ){ hasID = true ;}
        //Getting the path to the Script on the Computer.
        var scriptFolder = CTgetScriptFolder();
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            //Opening the UndoGroup.
            app.beginUndoGroup( { en: "Creating Cast Shadow." , fr: "Creation de l'ombre projetée." } );
            var castShadowSettingsName = "CTbox - Cast Shadow - Settings";
            if( hasID ){
                //Generating the unique Id for the CastShadow.
                var castShadowLayerId = CTgenerateIdNb();
                castShadowSettingsName = "CTbox - Cast Shadow id" + castShadowLayerId + " - Settings";
            }
            //Creating the Shadow layer from the selected layer.
            var silhouetteShadowLayer = layerSelection[i].duplicate();
            silhouetteShadowLayer.moveAfter( layerSelection[i] );
            if( hasID ){
                silhouetteShadowLayer.name = layerSelection[i].name + " - SilhouetteShadow - id" + castShadowLayerId ;
            } else {
                silhouetteShadowLayer.name = layerSelection[i].name + " - SilhouetteShadow";
            }
            silhouetteShadowLayer.label = 8 ;
            silhouetteShadowLayer.parent = layerSelection[i];
            silhouetteShadowLayer.shy = true ;
            silhouetteShadowLayer.blendingMode = BlendingMode.MULTIPLY ;
            //Cleaning the layer and applying the preset.
            layerSelection[i].selected = false ;
            silhouetteShadowLayer.selected = true ;
            layerCleaner( false , false );
            silhouetteShadowLayer.applyPreset( new File( scriptFolder.fsName + "/CTboxElements/PseudoEffects/CastShadowSettings v1.ffx" ) );
            silhouetteShadowLayer.applyPreset( new File( scriptFolder.fsName + "/CTboxElements/PseudoEffects/CastShadow v3.ffx" ) );
            //Adding the id of the Rim to the Settings Effect name.
            silhouetteShadowLayer.property( "ADBE Effect Parade" ).property( "CTbox - Cast Shadow - Settings" ).name = castShadowSettingsName ;
            //Adjusting the expressions.
            app.project.autoFixExpressions( "XXX" , silhouetteShadowLayer.name );
            app.project.autoFixExpressions( "CTbox - Cast Shadow - Settings" , castShadowSettingsName );
            //Checking if the reference layer has a bottom detected and linking the Cast Shadow to it if so.
            if( layerSelection[i].property( "ADBE Effect Parade" ).property( "CTbox - Content Lowest Point" ) != null ){
                silhouetteShadowLayer.property( "ADBE Effect Parade" ).property( castShadowSettingsName )(1).expression = "comp(\"" + app.project.activeItem.name + "\").layer(\"" + layerSelection[i].name + "\").effect(\"CTbox - Content Lowest Point\")(\"Lowest Point\") + value";
                silhouetteShadowLayer.property( "ADBE Effect Parade" ).property( castShadowSettingsName )(1).setValue( [ 0 , 0 ] );
            }
            //Unselecting the Cast Shadow Layer.
            silhouetteShadowLayer.selected = false ;
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