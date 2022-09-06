//========== Script Launch ==========
if ( CTcheckScriptWriting( this ) ){
    // Including all the scripts files needed for the toolbox.
    //@include "CTboxElements/GeneralFunctions.jsx"
    //@include "CTboxElements/Expressions/MarkerAccum.jsx";
    //@include "CTboxElements/Expressions/MarkerAnimation.jsx";
    //@include "CTboxElements/Expressions/PosterizeProperty.jsx";
    //@include "CTboxElements/Expressions/UpdateExp.jsx";
    //@include "CTboxElements/Layer/AddShadowLayer.jsx";
    //@include "CTboxElements/Layer/AnimationDetector.jsx";
    //@include "CTboxElements/Layer/ApplyGradient.jsx";
    //@include "CTboxElements/Layer/ApplyRim.jsx";
    //@include "CTboxElements/Layer/CopyMarker.jsx";
    //@include "CTboxElements/Layer/CreateCastShadow.jsx";
    //@include "CTboxElements/Layer/CreateMarkersForKeys.jsx";
    //@include "CTboxElements/Layer/DepthDisplacement.jsx";
    //@include "CTboxElements/Layer/LayerCleaner.jsx";
    //@include "CTboxElements/Layer/GetLayerBottom.jsx";
    //@include "CTboxElements/Misc/AddSeparator.jsx";
    //@include "CTboxElements/Misc/CollapseTransformationManager.jsx";
    //@include "CTboxElements/Misc/CompDurationEditor.jsx";
    //@include "CTboxElements/Misc/UpdateCTbox.jsx";
    // Launching the creation of the toolbox UI.
    CTbuildUI( this );
}
//========== UI Setup ==========
/**
 * Creates the UI for the Chacal Toolbox
 * @param { object } thisObj this - if the script is put in the Scripts UI folder of After Effects, using "this" allows to create a dockable panel.
 */
