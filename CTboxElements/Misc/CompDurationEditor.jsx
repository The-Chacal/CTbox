//****************************************//
//   Composition Duration Editor v1.2
//****************************************//

// Functions managing the length of a comp and all its components.

/**
 * Creates the UI.
 */
function compDurationChoice(){
    
    //Getting the path to the Script on the Computer.
    var scriptFolder = CTgetScriptFolder();
    //Creating the dialog.
    var choiceCompDurationDlg = new Window( "palette" , undefined , undefined , { borderless : true } );
    choiceCompDurationDlg.spacing = 2 ;
        var settingsGroup = choiceCompDurationDlg.add( "panel" , undefined , "Settings :" );
        settingsGroup.spacing = 2 ;
            var settingsRow01 = settingsGroup.add( "group" );
            settingsRow01.orientation = "row";
            settingsRow01.spacing = 5 ;
                settingsRow01.Selector = settingsRow01.add( "radioButton" , undefined , "Duration :" );
                settingsRow01.Selector.characters = 6 ;
                settingsRow01.Selector.value = true ;
                var durationWanted = settingsRow01.add( "editText{ text : '' , justify : 'center' , characters : 10 , properties : { enabled : true } }" );
                var durationUnitsA = settingsRow01.add( "radioButton" , undefined , "Fr");
                durationUnitsA.value = true ;
                var durationUnitsB = settingsRow01.add( "radioButton" , undefined , "Sec");
            var settingsRow02 = settingsGroup.add( "group" , undefined );
            settingsRow02.orientation = "row";
            settingsRow02.spacing = 5 ;
                settingsRow02.Selector = settingsRow02.add( "radioButton" , undefined , "Ref Layer :");
                settingsRow02.Selector.characters = 6 ;
                var layerRefChoice = settingsRow02.add( "dropDownList" )
                layerRefChoice.itemSize[0] = 120 ;
                layerRefChoice.selection = layerRefChoice.items[0];
                var refreshLayerList = settingsRow02.add( "iconButton" , undefined , new File( scriptFolder.fsName + "/CTboxElements/PNG/w12-Actualise.png") );
                refreshLayerList.size = [ 16 , 16 ];
        var buttonsGroup = choiceCompDurationDlg.add( "group" );
        buttonsGroup.orientation = "row" ;
        buttonsGroup.spacing = 2 ;
            var changeDuration = buttonsGroup.add( "button" , undefined , "Modify" );
            changeDuration.size = [ 75 , 25 ];
            var cancelBtn = buttonsGroup.add( "button" , undefined , "Cancel" );
            cancelBtn.size = [ 75 , 25 ];
    //UI Events.
    settingsRow01.Selector.onClick = function(){ settingsRow02.Selector.value = false };
    settingsRow02.Selector.onClick = function(){ settingsRow01.Selector.value = false };
    durationWanted.onChange = function(){ settingsRow01.Selector.value = true ; settingsRow02.Selector.value = false };
    durationUnitsA.onClick = function(){ settingsRow01.Selector.value = true ; settingsRow02.Selector.value = false };
    durationUnitsB.onClick = function(){ settingsRow01.Selector.value = true ; settingsRow02.Selector.value = false };
    layerRefChoice.onChange = function(){ settingsRow02.Selector.value = true ; settingsRow01.Selector.value = false };
    refreshLayerList.onClick = function(){ getListOfLayers( layerRefChoice ) };
    changeDuration.onClick = function(){ var newDuration = getNewDuration( settingsRow02.Selector.value , durationWanted.text , durationUnitsA.value , layerRefChoice.selection.text ); if( newDuration != null ){ compDurationEditorLauncher( newDuration ); } };
    cancelBtn.onClick = function(){ choiceCompDurationDlg.close() };
    //Updating the layers'list
    refreshLayerList.notify();
    //Showing UI.
    choiceCompDurationDlg.show();
    
}
/**
 * Creates a list of the layers existing in the current composition.
 * * @param { object } dropdownlistToUpdate Dropdownlist to update.
 */
