//****************************************//
//  Layer Cleaner
//****************************************//

//Functions cleaning anything the user can have done on a layer.
/**
 * Opens a dialog allow the user to choose what does he want to remove.
 */
function layerCleanerOptions(){

    //Getting saved options values.
    var savedCleanProperties = JSON.parse( CTgetSavedString( "CTboxSave" , "CleanProperties" ) );
    if( savedCleanProperties == null ){ savedCleanProperties = true ; }
    var savedCleanEffects = JSON.parse( CTgetSavedString( "CTboxSave" , "CleanEffects" ) );
    if( savedCleanEffects == null ){ savedCleanEffects = true ; }
    var savedCleanExpressions = JSON.parse( CTgetSavedString( "CTboxSave" , "CleanExpressions" ) );
    if( savedCleanExpressions == null ){ savedCleanExpressions = true ; }
    var savedCleanMasks = JSON.parse( CTgetSavedString( "CTboxSave" , "CleanMasks" ) );
    if( savedCleanMasks == null ){ savedCleanMasks = true ; }
    var savedCleanMarkers = JSON.parse( CTgetSavedString( "CTboxSave" , "CleanMarkers" ) );
    if( savedCleanMarkers == null ){ savedCleanMarkers = true ; }
    var savedCleanLayerStyles = JSON.parse( CTgetSavedString( "CTboxSave" , "CleanLayerStyles" ) );
    if( savedCleanLayerStyles == null ){ savedCleanLayerStyles = true ; }
    var savedReinitLayer = JSON.parse( CTgetSavedString( "CTboxSave" , "ReinitLayer" ) );
    if( savedReinitLayer == null ){ savedReinitLayer = false ; }
    //Creating the dialog.
    var cleanLayerOptnsDlg = new Window( "dialog" , undefined , undefined , { borderless :true } );
    cleanLayerOptnsDlg.spacing = 2 ;
    var optionsGroup = cleanLayerOptnsDlg.add( "Panel" , undefined , "Delete : " );
        optionsGroup.margins = [ 5 , 10 , 5 , 0 ];
            var cleanProperties = optionsGroup.add( "Checkbox" , undefined , " - ALL the Animations." );
            cleanProperties.characters = 15 ;
            cleanProperties.value = savedCleanProperties ;
            var cleanEffects = optionsGroup.add( "Checkbox" , undefined , " - ALL the Effects." );
            cleanEffects.characters = 15 ;
            cleanEffects.value = savedCleanEffects ;
            var cleanExpressions = optionsGroup.add( "Checkbox" , undefined , " - ALL the Expressions." );
            cleanExpressions.characters = 15 ;
            cleanExpressions.value = savedCleanExpressions ;
            var cleanMasks = optionsGroup.add( "Checkbox" , undefined , " - ALL the Masks." );
            cleanMasks.characters = 15 ;
            cleanMasks.value = savedCleanMasks ;
            var cleanMarkers = optionsGroup.add( "Checkbox" , undefined , " - ALL the Markers." );
            cleanMarkers.characters = 15 ;
            cleanMarkers.value = savedCleanMarkers ;
            var cleanLayerStyles = optionsGroup.add( "Checkbox" , undefined , "All the Layer Styles" );
            cleanLayerStyles.characters = 16 ;
            cleanLayerStyles.value = savedCleanLayerStyles ;
        var resetLayerTransform = cleanLayerOptnsDlg.add( "Checkbox" , undefined , " - Reset Layer." );
        resetLayerTransform.characters = 15 ;
        resetLayerTransform.value = savedReinitLayer ;
        var btnsRow = cleanLayerOptnsDlg.add( "group" );
        btnsRow.orientation = "row" ;
        btnsRow.spacing = 0 ;
        var btnSize = [ 60 , 20 ];
            var btnA = btnsRow.add( "button" , undefined , "Ok" );
            btnA.size = btnSize ;
            var btnB = btnsRow.add( "button" , undefined , "Default" );
            btnB.size = btnSize ;
            var btnC = btnsRow.add( "button" , undefined , "Cancel" );
            btnC.size = btnSize ;
    //UI Events
    btnA.onClick = function(){ CTsaveString( "CTboxSave" , "CleanProperties" , JSON.stringify( cleanProperties.value ) ); CTsaveString( "CTboxSave" , "CleanEffects" , JSON.stringify( cleanEffects.value ) ); CTsaveString( "CTboxSave" , "CleanExpressions" , JSON.stringify( cleanExpressions.value ) ); CTsaveString( "CTboxSave" , "CleanMasks" , JSON.stringify( cleanMasks.value ) ); CTsaveString( "CTboxSave" , "CleanMarkers" , JSON.stringify( cleanMarkers.value ) ); CTsaveString( "CTboxSave" , "CleanLayerStyles" , JSON.stringify( cleanLayerStyles.value ) ); CTsaveString( "CTboxSave" , "ReinitLayer" , JSON.stringify( resetLayerTransform.value ) ); cleanLayerOptnsDlg.close(); }
    btnB.onClick = function(){ cleanProperties.value = true ; cleanEffects.value = true ; cleanExpressions.value = true ; cleanMasks.value = true ; cleanMarkers.value = true ; cleanLayerStyles.value = true ; resetLayerTransform.value = false ;}
    //Showing UI.
    cleanLayerOptnsDlg.show();
    
}
/**
 * Cleans the layer according to the selected options.
 * @param { boolean } showEndAlert Does the script alerts when it's done.
 * @param { boolean } createUndoGroup Does the script creates an UndoGroup. 
 * @returns { boolean } Success
 */
