//****************************************//
//  General Functions
//****************************************//

//========== CTbox dialogs ==========
/**
 * Opens a dialog with a message for the user.
 * @param { string } title Name of the Dialog.
 * @param { string } messageContent Message displayed.
 */
function CTalertDlg( title , messageContent ){
    
    var alertDialog = new Window( "dialog" , title , undefined , { borderless : true } );
    alertDialog.spacing = 2 ;
        var textPanel = alertDialog.add( "panel" );
        textPanel.preferredSize = [ 200 , -1 ];
            textPanel.add( "staticText" , undefined , messageContent , { multiline : true } );
        var btnA = alertDialog.add( "button" , undefined , "Ok" );
    //UI Parameters
    alertDialog.defaultElement = btnA ;
    //Showing UI
    alertDialog.show();
}
/**
 * Opens a dialog giving a choice to the user.
 * @param { string } title - Name of the Dialog.
 * @param { string } messageContent - Message displayed.
 * @param { string } [ messageBtnA = "Yes" ] - Text on the first Button.
 * @param { string } [ messageBtnB = "No" ] - Text on the second Button.
 * @returns { boolean }
 */
function CTchoiceDlg( title , messageContent , messageBtnA , messageBtnB ){

    if( typeof messageBtnA === "undefined" ){ messageBtnA = "Yes" ; }
    if( typeof messageBtnB === "undefined" ){ messageBtnB = "No" ; }
    var choiceDialog = new Window( "dialog" , title , undefined , { borderless : true } );
    choiceDialog.spacing = 2 ;
        var textPanel = choiceDialog.add( "panel" );
        textPanel.preferredSize = [ 200 , - 1 ];
            textPanel.add( "staticText" , undefined , messageContent , { multiline : true } );
        var btnsRow = choiceDialog.add( "group" );
        btnsRow.spacing = 0 ;
            var btnA = btnsRow.add( "button" , undefined , messageBtnA );
            btnA.size = [ 75 , 25 ];
            var btnB = btnsRow.add( "button" , undefined , messageBtnB );
            btnB.size = [ 75 , 25 ];
    //Creating a variable to save the user's choice.
    var isAgreed = false ;
    //UI events
    btnA.onClick = function(){ isAgreed = true ; choiceDialog.close(); };
    btnB.onClick = function(){ isAgreed = false ; choiceDialog.close(); };
    //UI parameters
    choiceDialog.defaultElement = btnA ;
    //Showing UI
    choiceDialog.show();
    return isAgreed ;

}
//========== CTbox Utilities ==========
/**
 * @param { array } arrayToParse An Array in which search for the Item.
 * @param { string | number | object } itemToFind Item to search for.
 * @returns { number? } The Index of the Item in the Array or Null.
 */
function DropdownlistIndexOf( arrayToParse , itemToFind ){

    var index = null ;
    if( arrayToParse.length > 0 ){
        for( var i = 0 ; i < arrayToParse.length ; i++ ){
            if( arrayToParse[i].text == itemToFind ){
                index = i ;
                break ;
            }
        }
    }
    return index ;
}
/**
 * Checks if a string contains a number and return it as a number.
 * @param { string } stringToTreat The Input String.
 * @param { boolean } returnInteger Does the user wants an integer or a floating number.
 * @returns { number? } The Number found in the String or Null.
 */
function CTcleanNumberString( stringToTreat , returnInteger ){

    if( !isNaN( stringToTreat ) ){
        var finalNumber = 0 ;
        if( returnInteger ){ finalNumber = parseInt( stringToTreat , 10 ); } else { finalNumber = parseFloat( stringToTreat ); }
        return finalNumber ;
    } else {
        CTalertDlg( "Hum..Yeah...But no." , "   The value \"" + stringToTreat + "\" is not a usable number.\n\n   Try again." );
        return null ;
    }

}
/** 
 * Checks if there is any selected layer, store the layer object then deselect it.
 * @returns { array } Selected layers Objects.
 */
