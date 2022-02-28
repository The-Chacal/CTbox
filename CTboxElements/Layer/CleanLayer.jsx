//****************************************//
//  Clean Layer v2.1
//****************************************//

//Functions cleaning anything the user can have done on a layer.
/**
 * Opens a dialog allow the user to choose what does he want to remove.
 * @param { boolean } isChoiceDlgDisplayed Does the script shows the options to the user.
 * @param { boolean } [ showEndAlert = true] Does the script alerts when it's done.
 * @param { boolean } [ createUndoGroup = true ] Does the script creates an UndoGroup.
 */
function cleanLayerChoiceDialog( isChoiceDlgDisplayed , showEndAlert , createUndoGroup ){
    if( typeof showEndAlert === "undefined" ){ showEndAlert = true ; }
    if( typeof createUndoGroup === "undefined" ){ createUndoGroup = true ; }
    
    if( !isChoiceDlgDisplayed ){
        cleaningLayer( true , true , true , true , true , true , false , showEndAlert , createUndoGroup );
    } else {
        var cleanLayerChoiceDialogDlg = new Window( "palette" , { en : "Choice to Do" , fr: "Choix à Faire" } ) ;
        var uiGroup = cleanLayerChoiceDialogDlg.add( "Group" ) ;
        uiGroup.preferredSize = [ 200 , -1 ];
        uiGroup.orientation = "Column" ;
        uiGroup.alignChildren = "fill" ;
        uiGroup.spacing = 3 ;
            var optionsGroup = uiGroup.add( "Panel" , undefined , { en: "Delete : " , fr: "Supprimer : " });
            optionsGroup.alignChildren = "Left" ;
            optionsGroup.spacing = 0 ;
                var cleanProperties = optionsGroup.add( "Checkbox" , undefined , { en: " - ALL the Animations." , fr: " - TOUTES les Animations." } );
                cleanProperties.characters = 15 ;
                cleanProperties.value = true ;
                var cleanEffects = optionsGroup.add( "Checkbox" , undefined , { en: " - ALL the Effects." , fr: " - TOUS les Effets."} );
                cleanEffects.characters = 15 ;
                cleanEffects.value = true ;
                var cleanExpressions = optionsGroup.add( "Checkbox" , undefined , { en: " - ALL the Expressions." , fr: " - TOUTES les Expressions."} );
                cleanExpressions.characters = 15 ;
                cleanExpressions.value = true ;
                var cleanMasks = optionsGroup.add( "Checkbox" , undefined , { en: " - ALL the Masks." , fr: " - TOUS les Masques."} );
                cleanMasks.characters = 15 ;
                cleanMasks.value = true ;
                var cleanMarkers = optionsGroup.add( "Checkbox" , undefined , { en: " - ALL the Markers." , fr: " - TOUS les Marqueurs." } );
                cleanMarkers.characters = 15 ;
                cleanMarkers.value = true ;
                var cleanLayerStyles = optionsGroup.add( "Checkbox" , undefined , { en: "All the Layer Styles" , fr: " - TOUS les Styles de Calque." } );
                cleanLayerStyles.characters = 15 ;
                cleanLayerStyles.value = true ;
            var reinitLayer = uiGroup.add( "Checkbox" , undefined , { en: " - Reset Layer." , fr: " - RàZ le.s Calque.s."} );
            reinitLayer.characters = 15 ;
            reinitLayer.value = false ;
            reinitLayer.alignment = "Center" ;
            uiGroup.Btns = uiGroup.add( "Group" );
            uiGroup.Btns.alignment = "Center" ;
                var BtnA = uiGroup.Btns.add( "Button" , undefined , { en: "Clean" , fr: "Nettoyer" } );
                BtnA.size = [ 75 , 25 ];
                var BtnB = uiGroup.Btns.add( "Button" , undefined , { en: "Cancel" , fr: "Annuler" } );
                BtnB.size = [ 75 , 25 ];
        //UI Events
        BtnA.onClick = function(){ if( cleaningLayer( cleanProperties.value , cleanEffects.value , cleanExpressions.value , cleanMasks.value , cleanMarkers.value , cleanLayerStyles.value , reinitLayer.value , showEndAlert , createUndoGroup ) ){ cleanLayerChoiceDialogDlg.close(); } };
        BtnB.onClick = function(){ cleanLayerChoiceDialogDlg.close() };
        //UI Parameters.
        cleanLayerChoiceDialogDlg.active = true ;
        cleanLayerChoiceDialogDlg.defaultElement = BtnA ;
        //Showing UI.
        cleanLayerChoiceDialogDlg.show();
    }
    
}
/**
 * Cleans the layer according to the selected options.
 * @param { boolean } cleanProperties Does the script removes keys on properties.
 * @param { boolean } cleanFX Does the script removes the Effects.
 * @param { boolean } cleanExpressions  Does the script removes expressions on properties.
 * @param { boolean } cleanMasks  Does the script removes the Masks.
 * @param { boolean } cleanMarkers Does the script removes Markers.
 * @param { boolean } cleanLayerStyles  Does the script removes the Layer Styles.
 * @param { boolean } resetLayerTransform  Does the script resets the layer transform properties.
 * @param { boolean } showEndAlert Does the script alerts when it's done.
 * @param { boolean } createUndoGroup Does the script creates an UndoGroup. 
 * @returns { boolean } Success
 */