function layerCleaner( showEndAlert , createUndoGroup ){

    var layerSelection = CTcheckSelectedLayers();
    if( layerSelection.length > 0 ){
        //Setting defaults for parameters.
        if( typeof showEndAlert === "undefined" ){ showEndAlert = true ; } 
        if( typeof createUndoGroup === "undefined" ){ createUndoGroup = true ; } 
        //Getting saved options values.
        var cleanProperties = JSON.parse( CTgetSavedString( "CTboxSave" , "CleanProperties" ) );
        if( cleanProperties == null ){ cleanProperties = true ; }
        var cleanEffects = JSON.parse( CTgetSavedString( "CTboxSave" , "CleanEffects" ) );
        if( cleanEffects == null ){ cleanEffects = true ; }
        var cleanExpressions = JSON.parse( CTgetSavedString( "CTboxSave" , "CleanExpressions" ) );
        if( cleanExpressions == null ){ cleanExpressions = true ; }
        var cleanMasks = JSON.parse( CTgetSavedString( "CTboxSave" , "CleanMasks" ) );
        if( cleanMasks == null ){ cleanMasks = true ; }
        var cleanMarkers = JSON.parse( CTgetSavedString( "CTboxSave" , "CleanMarkers" ) );
        if( cleanMarkers == null ){ cleanMarkers = true ; }
        var cleanLayerStyles = JSON.parse( CTgetSavedString( "CTboxSave" , "CleanLayerStyles" ) );
        if( cleanLayerStyles == null ){ cleanLayerStyles = true ; }
        var resetLayerTransform = JSON.parse( CTgetSavedString( "CTboxSave" , "ReinitLayer" ) );
        if( resetLayerTransform == null ){ resetLayerTransform = false ; }
        //Starting to work.
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            //Opening the UndoGroup.
            if( createUndoGroup ){ app.beginUndoGroup("Cleaning Layer" ); }
            //Removing all the keys and expression of any property if asked to.
            propertyCleaner( layerSelection[i] , cleanProperties , cleanExpressions );
            //Removing any Effects.
            if( cleanEffects && layerSelection[i].property( "ADBE Effect Parade" ).numProperties > 0 ){
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
                app.executeCommand( 3744 ); //Execute the command "Layer > Layer Styles > Remove All".
                layerSelection[i].selected = false ;
            }
            //Reseting the transfom properties of the layer.
            if( resetLayerTransform ){
                layerSelection[i].selected = true ;
                app.executeCommand( 2605 ); //Execute the command "Layer > Transform > Reset".
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
            CTalertDlg( "I'm Done" , "   I've finished Cleaning your layers" );
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
            //Removing expressions on properties.
            if( cleanExpressions && item.property(i).expression != "" ){
                item.property(i).expression = "" ;
            }
            //Removing keys on properties.
            if( cleanProperties && item.property(i) != item.property( "ADBE Marker" ) && item.property(i).numKeys > 0 && item.property(i).propertyValueType != PropertyValueType.CUSTOM_VALUE){
                //Saving the Property Value at the current Time.
                if( item.property(i) != item.property( "ADBE Time Remapping" ) ){
                    var currentValue = item.property(i).value ;
                }
                //Removing all keys on the Property.
                while( item.property(i).numKeys > 0 ){
                    item.property(i).removeKey(1) ;
                }
                //Restoring the Value stored.
                if( item.property(i) != item.property( "ADBE Time Remapping" ) ){
                    item.property(i).setValue( currentValue );
                }
            }
        }
    }

}