function CTbuildUI( thisObj ){
    
    var CTboxVersion = "CTbox v1.2.12"//x.y.z - x > major change | y > addition of a fonctionnality | z > debug.
    //Getting the path to the Script on the Computer.
    var scriptFolder = CTgetScriptFolder();
    //Creating the UI
    var CTpanel = thisObj ;
    if( CTpanel instanceof Panel == false ){
        CTpanel = new Window( "palette" , "CTbox" );
    }
    CTpanel.orientation = "row" ;
    CTpanel.spacing = 2 ;
    var globalGroup = CTpanel.add( "group" );
    globalGroup.spacing = 2 ;
    globalGroup.orientation = "column" ;
    globalGroup.alignment = [ "left" , "top" ];
        //Creating the Panel Selection Buttons Block.
        var Block0 = globalGroup.add( "group" );
        Block0.spacing = 0 ;
        Block0.orientation = "row" ;
            var B0Btn01 = Block0.add( "iconButton" );
            B0Btn01.text = "Exp" ;
            B0Btn01.helpTip = "Expressions Panel" ;
            B0Btn01.size = [ 25 , 25 ];
            var B0Btn02 = Block0.add( "iconButton" );
            B0Btn02.text = "Lay" ;
            B0Btn02.helpTip = "Layer Panel" ;
            B0Btn02.size = [ 25 , 25 ];
            var B0Btn03 = Block0.add( "iconButton" );
            B0Btn03.text = "Mis" ;
            B0Btn03.helpTip = "Miscellaneous Panel" ;
            B0Btn03.size = [ 25 , 25 ];
        //Creating the Panels Block.
        var panelsBlock = globalGroup.add( "group" );
        panelsBlock.orientation = "Stack" ;
        panelsBlock.alignChildren = [ "center" , "top" ];
        var btnsSize = [ 75 , 25 ];
            var Block01 = panelsBlock.add( "panel" , undefined , "Expr. :" );
            Block01.margins = [ 5 , 10 , 5 , 5 ] ;
            Block01.spacing = 2 ;
                var B1Btn01 = Block01.add( "button" , undefined , "Fix Exp." );
                B1Btn01.helpTip = "   Edit Expressions trough Layers or Properties." ;
                B1Btn01.size = btnsSize ;
                var B1Btn02 = Block01.add( "button" , undefined , "Psz. Pro." );
                B1Btn02.helpTip = "   Add an Expression to the selected Properties in order to posterize it.\n   This script adds a Slider Effect to set the step." ;
                B1Btn02.size = btnsSize ;
                var B1Btn03 = Block01.add( "button" , undefined , "Mark. Accum." );
                B1Btn03.helpTip = "   Add a variable to the Expression of the selected Properties that increases passing each Marker on the Layer.\n   This script requires Markers on Layer to work." ;
                B1Btn03.size = btnsSize ;
                var B1Btn04 = Block01.add( "button" , undefined , "Mark. Anim." );
                B1Btn04.helpTip = "   Freeze the animation of a Property until the next Marker on the Layer.\n   This script requires Markers on Layer to work." ;
                B1Btn04.size = btnsSize ;
                var B1Btn05 = Block01.add( "button" , undefined , "" );
                B1Btn05.helpTip = "" ;
                B1Btn05.size = btnsSize ;
                B1Btn05.visible = false ;
                var B1Btn06 = Block01.add( "button" , undefined , "" );
                B1Btn06.helpTip = "" ;
                B1Btn06.size = btnsSize ;
                B1Btn06.visible = false ;
                var B1Btn07 = Block01.add( "button" , undefined , "" );
                B1Btn07.helpTip = "" ;
                B1Btn07.size = btnsSize ;
                B1Btn07.visible = false ;
                var B1Btn08 = Block01.add( "button" , undefined , "" );
                B1Btn08.helpTip = "" ;
                B1Btn08.size = btnsSize ;
                B1Btn08.visible = false ;
                var B1Btn09 = Block01.add( "button" , undefined , "" );
                B1Btn09.helpTip = "" ;
                B1Btn09.size = btnsSize ;
                B1Btn09.visible = false ;
                var B1Btn10 = Block01.add( "button" , undefined , "" );
                B1Btn10.helpTip = "" ;
                B1Btn10.size = btnsSize ;
                B1Btn10.visible = false ;
            var Block02 = panelsBlock.add( "panel" , undefined , "Layer :" );
            Block02.margins = [ 5 , 10 , 5 , 5 ] ;
            Block02.spacing = 2 ;
            Block02.visible = false ;
                var B2Btn01Block = Block02.add( "group" );
                B2Btn01Block.orientation = "row" ;
                B2Btn01Block.spacing = 0 ;
                    var B2Btn01 = B2Btn01Block.add( "button" , undefined , "Get Bot." );
                    B2Btn01.helpTip = "   Locates the lowest alpha point on the layer, for the length of the active layer.\n   Adds a point Effect to the layer." ;
                    B2Btn01.size = btnsSize - [ 16 , 0 ];
                    var B2Btn01optns = B2Btn01Block.add( "iconButton" , undefined , new File( scriptFolder.fsName + "/CTboxElements/PNG/w12-Gear.png") );
                    B2Btn01optns.helpTip = "   \"Get Lowest Layer Point\" Options" ;
                    B2Btn01optns.size = [ 16 , btnsSize[1] ];
                var B2Btn02Block = Block02.add( "group" );
                B2Btn02Block.orientation = "row" ;
                B2Btn02Block.spacing = 0 ;
                    var B2Btn02 = B2Btn02Block.add( "button" , undefined , "Det. Anim." );
                    B2Btn02.helpTip = "   Adds a Marker on the Layer if it \"moves\"." ;
                    B2Btn02.size = btnsSize - [ 16 , 0 ];
                    var B2Btn02optns = B2Btn02Block.add( "iconButton" , undefined , new File( scriptFolder.fsName + "/CTboxElements/PNG/w12-Gear.png") );
                    B2Btn02optns.helpTip = "   \"Animation Detector\" Options" ;
                    B2Btn02optns.size = [ 16 , btnsSize[1] ];
                var B2Btn03 = Block02.add( "button" , undefined , "Add Grad." );
                B2Btn03.helpTip = "   Creates a Gradient in Multiply Mode." ;
                B2Btn03.size = btnsSize ;
                var B2Btn04Block = Block02.add( "Group" );
                B2Btn04Block.orientation = "row" ;
                B2Btn04Block.spacing = 0 ;
                    var B2Btn04a = B2Btn04Block.add( "button" , undefined , "Add Rim" );
                    B2Btn04a.helpTip = "   Creates an outside Rim Light in Overlay Mode." ;
                    B2Btn04a.size = [ btnsSize[0] / 2 , btnsSize[1] ];
                    var B2Btn04b = B2Btn04Block.add( "button" , undefined , "Add Rim" );
                    B2Btn04b.helpTip = "   Creates an inside Rim Light in Multiply Mode." ;
                    B2Btn04b.size = [ btnsSize[0] / 2 , btnsSize[1] ];
                var B2Btn05 = Block02.add( "button" , undefined , "Gro. Sha." );
                B2Btn05.helpTip = "   Creates a Shadow Layer for the selected layer." ;
                B2Btn05.size = btnsSize ;
                var B2Btn06 = Block02.add( "button" , undefined , "Cast Sha." );
                B2Btn06.helpTip = "   Creates a Silhouette Shadow Layer for the selected layer." ;
                B2Btn06.size = btnsSize ;
                var B2Btn07 = Block02.add( "button" , undefined , "Key to Mark." );
                B2Btn07.helpTip = "   Adds Markers for each animation key on the layer." ;
                B2Btn07.size = btnsSize ;
                var B2Btn08 = Block02.add( "button" , undefined , "Cop. Mark." );
                B2Btn08.helpTip = "   Copies the Markers from one layer and pastes it on the selected others." ;
                B2Btn08.size = btnsSize ;
                var B2Btn09 = Block02.add( "button" , undefined , "Mov. Dep." );
                B2Btn09.helpTip = "   Moves the layer to the depth wanted" ;
                B2Btn09.size = btnsSize ;
                var B2Btn10Block = Block02.add( "group" );
                B2Btn10Block.orientation = "row" ;
                B2Btn10Block.spacing = 0 ;
                    var B2Btn10 = B2Btn10Block.add( "button" , undefined , "Clean Lay." );
                    B2Btn10.helpTip = "   Deletes selected properties on the selected layer." ;
                    B2Btn10.size = btnsSize - [ 16 , 0 ];
                    var B2Btn10optns = B2Btn10Block.add( "iconButton" , undefined , new File( scriptFolder.fsName + "/CTboxElements/PNG/w12-Gear.png") );
                    B2Btn10optns.helpTip = "   \"Layer Cleaner\" Options" ;
                    B2Btn10optns.size = [ 16 , btnsSize[1] ];
            var Block03 = panelsBlock.add( "panel" , undefined , { en: "Misc. :" , fr: "Divers :" } );
            Block03.margins = [ 5 , 10 , 5 , 5 ] ;
            Block03.spacing = 2 ;
            Block03.visible = false ;
                var B3Btn01Block = Block03.add( "Group" );
                B3Btn01Block.orientation = "row" ;
                B3Btn01Block.spacing = 0 ;
                    var B3Btn01 = B3Btn01Block.add( "button" , undefined , "Comp. Dur." );
                    B3Btn01.helpTip = "   Edit the duration of a Composition and its elements to the duration wanted." ;
                    B3Btn01.size = btnsSize - [ 16 , 0 ];
                    var B3Btn01optns = B3Btn01Block.add( "iconButton" , undefined , new File( scriptFolder.fsName + "/CTboxElements/PNG/w12-Gear.png") );
                    B3Btn01optns.helpTip = "   \"Composition Duration Editor\" Options"
                    B3Btn01optns.size = [ 16 , btnsSize[1] ];
                var B3Btn02 = Block03.add( "button" , undefined , "Col. Comp." );
                B3Btn02.helpTip = "   Enable the collapse transformations for the selected Composition and its elements.\n   Risky move to my opinion!" ;
                B3Btn02.size = btnsSize ;
                var B3Btn03 = Block03.add( "button" , undefined , "Add Sep." );
                B3Btn03.helpTip = "   Adds a Separator in your active Composition above your selected Layer.\n\n   CTRL + Click : Add a named Separator in your active Composition above your selected Layers.\n   MAJ + Click : Add a Separator in your active Composition above your selected Layers and parent the Layers to the Separator.\n   ALT + Click : Add a Separator in your active Composition above each of your selected Layers.\n   ALT + SHIFT + Click : Add a Separator in your active Composition above each of your selected Layers and parent the Layer to its Separator.\n   ALT + SHIFT + CTRL : Add a named Separator in your active Composition above each of your selected Layers and parent the Layer to its Separator." ;
                B3Btn03.size = btnsSize ;
                var B3Btn04 = Block03.add( "button" , undefined , "" );
                B3Btn04.helpTip = "" ;
                B3Btn04.size = btnsSize ;
                B3Btn04.visible = false ;
                var B3Btn05 = Block03.add( "button" , undefined , "" );
                B3Btn05.helpTip = "" ;
                B3Btn05.size = btnsSize ;
                B3Btn05.visible = false ;
                var B3Btn06 = Block03.add( "button" , undefined , "" );
                B3Btn06.helpTip = "" ;
                B3Btn06.size = btnsSize ;
                B3Btn06.visible = false ;
                var B3Btn07 = Block03.add( "button" , undefined , "" );
                B3Btn07.helpTip = "" ;
                B3Btn07.size = btnsSize ;
                B3Btn07.visible = false ;
                var B3Btn08 = Block03.add( "button" , undefined , "" );
                B3Btn08.helpTip = "" ;
                B3Btn08.size = btnsSize ;
                B3Btn08.visible = false ;
                var B3Btn09 = Block03.add( "button" , undefined , "" );
                B3Btn09.helpTip = "" ;
                B3Btn09.size = btnsSize ;
                B3Btn09.visible = false ;
                var B3Btn10 = Block03.add( "button" , undefined , "Upd." );
                B3Btn10.helpTip = "Update the Script - Only works on the studio network." ;
                B3Btn10.size = btnsSize ;
        //Creating the Versionning Block.
        var BlockXX = globalGroup.add( "group" );
        BlockXX.orientation = "column";
        BlockXX.spacing = 4 ;
            var versionBlock = BlockXX.add( "panel" );
            versionBlock.margins = [ 5 , 2 , 5 , 2 ];
            versionBlock.orientation = "row";
            versionBlock.spacing = 1 ;
                var BXBtn01 = versionBlock.add( "button" , undefined , "vX.0" );
                BXBtn01.helpTip = "   Increment the first number of the version of the file.\n   For this script to work, your main Composition has to be named exactly as the aep file and be at the root of the \"Project\" panel. The version number has to be at the end of the name."
                BXBtn01.size = [ btnsSize[0] / 2 , btnsSize[1] ];
                var BXBtn02 = versionBlock.add( "button" , undefined , "v0.X" );
                BXBtn02.helpTip = "   Increment the second number of the version of the file.\n   For this script to work, your main Composition has to be named exactly as the aep file and be at the root of the \"Project\" panel. The version number has to be at the end of the name."
                BXBtn02.size = [ btnsSize[0] / 2 , btnsSize[1] ];
            var CTboxVersionBlock = BlockXX.add( "group" );
            CTboxVersionBlock.margins = [ 1 , 0 , 1 , 0 ];
            CTboxVersionBlock.alignment = "right";
            CTboxVersionBlock.spacing = 0 ;
                var BXBtn03 = CTboxVersionBlock.add( "iconButton" , undefined , new File( scriptFolder.fsName + "/CTboxElements/PNG/w12-Gear.png") );
                BXBtn03.helpTip = " \"Id\" Options."
                BXBtn03.size = [ 16 , 16 ];
                var BXBtn04 = CTboxVersionBlock.add( "iconButton" , undefined , new File( scriptFolder.fsName + "/CTboxElements/PNG/w12-notePad.png") );
                BXBtn04.helpTip = "   Open/close Notepad."
                BXBtn04.size = [ 16 , 16 ];
            var versionText = BlockXX.add( "staticText" , undefined , CTboxVersion );
            versionText.alignment = "right";
    //Updating the Layout.
    CTpanel.layout.layout( "true" );
    //UI Events.
    CTpanel.onResizing = function(){ CTpanel.layout.resize(); }
    //UI events for Panel Selection Buttons Block.
    B0Btn01.onClick = function(){ Block02.visible = false ; Block03.visible = false ; Block01.visible = true ; CTsaveString( "CTboxSave" , "VisiblePanel" , "0" ) };
    B0Btn02.onClick = function(){ Block01.visible = false ; Block03.visible = false ; Block02.visible = true ; CTsaveString( "CTboxSave" , "VisiblePanel" , "1" ) };
    B0Btn03.onClick = function(){ Block01.visible = false ; Block02.visible = false ; Block03.visible = true ; CTsaveString( "CTboxSave" , "VisiblePanel" , "2" ) };
    //UI events for Block01.
    B1Btn01.onClick = updateExpChoice ;
    B1Btn02.onClick = posterizeProp ;
    B1Btn03.onClick = markerAccum ;
    B1Btn04.onClick = markerAnimation ;
    //UI events for Block02.
    B2Btn01.onClick = function(){ getLayerBottom( true , true ) };
    B2Btn01optns.onClick = getLayerBottomOptions ;
    B2Btn02.onClick = detectAnimation ;
    B2Btn02optns.onClick = getAnimDetectionOptions ;
    B2Btn03.onClick = applyGradient ;
    B2Btn04a.onClick = function(){ applyRim( true ); };
    B2Btn04b.onClick = function(){ applyRim( false ); };
    B2Btn05.onClick = addShadowLayer ;
    B2Btn06.onClick = createCastShadow ;
    B2Btn07.onClick = createMarkersForKeysChoice ;
    B2Btn08.onClick = copyMarkerChoice ;
    B2Btn09.onClick = depthChoice ;
    B2Btn10.onClick = layerCleaner ;
    B2Btn10optns.onClick = layerCleanerOptions ;
    //UI events for Bloc03.
    B3Btn01.onClick = compDurationChoice ;
    B3Btn01optns.onClick = compDurationEditorOptions ;
    B3Btn02.onClick = collapseTransformationManager ;
    B3Btn03.onClick = addSeparator ;
    B3Btn10.onClick = updateCTbox ;
    //UI events for Versionning Block.
    BXBtn01.onClick = function(){ CTversioning( "X.0" ) };
    BXBtn02.onClick = function(){ CTversioning( "0.X" ) };
    BXBtn03.onClick = CTboxOptions;
    BXBtn04.onClick = function(){ CTexpandNotepad( CTpanel ) };
    //Checking which Panel was the last actived and showing it.
    var ActivePanel = CTgetSavedString( "CTboxSave" , "VisiblePanel" );
    if( ActivePanel != null ){
        Block0.children[ ActivePanel ].notify();
    }
    //Allows the script to run as a window if it has not been placed in the "ScriptUI Panels" folder.
    if( CTpanel.type == "palette" ){
        CTpanel.show();
    }

}
/**
 * Checks if After Effects allows scripts to access the network and write files.
 * @param { object } thisObj this.
 * @returns { boolean }
 */
