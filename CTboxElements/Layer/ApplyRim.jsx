//****************************************//
//  Apply Rim v1.2
//****************************************//

/**
 * Creates a Rim Light in Overlay mode over the layer
 * @param { boolean } outsideRim is the Rim on the outside or inside of the charater.
 */
function applyRim( outsideRim ){

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
    var layerSelection = CTcheckSelectedLayers();
    if( layerSelection.length > 0 ){
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            //Opening the UndoGroup.
            app.beginUndoGroup( { en: "Applying Rim." , fr: "Ajout de Liseré." } );
            //Creating the Gradient layer from the selected layer.
            layerSelection[i].selected = true ;
            var rimLayer = layerSelection[i].duplicate();
            rimLayer.label = 2 ;
            rimLayer.parent = layerSelection[i];
            rimLayer.shy = true ;
            if( outsideRim ){
                rimLayer.name = layerSelection[i].name + " - OutsideRim";
                rimLayer.blendingMode = BlendingMode.OVERLAY ;
            } else {
                rimLayer.name = layerSelection[i].name + " - InsideRim";
                rimLayer.blendingMode = BlendingMode.MULTIPLY ;
            }
            //Applying the settings preset on the Reference layer.
            layerSelection[i].applyPreset( new File( scriptFolder.fsName + "/CTboxElements/PseudoEffects/CharacterRimSettings v2.ffx" ) );
            layerSelection[i].selected = false ;
            //Applying the Rim preset on the Rim layer.
            rimLayer.selected = true ;
            cleanLayerChoiceDialog( false , false , false );
            rimLayer.applyPreset( new File( scriptFolder.fsName + "/CTboxElements/PseudoEffects/CharacterRim v2.ffx" ) );
            rimLayer.effect("CTbox - Set Matte")(1).setValue( layerSelection[i].index );
            //Adjusting the expressions.
            updateExp( "XXX" , app.project.activeItem.name , true , false , false );
            updateExp( "YYY" , layerSelection[i].name , true , false , false );
            //Setting the Color.
            if( outsideRim ){
                layerSelection[i].property( "ADBE Effect Parade" ).property( "CTbox - Rim - Settings" )(1).setValue( [ .835 , .788 , .725 ] );
            } else {
                layerSelection[i].property( "ADBE Effect Parade" ).property( "CTbox - Rim - Settings" )(1).setValue( [ .700 , .630 , .559 ] );
                rimLayer.effect("CTbox - Fill")(4).setValue( 0 );
            }
            //Checking if the reference layer has a bottom detected and linking the Gradient to it if so.
            if( layerSelection[i].property( "ADBE Effect Parade" ).property( "CTbox - Content Lowest Point" ) != null ){
                layerSelection[i].property( "ADBE Effect Parade" ).property( "CTbox - Rim - Settings" )(7).expression = "comp(\"" + app.project.activeItem.name + "\").layer(\"" + layerSelection[i].name + "\").effect(\"CTbox - Content Lowest Point\")(\"Lowest Point\") + value";
                layerSelection[i].property( "ADBE Effect Parade" ).property( "CTbox - Rim - Settings" )(7).setValue( [ 0 , 0 ] );
            }
            //Unselecting the Rim Layer.
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