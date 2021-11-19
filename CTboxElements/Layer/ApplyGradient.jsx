//****************************************//
//  Apply Gradient v1.2
//****************************************//

/**
 * Creates a Gradient in multiply mode over the layer.
 */
function applyGradient(){

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
            layerSelection[i].applyPreset( new File( scriptFolder.fsName + "/CTboxElements/PseudoEffects/CharacterGradientSettings v1.ffx" ) );
            layerSelection[i].selected = false ;
            //Applying the gradient preset on the Gradient layer.
            gradientLayer.selected = true ;
            cleanLayerChoiceDialog( false , false , false );
            gradientLayer.applyPreset( new File( scriptFolder.fsName + "/CTboxElements/PseudoEffects/CharacterGradient v2.ffx" ) );
            gradientLayer.effect("CTbox - Set Matte")(1).setValue( layerSelection[i].index );
            //Adjusting the expressions.
            updateExp( "XXX" , app.project.activeItem.name , true , false , false );
            updateExp( "YYY" , layerSelection[i].name , true , false , false );
            //Checking if the reference layer has a bottom detected and linking the Gradient to it if so.
            if( layerSelection[i].property( "ADBE Effect Parade" ).property( "CTbox - Content Lowest Point" ) != null ){
                layerSelection[i].property( "ADBE Effect Parade" ).property( "CTbox - Gradient - Settings" )(1).expression = "comp(\"" + app.project.activeItem.name + "\").layer(\"" + layerSelection[i].name + "\").effect(\"CTbox - Content Lowest Point\")(\"Lowest Point\") + value";
                layerSelection[i].property( "ADBE Effect Parade" ).property( "CTbox - Gradient - Settings" )(1).setValue( [ 0 , 0 ] );
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