function CTcheckScriptWriting( thisObj ){

    if ( app.preferences.getPrefAsLong("Main Pref Section","Pref_SCRIPTING_FILE_NETWORK_SECURITY") != 1 ){
        var BugDlg = thisObj ;
        var BugPanel = BugDlg.add( "panel" , undefined , "Small Problem : " );
        BugPanel.add( "StaticText" , undefined ,"You need to authorize the scripts to write files and access network in the Preferences.\n\n   You need to close this, make the change, then relaunch the Script." , { multiline: true } );
        thisObj.layout.layout( true );
        return false ;
    } else {
    return true ;
    }

}
/**
 * Show/Hide the Notepad on the side of the Toolbox.
 * @param { object } Dlg Container to which add the notepad.
 */
function CTexpandNotepad( Dlg ){
    if( Dlg.children.length < 2 ){
        var notepad = Dlg.add( "panel" , undefined , "Notepad" );
        notepad.alignment = "Top" ;
        notepad.margins = [ 5 , 10 , 5 , 5 ];
            var notepadText = notepad.add( "EditText" , undefined , "You can write your thoughts here..." , { multiline: true , scrollable: true } );
            var SavedText = CTgetSavedString( "CTboxSave" , "Notepad" );
            if( SavedText != null ){
                notepadText.text = SavedText ;
            }
        notepadText.preferredSize = [ 200 , Dlg.children[0].size[1] - 25 ];
        notepadText.onActivate = function(){ if( notepadText.text == "You can write your thoughts here..." ){ notepadText.text = "" ; } };
        notepadText.onChange = function(){ CTsaveString( "CTboxSave" , "Notepad" , notepadText.text ) };
    } else {
        Dlg.remove( Dlg.children[1] );
    }
    Dlg.layout.layout(true)
    
}
/**
 * Opens the CTbox options Panel.
 */
