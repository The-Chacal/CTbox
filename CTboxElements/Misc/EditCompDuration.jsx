//****************************************//
//   Composition Duration Manager v1.1
//****************************************//

// Functions managing the length of a comp and all its components.

/**
 * Creates the UI.
 */
function choiceCompDuration(){
    
    var choiceCompDurationDlg = new Window( "palette" , { en:"Choice of the new Duration" , fr: "Choix de la nouvelle durée" } );
    choiceCompDurationDlg.frameLocation = [ 960 , 500 ] ;
    choiceCompDurationDlg.global = choiceCompDurationDlg.add( "Panel" , undefined , { en: "Settings :" , fr: "Réglages :" } );
    choiceCompDurationDlg.global.orientation = "Column" ;
    choiceCompDurationDlg.global.alignChildren = "Fill" ; 
    choiceCompDurationDlg.global.spacing = 5 ;
    choiceCompDurationDlg.global.margins = [ 5 , 10 , 5 , 5 ] ;
        var row1 = choiceCompDurationDlg.global.add( "Group" );
        row1.orientation = "row";
        row1.spacing = 5 ;
        row1.alignChildren = [ "Left" , "Center" ];
            row1.Selector = row1.add( "RadioButton" , undefined , { en: "Duration" , fr: "Durée :" } );
            row1.Selector.characters = 8 ;
            row1.Selector.value = true ;
            var durationWanted = row1.add( "EditText{ text : '' , justify : 'center' , characters : 10 , properties : { enabled : true } }" );
            var durationUnitsA = row1.add( "RadioButton" , undefined , "Fr");
            durationUnitsA.value = true ;
            var durationUnitsB = row1.add( "RadioButton" , undefined , "Sec");
        var row2 = choiceCompDurationDlg.global.add( "Group" , undefined );
        row2.orientation = "row";
        row2.spacing = 5 ;
        row2.alignChildren = [ "Left" , "Center" ];
            row2.Selector = row2.add( "RadioButton" , undefined , { en: "Ref Layer :" , fr: "Calque Ref :" } );
            row2.Selector.characters = 8 ;
            var layerRefChoice = row2.add( "DropDownList" )
            layerRefChoice.itemSize[0] = 71 ;
            layerRefChoice.selection = layerRefChoice.items[0];
            var refreshLayerList = row2.add( "Button" , undefined , { en: "Refresh" , fr: "Actualiser" } );
            refreshLayerList.size = [ 75 , 25 ];
        var changeDuration = choiceCompDurationDlg.global.add( "Button" , undefined , { en: "Modify" , fr: "Modifier" } );
        changeDuration.size = [ 75 , 25 ];
    //UI Events.
    row1.Selector.onClick = function(){ row2.Selector.value = false };
    row2.Selector.onClick = function(){ row1.Selector.value = false };
    durationWanted.onChange = function(){ row1.Selector.value = true ; row2.Selector.value = false };
    durationUnitsA.onClick = function(){ row1.Selector.value = true ; row2.Selector.value = false };
    durationUnitsB.onClick = function(){ row1.Selector.value = true ; row2.Selector.value = false };
    layerRefChoice.onChange = function(){ row2.Selector.value = true ; row1.Selector.value = false };
    refreshLayerList.onClick = function(){ getListOfLayers( layerRefChoice ) };
    changeDuration.onClick = function(){ if( editCompDuration( row2.Selector.value , durationWanted.text , durationUnitsA.value , layerRefChoice.selection.text ) ){ choiceCompDurationDlg.close(); } };
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
 * Gets all information needed.
 * @param { boolean } hasRefLayer Uses a Reference Layer.
 * @param { string } refLayer A string with the Index and Name of the layer selected as reference for duration.
 * @param { number } durationWanted  Duration wanted.
 * @param { boolean } isFrames Duration is in Frames.
 * @returns { boolean } Success.
 */
function editCompDuration( hasRefLayer , durationWanted , isFrames , refLayer ){
    
    if( app.project.activeItem != undefined ){
        if( !hasRefLayer ){
            if( isNaN( durationWanted ) ){
                CTalertDlg( "Nope" , { en: "   The Duration entered is not a Number" , fr: "   La durée demandée n'est pas un nombre." } );
                return false ;
            } else {
                if( isFrames ){
                        durationWanted = durationWanted * app.project.activeItem.frameDuration ;
                }
            }            
        } else {
            var refLayerIndex = parseFloat( refLayer.slice( 0 , refLayer.indexOf( " - " ) ) );
            durationWanted = app.project.activeItem.layer( refLayerIndex ).outPoint - app.project.activeItem.layer( refLayerIndex ).inPoint ;
        }
        var selectedLayers = CTcheckSelectedLayers() ;
        if( selectedLayers.length > 0 ){
            for( var i = 0 ; i < selectedLayers.length ; i++ ){
                app.beginUndoGroup( "Edit Comp Duration" );
                editingCompDuration( selectedLayers[i].source , durationWanted );
                app.endUndoGroup();
            }
        }
        CTalertDlg( { en: "I'm Done" , fr: "J'ai Fini" } , { en: "I've finished changing the duration of your Comps" , fr: "J'ai fini de retimer tes Compos." } );
        return true ;
    }
    
}
/**
 * Recursive function that modifies the length of Comp.
 * @param { object } item Comp to modify.
 * @param { number } durationWanted Duration wanted in seconds.
 */
function editingCompDuration( item , durationWanted ){
    
    if( item.typeName == "Composition" && item.duration != durationWanted ){
        var oldDuration = item.duration ;
        item.duration = durationWanted ;
        for( var i = 1 ; i <= item.layers.length ; i++ ){
            var isLocked = item.layers[i].locked ;
            if( isLocked ){ item.layers[i].locked = false ; }
            if( item.layers[i].source.typeName == "Composition" && item.layers[i].duration != durationWanted ){
                IV2editCompDuration( item.layers[i].source , durationWanted );
                if( item.layers[i].outPoint == item.layers[i].inPoint + oldDuration ){
                    item.layers[i].outPoint = item.layers[i].inPoint + durationWanted ;
                }
            } else if( item.layers[i].outPoint == oldDuration ){
                item.layers[i].outPoint = durationWanted ;
            }
            if( isLocked ){ item.layers[i].locked = true ; }
        }
    }
    
}