function CTcheckSelectedLayers(){

    var layersSelected = [] ;
    if( app.project.activeItem != undefined && app.project.activeItem.selectedLayers.length > 0 ){
        layersSelected = app.project.activeItem.selectedLayers ;
        while( app.project.activeItem.selectedLayers.length > 0 ){ app.project.activeItem.selectedLayers[0].selected = false }
    }
    return layersSelected ;

}
/**
 * Checks if there is any selected editable properties.
 * @returns { array? } Selected editable Properties.
 */
function CTcheckSelectedProperties(){

    var propertiesSelected = [] ;
    if( app.project.activeItem != undefined && app.project.activeItem.selectedProperties.length > 0 ){
        var currentPropertiesSelected = app.project.activeItem.selectedProperties ;
        for( var i = 0 ; i < currentPropertiesSelected.length ; i ++ ){
            if( currentPropertiesSelected[i].propertyType == PropertyType.PROPERTY ){
                //Saving the path from the property to the layer.
                var propertySpecs = [] ;
                var propertyToIndex = currentPropertiesSelected[i] ;
                for( var j = currentPropertiesSelected[i].propertyDepth ; j >= 0 ; j-- ){
                    if( j == 0 ){ propertySpecs.push( propertyToIndex );
                    } else {
                        propertySpecs.push( propertyToIndex.propertyIndex );
                        propertyToIndex = propertyToIndex.parentProperty ;
                    }
                }
                propertiesSelected.push( propertySpecs);
            }
        }
        //Removing the selection.
        if( propertiesSelected.length > 0 ){
            while( app.project.activeItem.selectedProperties.length > 0 ){
                app.project.activeItem.selectedProperties[0].selected = false ;
            }
        return propertiesSelected ;
        }
    }
    return null ;

}
/**
 * Returns the property from the list of its index ( output de CTcheckSelectedProperties )
 * @param { array } propertySpecs list of the indexes leading to the property.
 * @returns { object } the property object.
 */
function CTgetProperty( propertySpecs ){

    var propertyLayer = propertySpecs[ propertySpecs.length - 1 ];
    var propertyWanted = propertyLayer ;
    for (var i = propertySpecs.length - 2 ; i >= 0 ; i-- ){
        propertyWanted = propertyWanted.property( propertySpecs[i] );
    }
    return propertyWanted ;

}
/**
 * Saves a String inside a given txt file in the user roaming folder.
 * @param { string } saveFileName Name of the text file.
 * @param { string } stringCodename Codename of the String.
 * @param { string } stringToSave The actual String.
 */
function CTsaveString( saveFileName , stringCodename , stringToSave ){

    //Getting the txt File.
    var saveFile = new File( Folder.userData.fsName + "/" + saveFileName + ".txt" );
    if( saveFile.exists ){
        //Getting what is already written inside this saveFile.
        saveFile.open( "r" );
        var saveFileString = saveFile.read();
        saveFile.close();
        //Updating the string if its codename is found, else writing it down.
        var stringCodenameIndex = saveFileString.search( stringCodename );
        if( stringCodenameIndex >= 0 ){
            var StringEndIndex = saveFileString.search( "</Path" + stringCodename + ">" );
            var OldString = saveFileString.slice( stringCodenameIndex , StringEndIndex );
            saveFileString = saveFileString.replace( OldString , stringCodename + ">" + stringToSave );
        } else {
            saveFileString = saveFileString.concat( "<Path" + stringCodename + ">" + stringToSave + "</Path" + stringCodename + ">\r\n" );
        }
        saveFile.open("w");
        saveFile.write( saveFileString );
    } else {
        saveFile.open( "w" );
        saveFile.write("<Path" + stringCodename + ">" + stringToSave + "</Path" + stringCodename + ">\r\n");
    }
    saveFile.close();

}
/**
 * Gets a string from a given text file in the user roaming folder.
 * @param { string } saveFileName Name of the text file.
 * @param { string } stringCodename Codename of the String.
 * @returns { string | null } The string searched for if found, else null.
 */