function CTboxOptions(){

    var CTboxOptnsDlg = new Window( "dialog" , undefined , undefined , { borderless : true } );
    CTboxOptnsDlg.spacing = 2 ;
        var textPanel = CTboxOptnsDlg.add( "panel" , undefined , "Generate id : " );
        textPanel.margins = [ 5 , 10 , 5 , 0 ];
        textPanel.alignChildren = "fill" ;
        textPanel.spacing = 0 ;
        textPanel.preferredSize = [ 180 , -1 ];
            var rimIdOptns = textPanel.add( "checkbox" , undefined , " - for the Rims." );
            var gradientIdOptns = textPanel.add( "checkbox" , undefined , " - for the Gradients." );
            var castShadowIdOptns = textPanel.add( "checkbox" , undefined , " - for the Cast Shadows." );
        var btnsRow = CTboxOptnsDlg.add( "group" );
        btnsRow.orientation = "row" ;
        btnsRow.alignChildren = "center" ;
        btnsRow.spacing = 0 ;
        var btnSize = [ 60 , 20 ];
            var btnA = btnsRow.add( "button" , undefined , "Ok" );
            btnA.size = btnSize ;
            var btnB = btnsRow.add( "button" , undefined , "Default" );
            btnB.size = btnSize ;
            var btnC = btnsRow.add( "button" , undefined , "Cancel" );
            btnC.size = btnSize ;
    //Updating the UI with saved values.
    var savedRimIdOptns = JSON.parse( CTgetSavedString( "CTboxSave" , "RimLightId" ) );
    if( savedRimIdOptns == null ){ savedRimIdOptns = true };
    rimIdOptns.value = savedRimIdOptns ;
    var savedGradientIdOptns = JSON.parse( CTgetSavedString( "CTboxSave" , "GradientId" ) );
    if( savedGradientIdOptns == null ){ savedGradientIdOptns = true };
    gradientIdOptns.value = savedGradientIdOptns ;
    var savedCastShadowIdOptns = JSON.parse( CTgetSavedString( "CTboxSave" , "CastShadowId" ) );
    if( savedCastShadowIdOptns == null ){ savedCastShadowIdOptns = true };
    castShadowIdOptns.value = savedCastShadowIdOptns ;
    //UI Events.
    btnA.onClick = function(){ CTsaveString( "CTboxSave" , "RimLightId" , JSON.stringify( rimIdOptns.value ) ); CTsaveString( "CTboxSave" , "GradientId" , JSON.stringify( gradientIdOptns.value ) ); CTsaveString( "CTboxSave" , "CastShadowId" , JSON.stringify( castShadowIdOptns.value ) ); CTboxOptnsDlg.close(); }
    btnB.onClick = function(){ rimIdOptns.value = true ; gradientIdOptns.value = true ; castShadowIdOptns.value = true };
    //Showing UI.
    CTboxOptnsDlg.show();

}