function cleaningLayer( cleanProperties , cleanFX , cleanExpressions , cleanMasks , cleanMarkers  , cleanLayerStyles , resetLayerTransform , showEndAlert , createUndoGroup ){

    var layerSelection = CTcheckSelectedLayers();
    if( layerSelection.length > 0 ){
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            //Opening the UndoGroup.
            if( createUndoGroup ){ app.beginUndoGroup( { en: "Layer Cleaning" , fr: "Nettoyage des Calques"} ); }
            //Removing all the keys and expression of any property if asked to.
            propertyCleaner( layerSelection[i] , cleanProperties , cleanExpressions );
            //Removing any Effects.
            if( cleanFX && layerSelection[i].property( "ADBE Effect Parade" ).numProperties > 0 ){
                while( layerSelection[i].property( "ADBE Effect Parade" ).numProperties > 0 ){
                    layerSelection[i].property( "ADBE Effect Parade" ).property(1).remove();
                }
            }
            //Removing Masks.
            if( cleanMasks && layerSelection[i].property( "ADBE Mask Parade" ).numProperties > 0 ){
                while( layerSelection[i].property( "ADBE Mask Parade" ).numProperties > 0 ){
                    layerSelection[i].property( "ADBE Mask Parade" ).property(1).remove();
                }
            }
            //Removing Markers.
            if( cleanMarkers && layerSelection[i].property( "ADBE Marker" ).numKeys > 0 ){
                while ( layerSelection[i].property( "ADBE Marker" ).numKeys > 0 ){
                    layerSelection[i].property( "ADBE Marker" ).removeKey(1);
                }
            }
            //Removing any Layer Style.
            if( cleanLayerStyles ){
                propertyCleaner( layerSelection[i].property( 7 ) , true , true )
                layerSelection[i].selected = true ;
                app.executeCommand( 3744 ); //Execute la commande "Calques > Styles de Calques > Supprimer Tout".
                layerSelection[i].selected = false ;
            }
            //Reseting the transfom properties of the layer.
            if( resetLayerTransform ){
                layerSelection[i].selected = true ;
                app.executeCommand( 2605 ); //Execute la commande "Calque > Géométrie > Réinitialiser".
                layerSelection[i].selected = false ;
            }
            //Closing the UndoGroup
            if( createUndoGroup ){ app.endUndoGroup(); }
        }
        //Recreating the original layer selection.
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            layerSelection[i].selected = true ;
        }
        if( showEndAlert ){
            CTalertDlg( { en: "I'm Done" , fr: "J'ai Fini" } , { en: "I've finished Cleaning your layers" , fr: "J'ai fini de nettoyer tes Calques." } );
        }
        return true ;
    } else {
        return false ;
    }
    
}
/**
 * Recursive function cleaning the properties selected
 * @param { object } item the propertyGroup to clean trough
 * @param { boolean } cleanProperties Does the script removes keys on properties.
 * @param { boolean } cleanExpressions Does the script removes expressions on properties.
 */
function propertyCleaner( item , cleanProperties , cleanExpressions ){
    
    for( var i = 1 ; i <= item.numProperties ; i++ ){
        if( item.property(i).numProperties != undefined ){
            propertyCleaner( item.property(i) , cleanProperties , cleanExpressions );
        } else {
            //Removing keys on properties.
            if( cleanProperties && item.property(i) != item.property( "ADBE Marker" ) && item.property(i).numKeys > 0 ){
                //Saving the Property Value at the current Time.
                var currentValue = item.property(i).value ;
                //Removing all keys on the Property.
                while( item.property(i).numKeys > 0 ){
                    item.property(i).removeKey(1) ;
                }
                //Restoring the Value stored.
                item.property(i).setValue( currentValue );
            }
            //Removing expressions on properties.
            if( cleanExpressions && item.property(i).expression != "" ){
                item.property(i).expression = "" ;
            }
        }
    }

}