function getListOfLayers( dropdownlistToUpdate ){
    
    dropdownlistToUpdate.removeAll();
    if( app.project.activeItem != undefined && app.project.activeItem.numLayers > 0 ){
        for( var i = 1 ; i <= app.project.activeItem.numLayers ; i++ ){
            var CurrentLayer = app.project.activeItem.layer(i);
            dropdownlistToUpdate.add( "item" ,  CurrentLayer.index + " - " + CurrentLayer.name );
        }
    } else {
        dropdownlistToUpdate.add( "item" , { en: "Empty" , fr: "Vide" } );
    }
    dropdownlistToUpdate.selection = dropdownlistToUpdate.items[0] ;
    
}
/**
 * Gets the duration wanted in seconds.
 * @param { boolean } hasRefLayer Uses a Reference Layer.
 * @param { number } durationWanted  Duration wanted.
 * @param { boolean } isFrames Duration is in Frames.
 * @param { string } refLayer A string with the Index and Name of the layer selected as reference for duration.
 * @returns { number } The duration chose in seconds.
 */
function getNewDuration( hasRefLayer , durationWanted , isFrames , refLayer ){
    
    var durationSet = null ;
    if( app.project.activeItem != undefined ){
        if( !hasRefLayer ){
            if( isNaN( durationWanted ) ){
                CTalertDlg( "Nope" , { en: "   The Duration entered is not a Number" , fr: "   La durée demandée n'est pas un nombre." } );
            } else {
                if( isFrames ){
                    durationSet = durationWanted * app.project.activeItem.frameDuration ;
                }
            }            
        } else {
            var refLayerIndex = parseFloat( refLayer.slice( 0 , refLayer.indexOf( " - " ) ) );
            durationSet = app.project.activeItem.layer( refLayerIndex ).outPoint - app.project.activeItem.layer( refLayerIndex ).inPoint ;
        }
    }
    return durationSet ;
        
}
/**
 * Gather infos for the Comp Duration Editor.
 * @param { number } durationWanted Duration wanted in seconds.
 */
function compDurationEditorLauncher( durationWanted ){

    //Getting saved options strings and transforming them into booleans.
    var updateActiveComp = JSON.parse( CTgetSavedString( "CTboxSave" , "updateActiveComp" ) );
    if( updateActiveComp == null ){ updateActiveComp = true };
    var ignoreLockedLayers = JSON.parse( CTgetSavedString( "CTboxSave" , "ignoreLockedLayers" ) );
    if( ignoreLockedLayers == null ){ ignoreLockedLayers = true };
    //Updating the Active Composition
    var selectedLayers = CTcheckSelectedLayers();
    if( updateActiveComp && selectedLayers.length == 0 ){
        app.beginUndoGroup( "Edit Comp Duration" ); 
        app.project.activeItem.duration = durationWanted ;
        for( var i = 1 ; i <= app.project.activeItem.layers.length ; i++ ){
            compDurationEditor( app.project.activeItem.layer(i) , durationWanted , ignoreLockedLayers );
        }
        app.endUndoGroup(); 
    } else if( updateActiveComp && selectedLayers.length > 0 ){
        app.beginUndoGroup( "Edit Comp Duration" );
        app.project.activeItem.duration = durationWanted ;
        for( var i = 0 ; i < selectedLayers.length ; i++ ){ 
            compDurationEditor( selectedLayers[i] , durationWanted , ignoreLockedLayers );
        } 
        app.endUndoGroup(); 
    } else if( !updateActiveComp && selectedLayers.length > 0 ){
        for( var i = 0 ; i < selectedLayers.length ; i++ ){ 
            app.beginUndoGroup( "Edit Comp Duration" );
            compDurationEditor( selectedLayers[i] , durationWanted , ignoreLockedLayers );
            app.endUndoGroup(); 
        } 
    }
    CTalertDlg( { en: "I'm Done" , fr: "J'ai Fini" } , { en: "I've finished changing the duration of your Comps" , fr: "J'ai fini de retimer tes Compos." } ); 
    return true ; 

}
/**
 * Recursive function that modifies the length of Comp. 
 * @param { Object } layer Layer to work on.
 * @param { Number } durationWanted Duration wanted the footage to length in seconds.
 * @param { Boolean } ignoreLockedLayers Does the script ignore or not the locked layers.
 */
