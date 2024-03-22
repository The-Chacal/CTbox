//****************************************//
//  Apply Rim
//****************************************//

/**
 * Creates a Rim Light in Overlay mode over the layer
 * @param { boolean } isOutsideRim is the Rim on the outside or inside of the charater.
 */
function applyRim( isOutsideRim ){

    var layerSelection = CTcheckSelectedLayers();
    //Saving the modifiers keys.
    var modifiers = CTmodifiersStatuses();
    if( layerSelection.length > 0 ){
        //Getting the id option status
        var hasID = JSON.parse( CTgetSavedString( "CTboxSave" , "RimLightId" ) );
        if( hasID == null ){ hasID = true ;}
        //Altering the id option status according to the ctrl key status.
        if( modifiers.ctrlState ){
            hasID = !hasID;
        }
        //Getting the path to the Script on the Computer.
        var scriptFolder = CTgetScriptFolder();
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            //Opening the UndoGroup.
            app.beginUndoGroup( "Applying Rim." );
            if( isOutsideRim){
                var rimSettingsName = "CTbox - OutsideRim - Settings";
                if( hasID ){
                    //Generating the unique Id for the Rim.
                    var rimLayerId = CTgenerateIdNb();
                    rimSettingsName = "CTbox - OutsideRim id" + rimLayerId + " - Settings";
                }
            } else {
                var rimSettingsName = "CTbox - InsideRim - Settings";
                if( hasID ){
                    //Generating the unique Id for the Rim.
                    var rimLayerId = CTgenerateIdNb();
                    rimSettingsName = "CTbox - InsideRim id" + rimLayerId + " - Settings";
                }
            }
            //Creating the Gradient layer from the selected layer.
            layerSelection[i].selected = true ;
            var rimLayer = layerSelection[i].duplicate();
            rimLayer.label = 2 ;
            rimLayer.parent = layerSelection[i];
            rimLayer.shy = true ;
            if( isOutsideRim ){
                if( hasID ){
                    rimLayer.name = layerSelection[i].name + " - OutsideRim - id" + rimLayerId ;
                } else {
                    rimLayer.name = layerSelection[i].name + " - OutsideRim";
                }
                rimLayer.blendingMode = BlendingMode.OVERLAY ;
            } else {
                if( hasID ){
                    rimLayer.name = layerSelection[i].name + " - InsideRim - id" + rimLayerId ;
                } else {
                    rimLayer.name = layerSelection[i].name + " - InsideRim";
                }
                rimLayer.blendingMode = BlendingMode.MULTIPLY ;
            }
            //Applying the settings preset on the Reference layer.
            layerSelection[i].applyPreset( new File( scriptFolder.fsName + "/CTboxElements/06_PseudoEffects/CharacterRimSettings v2.ffx" ) );
            //Adding the id of the Rim to the Settings Effect name.
            layerSelection[i].property( "ADBE Effect Parade" ).property( "CTbox - Rim - Settings" ).name = rimSettingsName;
            //Unselecting the Rim Layer.
            layerSelection[i].selected = false ;
            //Applying the Rim preset on the Rim layer.
            rimLayer.selected = true ;
            layerCleaner( false , false );
            rimLayer.applyPreset( new File( scriptFolder.fsName + "/CTboxElements/06_PseudoEffects/CharacterRim v3.ffx" ) );
            rimLayer.effect("CTbox - Set Matte")(1).setValue( layerSelection[i].index );
            //Adjusting the expressions.
            app.project.autoFixExpressions( "XXX" , layerSelection[i].name );
            app.project.autoFixExpressions( "CTbox - Rim - Settings" , rimSettingsName );
            //Setting the Color.
            if( isOutsideRim ){
                layerSelection[i].property( "ADBE Effect Parade" ).property( rimSettingsName )(1).setValue( [ .835 , .788 , .725 ] );
            } else {
                layerSelection[i].property( "ADBE Effect Parade" ).property( rimSettingsName )(1).setValue( [ .700 , .630 , .559 ] );
                rimLayer.effect("CTbox - Fill")(4).setValue( 0 );
            }
            //Checking if the reference layer has a bottom detected and linking the Gradient to it if so.
            if( layerSelection[i].property( "ADBE Effect Parade" ).property( "CTbox - Content Lowest Point" ) != null ){
                layerSelection[i].property( "ADBE Effect Parade" ).property( rimSettingsName )(7).expression = "comp(\"" + app.project.activeItem.name + "\").layer(\"" + layerSelection[i].name + "\").effect(\"CTbox - Content Lowest Point\")(\"Lowest Point\") + value";
                layerSelection[i].property( "ADBE Effect Parade" ).property( rimSettingsName )(7).setValue( [ 0 , 0 ] );
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
        CTalertDlg( "I'm Done" , "   I've created the Rim for your layer(s)." );
    }
    
}