function CTgetSavedString( saveFileName , stringCodename ){

    //Getting the text file.
    var saveFile = new File( Folder.userData.fsName + "/" + saveFileName + ".txt" );
    if( saveFile.exists ){
        //Getting what is already written inside this saveFile.
        saveFile.open( "r" );
        var saveFileString = saveFile.read();
        saveFile.close();
    } else {
        return null ;
    }
    //Getting the String.
    var stringCodenameIndex = saveFileString.search( stringCodename );
    if( stringCodenameIndex >= 0 ){
        var StringStartIndex = stringCodenameIndex + stringCodename.length + 1 ;
        var StringEndIndex = saveFileString.search( "</Path" + stringCodename + ">" );
        var String = saveFileString.slice( StringStartIndex , StringEndIndex );
        return String ;
    } else {
        return null ;
    }

}
/**
 * Increments the version of a file AND its main comp (if their names are identical). Then moves the older file in a "XX - AEP Older Versions" folder.
 * @param { string } type Code for the versioning: "X.0" to change the version, "0.X" to change the subversion.
 * @param { boolean } isToBeMoved The AEP file is to be moved into the "AEP Older Versions" Folder.
 */
function CTversioning( type , isToBeMoved ){
    
    //Checking if there is any project in After Effects.
    if( app.project != undefined ){
        //Checking if the project has been saved at least one time.
        if( app.project.file == null){
            CTalertDlg( "Saaaaaaaave!" , "I need you to save this project a first time to be able to work." );
            return ;
        }
        //Saving which item was the active one at the start of the script.
        var currentItem = app.project.activeItem ;
        var oldProjectFile = app.project.file ;
        //Saving the old project file name minus ".aep".
        var oldName = oldProjectFile.name.slice( 0 , oldProjectFile.name.length - 4 ).replace( /%20/gm , " ");
        //Creating the new file name according to the option selected.
        var newName = "" ;
        var versionRegExp = /v([0-9]{1,2}).([0-9]{1,4})/ ;
        if( oldName.search( versionRegExp ) >= 0 ){
            if( type == "X.0"){
                newName = oldName.replace( versionRegExp , function( versioning , version , subversion ){ return "v" + ( parseInt( version ) + 1 ) + ( subversion ? ".0" : "" ); } );
            } else {
                newName = oldName.replace( versionRegExp , function( versioning , version , subversion ){ return "v" + version + "." + ( parseInt( subversion ) + 1 ); } );
            }
        } else {
            newName = oldName + " v1.0" ;
        }
        //Creating the file for the new version of the project.
        var oldVersionFolderPath = oldProjectFile.fsName.split("\\");
        oldVersionFolderPath.pop();
        oldVersionFolderPath = oldVersionFolderPath.join( "/" );
        var newProjectFile = new File( oldVersionFolderPath + "/" + newName + ".aep" );
        //Checking that the file to create does not already exists.
        if( newProjectFile.exists && !CTchoiceDlg( "Well..." , "   The file \"" + newName +".aep\" exists already.\n\n   Are you sure that you want to overwrite it?" ) ){
            return ;
        }
        //Updating the name of the Main Comp ( which is supposed to have the same name as the old File ).
        var mainCompItem = null ;
        for ( var i = 1 ; i <= app.project.numItems ; i++ ){
            if( app.project.items[i].typeName == "Composition" && app.project.items[i].name == oldName && app.project.items[i].parentFolder == app.project.rootFolder ){
                mainCompItem = app.project.items[i] ;
                mainCompItem.name = newName ;
                break ;
            }
        }
        if( mainCompItem == null ){ CTalertDlg( "It's messy" , "You did not tidy your room enough, I can't find the project.\n\n   Your project comp can't be found in the root Folder of your project"); return ; }
        //Updating the Render Queue Item if its file is the main comp.
        for( var i = 1 ; i <= app.project.renderQueue.items.length ; i++ ){
            var activeRQitem = app.project.renderQueue.items[i];
            if( activeRQitem.status != RQItemStatus.QUEUED ){
                activeRQitem.remove();
                i-- ;
                continue ;
            }
            if( activeRQitem.comp == mainCompItem ){
                for( var j = 1 ; j <= activeRQitem.outputModules.length ; j++ ){
                    var activeOM = activeRQitem.outputModules[j];
                    var nameRegExp = new RegExp( oldName , "g" );
                    var new_data = {}
                    if( activeOM.getSettings(GetSettingsFormat.STRING)["Output File Info"]["Subfolder Path"] == "" ){
                        new_data = {
                            "Output File Info":
                            {
                                "Base Path": activeOM.getSettings(GetSettingsFormat.STRING)["Output File Info"]["Base Path"] ,
                                "File Name" : newName ,
                                "File Template": activeOM.getSettings(GetSettingsFormat.STRING)["Output File Info"]["File Template"].replace( nameRegExp , newName )
                            }
                        }
                    } else {
                        new_data = {
                            "Output File Info":
                            {
                                "Base Path": activeOM.getSettings(GetSettingsFormat.STRING)["Output File Info"]["Base Path"] ,
                                "Subfolder Path": newName ,
                                "File Name" : newName , 
                                "File Template": activeOM.getSettings(GetSettingsFormat.STRING)["Output File Info"]["File Template"].replace( nameRegExp , newName )
                            }
                        }
                    }
                    activeOM.setSettings( new_data );
                }
            }
        }
        if( isToBeMoved ){
            //Moving the old File in a "AEP Older Versions" Folder.
            var oldVersionsFolderPath = oldVersionFolderPath + "/XXx- AEP Older Versions -xXX";
            var oldVersionsFolder = new Folder( oldVersionsFolderPath );
            if( !oldVersionsFolder.exists ){ oldVersionsFolder.create(); }
            oldProjectFile.copy( oldVersionsFolderPath + "/" + oldName + ".aep" );
            oldProjectFile.remove();
        }
        app.project.save( newProjectFile );
        //Restoring the active item.
        if( currentItem != null ){ currentItem.openInViewer() };
    }

}
/**
 * Generates a 3 digits random ID for a layer.
 * @returns { string } A three digits string.
 */
 function CTgenerateIdNb(){

    var Id = JSON.stringify( Math.floor( Math.random() * 1000 ) )
    while( Id.length < 3 )
    {
        Id = "0" + Id ;
    }
    return Id ;

}
/**
 * Gets the path to the CTbox Script on the Computer.
 * @returns { object } The Folder in which the CTbox Script is located.
 */