function compDurationEditor( layer , durationWanted , ignoreLockedLayers ){

    //Checking if the current Layer is locked.
    var isLocked = layer.locked ;
    if( isLocked == false || ( isLocked == true && ignoreLockedLayers == false ) ){
        layer.locked = false ; 
        if( layer.nullLayer == false && layer.source.typeName == "Composition" && layer.source.duration != durationWanted ){
            var item = layer.source ;
            var oldDuration = item.duration ;
            item.duration = durationWanted ;
            for( var i = 1 ; i <= item.layers.length ; i++ ){
                var parsedLayerIsLocked = item.layers[i].locked ;
                if( parsedLayerIsLocked == false || ( parsedLayerIsLocked == true && ignoreLockedLayers == false ) ){
                    item.layers[i].locked = false ;
                    if( item.layers[i].source.typeName == "Composition" && item.layers[i].duration != durationWanted ){
                        compDurationEditor( item.layers[i] , durationWanted , ignoreLockedLayers );
                    } else if( item.layers[i].outPoint >= durationWanted || item.layers[i].outPoint >= oldDuration ){
                        item.layers[i].outPoint = durationWanted ;
                    }
                    if( parsedLayerIsLocked == true && ignoreLockedLayers == false ){ item.layers[i].locked = true ;}
                }
            }
        }
        if( layer.outPoint >= durationWanted || layer.outPoint >= oldDuration ){
            layer.outPoint = durationWanted ;
        }
        //Restoring locked status on the current Layer.
        if( isLocked && ignoreLockedLayers == false ){ layer.locked = true ; }
    }

}
/**
 * Opens a dialog allowing the user to set the options for the Composition Duration Editor.
 */
function CompDurationEditorOptions(){

    var CompDurationEditorOptionsDialog = new Window( "dialog" , undefined , undefined , { borderless : true } );
        var mainGroup = CompDurationEditorOptionsDialog.add( "panel" , undefined , "Composition Duration Editor Options :" );
        mainGroup.orientation = "column" ;
        mainGroup.alignChildren = "fill" ;
        mainGroup.spacing = 2 ;
            var updateActiveComp = mainGroup.add( "checkbox" , undefined , " - Update the Active Composition." );
            var ignoreLockedLayers = mainGroup.add( "checkbox" , undefined , " - Ignore Locked Layers." );
            ignoreLockedLayers.helpTip = "  If checked, the script will not change the length of a locked Layer."
            var btnsRow = mainGroup.add( "group" );
            btnsRow.orientation = "row" ;
            btnsRow.alignment = "center" ;
            btnsRow.spacing = 0 ;
            btnsRow.margins = [ 0 , 2 , 0 , 0 ];
            var btnSize = [ 60 , 20 ];
                var btnA = btnsRow.add( "button" , undefined , "Ok" );
                btnA.size = btnSize ;
                var btnB = btnsRow.add( "button" , undefined , "Default" );
                btnB.size = btnSize ;
                var btnC = btnsRow.add( "button" , undefined , "Cancel" );
                btnC.size = btnSize ;
    //Updating the UI with saved values.
    var savedUpdateActiveComp = JSON.parse( CTgetSavedString( "CTboxSave" , "updateActiveComp" ) );
    if( savedUpdateActiveComp == null ){ savedUpdateActiveComp = true };
    var savedIgnoreLockedLayers = JSON.parse( CTgetSavedString( "CTboxSave" , "ignoreLockedLayers" ) );
    if( savedIgnoreLockedLayers == null ){ savedIgnoreLockedLayers = false };
    updateActiveComp.value = savedUpdateActiveComp ;
    ignoreLockedLayers.value = savedIgnoreLockedLayers ;
    //UI Events.
    btnA.onClick = function(){ CTsaveString( "CTboxSave" , "updateActiveComp" , updateActiveComp.value ); CTsaveString( "CTboxSave" , "ignoreLockedLayers" , ignoreLockedLayers.value ); CompDurationEditorOptionsDialog.close(); };
    btnB.onClick = function(){ updateActiveComp.value = true ; ignoreLockedLayers.value = false ; };
    //Showing UI.
    CompDurationEditorOptionsDialog.show();

}