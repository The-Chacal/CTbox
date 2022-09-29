//****************************************//
//  Apply Gradient v1.4
//****************************************//

/**
 * Creates a Gradient in multiply mode over the layer.
 */
function applyGradient(){

    var layerSelection = CTcheckSelectedLayers ();
    //Saving the modifiers keys.
    var modifiers = CTmodifiersStatuses();
    if( layerSelection.length > 0 ){
        //Getting the id option status
        var hasID = JSON.parse( CTgetSavedString( "CTboxSave" , "GradientId" ) );
        if( hasID == null ){ hasID = true ;}
        //Altering the id option status according to the ctrl key status.
        if( modifiers.ctrlState ){
            hasID = !hasID;
        }
        //Getting the path to the Script on the Computer.
        var scriptFolder = CTgetScriptFolder();
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            //Opening the UndoGroup
            app.beginUndoGroup( { en: "Applying Gradient." , fr: "Ajout de Dégradé." } );
            var gradientSettingsName = "CTbox - Gradient - Settings";
            if( hasID ){
                //Generating the unique Id for the Gradient.
                var gradientLayerId = CTgenerateIdNb();
                var gradientSettingsName = "CTbox - Gradient id" + gradientLayerId + " - Settings";
            }
            //Creating the Gradient layer from the selected layer.
            layerSelection[i].selected = true ;
            var gradientLayer = layerSelection[i].duplicate();
            if( hasID ){
                gradientLayer.name = layerSelection[i].name + " - Gradient - id" + gradientLayerId ;
            } else {
                gradientLayer.name = layerSelection[i].name + " - Gradient";
            }
            gradientLayer.label = 11 ;
            gradientLayer.parent = layerSelection[i];
            gradientLayer.shy = true ;
            gradientLayer.blendingMode = BlendingMode.MULTIPLY ;
            //Applying the settings preset on the Reference layer.
            layerSelection[i].applyPreset( new File( scriptFolder.fsName + "/CTboxElements/PseudoEffects/CharacterGradientSettings v1.ffx" ) );
            //Adding the id of the Gradient to the Settings Effect name.
            layerSelection[i].property( "ADBE Effect Parade" ).property( "CTbox - Gradient - Settings" ).name = gradientSettingsName ;
            //Unselecting the Gradient Layer.
            layerSelection[i].selected = false ;
            //Applying the gradient preset on the Gradient layer.
            gradientLayer.selected = true ;
            layerCleaner( false , false );
            gradientLayer.applyPreset( new File( scriptFolder.fsName + "/CTboxElements/PseudoEffects/CharacterGradient v3.ffx" ) );
            gradientLayer.effect("CTbox - Set Matte")(1).setValue( layerSelection[i].index );
            gradientLayer.property( "ADBE Transform Group" ).property( "ADBE Opacity" ).expression = "thisComp.layer(\"XXX\").effect(\""+ gradientSettingsName + "\")(5)";
            //Adjusting the expressions.
            app.project.autoFixExpressions( "XXX" , layerSelection[i].name );
            app.project.autoFixExpressions( "CTbox - Gradient - Settings" , gradientSettingsName );
            //Checking if the reference layer has a bottom detected and linking the Gradient to it if so.
            if( layerSelection[i].property( "ADBE Effect Parade" ).property( "CTbox - Content Lowest Point" ) != null ){
                layerSelection[i].property( "ADBE Effect Parade" ).property( gradientSettingsName )(1).expression = "thisComp.layer(\"" + layerSelection[i].name + "\").effect(\"CTbox - Content Lowest Point\")(\"Lowest Point\") + value";
                layerSelection[i].property( "ADBE Effect Parade" ).property( gradientSettingsName )(1).setValue( [ 0 , 0 ] );
            }
            //Unselecting the Gradient Layer.
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