function CTgetScriptFolder(){

    var scriptFolder = new Folder( "X:/AE - Scripts/CTboxAE" );
    var testFile = new File( scriptFolder.fsName + "/CTbox.jsx" );
	if( !testFile.exists ){
        scriptFolder = new Folder( Folder.userData.fsName + "/Adobe/After Effects/" + app.version.slice( 0 , 4 ) + "/Scripts/ScriptUI Panels" );
        testFile = new File( scriptFolder.fsName + "/CTbox.jsx" )
    }
    if( !testFile.exists ){
        scriptFolder = new Folder( Folder.appPackage.fsName + "/Scripts/ScriptUI Panels" );
    }
    return scriptFolder ;

}
/**
 * Checks which modifiers are pressed and retuns the status of all the modifiers.
 * @returns { object } An object containing ctrlState, majState, altState corresponding to the state of the keys.
 */
 function CTmodifiersStatuses(){

    //Saving the keyboard state.
    var keysState = ScriptUI.environment.keyboardState ;
    //Saving the state of the modifiers in an object.
    var modifiers = new Object();
    modifiers.ctrlState = keysState.ctrlKey ;
    modifiers.majState = keysState.shiftKey ;
    modifiers.altState = keysState.altKey ;
    //Returning the object.
    return modifiers ;

}
/**
 * Returns an array containing the key objects of a property
 * @param { object } property The property object you want to save the keys from.
 * @returns { array } An array containing all of the keys object of the selected property.
 */
function CTsavePropertyKeys( property ){
    
    var propertyKeys = [] ;
    if( property.numKeys !== "undefined" && property.numKeys > 0 ){
        for( var i = 1 ; i <= property.numKeys ; i++ ){
            var key = new Object();
            key.time = property.keyTime( i );
            key.value = property.keyValue( i ) ;
            key.inInterpolationType = property.keyInInterpolationType( i );
            key.outInterpolationType = property.keyOutInterpolationType( i );
            if( property.propertyValueType == PropertyValueType.ThreeD_SPATIAL || property.propertyValueType == PropertyValueType.TwoD_SPATIAL ){
                key.spatial = true ;
                key.inTangent = property.keyInSpatialTangent( i );
                key.outTangent = property.keyOutSpatialTangent( i );
                key.continuous = property.keySpatialContinuous( i );
                key.autoBezier = property.keySpatialAutoBezier( i );
                key.roving = property.keyRoving( i );
            }
            key.inEase = property.keyInTemporalEase( i );
            key.outEase = property.keyOutTemporalEase( i );
            key.continuous = property.keyTemporalContinuous( i );
            key.autoBezier = property.keyTemporalAutoBezier( i );
            key.index = i;
            propertyKeys.push( key );
        }
    }
    return propertyKeys

}
/**
 * Opens a dialog after checking the options of the layers to let the user decide if he wants to pursue or not for each layer.
 * @param { array } layers An array containing the layer object and caracteristics for the layer bottom detection.
 */
function layerAnalysisChoiceDialog( layers ){
    var dlg = new Window( "dialog" , "Layer Bottom Detection Choice" , undefined , { borderless : true } );
    dlg.group = dlg.add( "group" );
    dlg.group.alignChildren = "fill" ;
    dlg.group.spacing = 2 ;
    dlg.lines = dlg.group.add( "group" );
    dlg.lines.maximumSize = [ 250 , 10000 ];
    dlg.lines.orientation = "column" ;
    dlg.lines.spacing = 2 ;
    //Creating lines for each layer selected.
    for( var i = 0 ; i < layers.length ; i++ ){
        //Creating the warning text according to the  characteristics of the layer.
        var warningText = "";
        if( layers[i].analysisDuration <= 0 ){
            warningText = " > This layer is out of Bounds.";
        }
        if( warningText != " > This layer is out of Bounds." && layers[i].existingLowestPoint ){
            warningText += " > This layer has already been analysed for lowest point.";
        }
        if( warningText != " > This layer is out of Bounds." && layers[i].hasEffectActive ){
            warningText += " > This layer has active effects.";
        }
        if( warningText != " > This layer is out of Bounds." && layers[i].object.width > 3000 ){
            warningText += " > This layer is more than 3000px in width.";
        }
        if( warningText != " > This layer is out of Bounds." && layers[i].object.height > 3000 ){
            warningText += " > This layer is more than 3000px in height.";
        }
        if( warningText != " > This layer is out of Bounds." && layers[i].analysisDuration.toFixed(2) > 3 ){
            warningText += " > This layer will be analysed over more than 5s.";
        }
        if( warningText == "" ){
            warningText = " > Nothing to worry about."
        } else if( warningText != " > This layer is out of Bounds." && warningText != " > This layer has already been analysed for lowest point." ){
            warningText = warningText.replace( /. > /gm , ".\n > " );
            warningText += "\n\n   This might affect the length of the analysis in heavy proportions...\n    Even cause crashes..."
        }
        //Actually creating the lines.
        var line = dlg.lines.add( "panel" , undefined , layers[i].index + " - " + layers[i].name + " :" );
        line.alignChildren = [ "left" , "center" ];
        line.spacing = 2 ;
        line.margins = [ 5 , 10 , 5 , 5 ];
        var layerWarnings = line.add( "Panel" , undefined , "Warning : " );
        layerWarnings.alignment = "Fill" ;
        layerWarnings.margins = [ 15 , 10 , 5 , 5 ];
        var warnings = {}
        if( warningText == " > This layer is out of Bounds." || warningText == " > Nothing to worry about."){
            warnings = layerWarnings.add( "statictext" , undefined , warningText , { multiline : false } );
        } else { 
            warnings = layerWarnings.add( "statictext" , undefined , warningText , { multiline : true } );
        }
        warnings.alignment = "Fill" ;
        var layerChoice = line.add( "group" );
        layerChoice.add( "statictext" , undefined , "Discard this layer ?");
        var layerDiscard = layerChoice.add( "radiobutton" , undefined , " - Yes.");
        layerDiscard.characters = 4 ;
        var layerNotDiscard = layerChoice.add( "radiobutton" , undefined , " - No.");
        layerNotDiscard.characters = 4 ;
        layerNotDiscard.value = true ;
        
        //Updating radio buttons according to the warning message.
        if( warnings.text == " > This layer is out of Bounds." ){
            layerDiscard.value = true ;
            layerDiscard.enabled = false ;
            layerNotDiscard.enabled = false ;
        }
    }
    //Calculating layout to be able to know the height of the window.
    dlg.layout.layout( true );
    //Adding a scrollbar
    if( dlg.group.size[1] > 600 ){
        dlg.group.maximumSize = [ 500 , 600 ];
        dlg.group.scrollbar = dlg.group.add( "group" );
        dlg.group.scrollbar.maximumSize = [ 250 , 10000 ];
        dlg.group.scrollbar.margins = [ 0 , 10 , 0 , 0 ];
        var scrollbar = dlg.group.scrollbar.add( "scrollbar" );
            scrollbar.alignment = [ "center" , "top" ];
            scrollbar.size = [ 10 , 590 ];
    }
    //Creating the rest of the dialog.
    var saveChoiceLine = dlg.add( "panel" , undefined , "Think about it twice :" );
    saveChoiceLine.spacing = 0 ;
    saveChoiceLine.alignment = "fill" ;
    saveChoiceLine.alignChildren = "fill"
        var saveChoiceText = saveChoiceLine.add( "statictext" , undefined , "   Do you want me to save before I start?" );
        saveChoiceText.characters = 23 ;
        saveChoiceText.alignment = "center" ;
        var saveRadiosLine = saveChoiceLine.add( "group" );
        saveRadiosLine.alignment = "center" ;
            var saveTheFile = saveRadiosLine.add( "radiobutton" , undefined , " - Yes" );
            saveTheFile.characters = 4 ;
            saveTheFile.value = true ;
            var saveNotTheFile = saveRadiosLine.add( "radiobutton" , undefined , " - No" );
            saveNotTheFile.characters = 3 ;
    var btnsRow = dlg.add( "group" );
        btnsRow.orientation = "row" ;
        btnsRow.spacing = 0 ;
        var btnSize = [ 60 , 20 ];
            var btnA = btnsRow.add( "button" , undefined , "Proceed" );
            btnA.size = btnSize ;
            var btnB = btnsRow.add( "button" , undefined , "Cancel" );
            btnB.size = btnSize ;
    //Updationg layout.
    dlg.layout.layout( true );
    //UI parameters
    dlg.defaultElement = btnA ;
    //UI Events.
    if( dlg.group.size[1] >= 600 ){
        scrollbar.onChange = function(){ dlg.lines.location = [ 0 , 0 - ( ( dlg.lines.size[1] - dlg.group.size[1] ) * scrollbar.value / scrollbar.maxvalue ) ]; }
        scrollbar.onChanging = function(){ dlg.lines.location = [ 0 , 0 - ( ( dlg.lines.size[1] - dlg.group.size[1] ) * scrollbar.value / scrollbar.maxvalue ) ]; }
    }
    btnA.onClick = function(){
        if( saveTheFile.value ){
            app.project.save();
        }
        for( i = 0 ; i < dlg.lines.children.length ; i++ ){
            if( dlg.lines.children[i].children[1].children[1].value ){
                layers[i].toBeProcessed = false ;
            }
        }
        dlg.close() ; }
    btnB.onClick = function(){ layers = []; dlg.close() ; }
    //Showing UI.
    dlg.show();
    return layers;
}