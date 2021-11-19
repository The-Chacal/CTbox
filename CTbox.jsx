//========== Script Launch ==========
$.localize = true;
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
    //@include "CTboxElements/Layer/CleanLayer.jsx";
    //@include "CTboxElements/Layer/CopyMarker.jsx";
    //@include "CTboxElements/Layer/CreateCastShadow.jsx";
    //@include "CTboxElements/Layer/CreateMarkersForKeys.jsx";
    //@include "CTboxElements/Layer/DepthDisplacement.jsx";
    //@include "CTboxElements/Layer/GetLayerBottom.jsx";
    //@include "CTboxElements/Misc/CollapseTransformationManager.jsx";
    //@include "CTboxElements/Misc/EditCompDuration.jsx";
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
    
    var CTboxVersion = "CTbox v1.2.2"//x.y.z - x > major change | y > addition of a fonctionnality | z > debug.
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
            B0Btn01.text = { en: "Exp" , fr: "Exp" };
            B0Btn01.helpTip = { en: "Expressions Panel" , fr: "Onglet Expressions" };
            B0Btn01.size = [ 25 , 25 ];
            var B0Btn02 = Block0.add( "iconButton" );
            B0Btn02.text = { en: "Lay" , fr: "Cal" };
            B0Btn02.helpTip = { en: "Layer Panel" , fr: "Onglet Calque" };
            B0Btn02.size = [ 25 , 25 ];
            var B0Btn03 = Block0.add( "iconButton" );
            B0Btn03.text = { en: "Mis" , fr: "Div" };
            B0Btn03.helpTip = { en: "Miscellaneous Panel", fr: "Onglet Divers" };
            B0Btn03.size = [ 25 , 25 ];
        //Creating the Panels Block.
        var panelsBlock = globalGroup.add( "group" );
        panelsBlock.orientation = "Stack" ;
        panelsBlock.alignChildren = [ "center" , "top" ];
        var btnsSize = [ 75 ,25 ];
            var Block01 = panelsBlock.add( "panel" , undefined , "Expressions :" );
            Block01.margins = [ 5 , 10 , 5 , 5 ] ;
            Block01.spacing = 2 ;
                var B1Btn01 = Block01.add( "button" , undefined , { en: "Fix Exp" , fr: "Cor. Exp." } );
                B1Btn01.helpTip = { en: "   Allow to modify the expressions of layers or properties" , fr: "   Permet de modifier le texte des expressions du calque ou propriété selectionné." } ;
                B1Btn01.size = btnsSize ;
                var B1Btn02 = Block01.add( "button" , undefined , "Psz. Pro." );
                B1Btn02.helpTip = { en: "   Posterize a property and add a Slider Effect to set the step" , fr : "   Posterize la propriété selectionnée et ajoute un paramètre glissière pour régler le pas." } ;
                B1Btn02.size = btnsSize ;
                var B1Btn03 = Block01.add( "button" , undefined , "Mark. Accum." );
                B1Btn03.helpTip = { en: "   Add a variable to the expression of the selected properties that increase passing each marker on a layer." , fr: "   Crée une variable dans l'expression de la propriété selectionnée qui s'incrémente en passant les marqueurs présents sur le calque." } ;
                B1Btn03.size = btnsSize ;
                var B1Btn04 = Block01.add( "button" , undefined , "Mark. Anim." );
                B1Btn04.helpTip = { en: "   Freeze the animation of a property until the next marker." , fr: "   Fait évoluer l'animation de la propriété séléctionnée qu'au passage des marqueurs présents sur le calque." } ;
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
            var Block02 = panelsBlock.add( "panel" , undefined , { en: "Layer :" , fr: "Calque :" } );
            Block02.margins = [ 5 , 10 , 5 , 5 ] ;
            Block02.spacing = 2 ;
            Block02.visible = false ;
                var B2Btn01Block = Block02.add( "group" );
                B2Btn01Block.orientation = "row" ;
                B2Btn01Block.spacing = 0 ;
                    var B2Btn01 = B2Btn01Block.add( "button" , undefined , { en: "Loc. Bot." , fr: "Def. Bas" } );
                    B2Btn01.helpTip = { en: "   Locates the Content lowest point in the layer, for the length of the active layer.\n   Adds a point Effect to the layer." , fr: "   Définit le point le plus bas du contenu d'un calque sur la durée de ce dernier.\n   Ajoute un paramètre Point au calque." } ;
                    B2Btn01.size = btnsSize - [ 15 , 0 ] ;
                    var B2Btn01optns = B2Btn01Block.add( "button" , undefined , "Ω" );
                    B2Btn01optns.helpTip = "Get lowest Layer Point options" ;
                    B2Btn01optns.size = [ 15 , btnsSize[1] ] ;
                var B2Btn02 = Block02.add( "button" , undefined , "Det. Anim." );
                B2Btn02.helpTip = { en: "   Adds a Marker on the layer if it \"moves\"." , fr: "   Ajoute un marqueur sur le calque quand l'animation evolue." } ;
                B2Btn02.size = btnsSize ;
                var B2Btn03 = Block02.add( "button" , undefined , { en: "Add Grad." , fr: "Aj. Degradé" } );
                B2Btn03.helpTip = { en: "   Creates a Gradient in Multiply Mode." , fr: "   Crée un dégradé en mode Produit." } ;
                B2Btn03.size = btnsSize ;
                var B2Btn04Block = Block02.add( "Group" );
                B2Btn04Block.orientation = "row" ;
                B2Btn04Block.spacing = 0 ;
                    var B2Btn04a = B2Btn04Block.add( "button" , undefined , { en: "Add Rim" , fr : "Aj. Rim" } );
                    B2Btn04a.helpTip = { en: "   Creates an outside Rim Light in Overlay Mode." , fr: "   Crée une Rim Light externe en mode Incrustation." } ;
                    B2Btn04a.size = [ btnsSize[0] / 2 , btnsSize[1] ];
                    var B2Btn04b = B2Btn04Block.add( "button" , undefined , { en: "Add Rim" , fr : "Aj. Rim" } );
                    B2Btn04b.helpTip = { en: "   Creates an inside Rim Light in Multiply Mode." , fr: "   Crée une Rim Light interne en mode Produit." } ;
                    B2Btn04b.size = [ btnsSize[0] / 2 , btnsSize[1] ];
                var B2Btn05 = Block02.add( "button" , undefined , { en: "Gro. Sha." , fr: "Omb. Sol" } );
                B2Btn05.helpTip = { en: "   Creates a Shadow Layer of the selected layer." , fr: "   Crée une ombre au sol du calque selectionné." } ;
                B2Btn05.size = btnsSize ;
                var B2Btn06 = Block02.add( "button" , undefined , { en: "Cast Sha." , fr: "Omb. Sil" } );
                B2Btn06.helpTip = { en: "   Creates a Silhouette Shadow Layer of the selected layer." , fr: "   Crée une ombre au sol à partir de la silhouette du calque selectionné." } ;
                B2Btn06.size = btnsSize ;
                var B2Btn07 = Block02.add( "button" , undefined , "Key to Mark." );
                B2Btn07.helpTip = { en: "   Adds markers for each animation key on the layer." , fr: "   Ajoute des Marqueurs pour chaque clé d'animation présente sur le calque." } ;
                B2Btn07.size = btnsSize ;
                var B2Btn08 = Block02.add( "button" , undefined , "Cop. Mark." );
                B2Btn08.helpTip = { en: "   Copies the Markers from one layer and pastes it on the selected others." , fr : "   Copie les Marqueurs du calque selectionné sur d'autres." } ;
                B2Btn08.size = btnsSize ;
                var B2Btn09 = Block02.add( "button" , undefined , { en: "Mov. Dep." , fr: "Dep. Prof" } );
                B2Btn09.helpTip = { en: "   Moves the layer to the depth wanted" , fr: "   Déplace le calque selectionné à la profondeur indiquée." } ;
                B2Btn09.size = btnsSize ;
                var B2Btn10 = Block02.add( "button" , undefined , "Clean Layer" );
                B2Btn10.helpTip = { en: "   Deletes selected properties on the selected layer." , fr: "   Supprime les priopriétés choisies du calques selectionné." } ;
                B2Btn10.size = btnsSize ;
            var Block03 = panelsBlock.add( "panel" , undefined , { en: "Misc. :" , fr: "Divers :" } );
            Block03.margins = [ 5 , 10 , 5 , 5 ] ;
            Block03.spacing = 2 ;
            Block03.visible = false ;
                var B3Btn01 = Block03.add( "button" , undefined , "Ext. Comp." );
                B3Btn01.helpTip = { en: "   Change the lenght of a comp and its elements to the duration wanted." , fr: "   Mets la composition et tous ses composants à la durée souhaitée." } ;
                B3Btn01.size = btnsSize ;
                var B3Btn02 = Block03.add( "button" , undefined , { en: "Col. Comp." , fr: "Rast. Comp." } );
                B3Btn02.helpTip = { en: "Rasteurize the selected Composition and its elements.\n   Risky move to my opinion!" , fr: "   Rasteurise la composition et tous ses sous-compositions.\n   Pour gens ayant le goût du risque!"} ;
                B3Btn02.size = btnsSize ;
                var B3Btn03 = Block03.add( "button" , undefined , "" );
                B3Btn03.helpTip = "" ;
                B3Btn03.size = btnsSize ;
                B3Btn03.visible = false ;
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
                var B3Btn10 = Block03.add( "button" , undefined , "MàJ" );
                B3Btn10.helpTip = "Mise à Jour du Script" ;
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
                BXBtn01.size = [ btnsSize[0] / 2 , btnsSize[1] ];
                var BXBtn02 = versionBlock.add( "button" , undefined , "v0.X" );
                BXBtn02.size = [ btnsSize[0] / 2 , btnsSize[1] ];
            var CTboxVersionBlock = BlockXX.add( "group" );
            CTboxVersionBlock.margins = [ 1 , 0 , 1 , 0 ];
            CTboxVersionBlock.alignment = "right";
            CTboxVersionBlock.spacing = 2 ;
            CTboxVersionBlock.add( "staticText" , undefined , CTboxVersion );
                var BXBtn03 = CTboxVersionBlock.add( "iconButton" , undefined , new File( Folder.appPackage.fsName + "/PNG/SP_ArrowNext_Sm_N_D.png") );
                BXBtn03.size = [ 15 , 15 ];
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
    B2Btn02.onClick = animDetectionDlg ;
    B2Btn03.onClick = applyGradient ;
    B2Btn04a.onClick = function(){ applyRim( true ); };
    B2Btn04b.onClick = function(){ applyRim( false ); };
    B2Btn05.onClick = addShadowLayer ;
    B2Btn06.onClick = createCastShadow ;
    B2Btn07.onClick = createMarkersForKeysChoice ;
    B2Btn08.onClick = copyMarkerChoice ;
    B2Btn09.onClick = depthChoice ;
    B2Btn10.onClick = function(){ cleanLayerChoiceDialog( true ) };
    //UI events for Bloc03.
    B3Btn01.onClick = choiceCompDuration ;
    B3Btn02.onClick = collapseTransformationManager ;
    B3Btn10.onClick = updateCTbox ;
    //UI events for Versionning Block.
    BXBtn01.onClick = function(){ CTversioning( "X.0" ) };
    BXBtn02.onClick = function(){ CTversioning( "0.X" ) };
    BXBtn03.onClick = function(){ CTexpandNotepad( CTpanel ) };
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
        var BugPanel = Param1.add( "panel" , undefined , { en: "Small Problem : " , fr: "Petit Problème :" } );
        BugPanel.add( "StaticText" , undefined , { en: "You need to authorize the scripts to write files and access network in the Preferences.\n\n   You need to close this, make the change, then relaunch the Script." , fr: "   Vous devez autoriser les scripts à écrire des fichiers et accéder au réseau dans les préférences.\n\n   Fermez, modifiez puis relancez ce script." } , { multiline: true } );
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
        var notepad = Dlg.add( "panel" , undefined , { en: "Notepad" , fr: "Bloc-Note : " } );
        notepad.alignment = "Top" ;
        notepad.margins = [ 5 , 10 , 5 , 5 ];
            var notepadText = notepad.add( "EditText" , undefined , { en: "You can write or thoughts here..." , fr: "   Note ici tes pensées..." } , { multiline: true , scrollable: true } );
            var SavedText = CTgetSavedString( "CTboxSave" , "Notepad" );
            if( SavedText != null ){
                notepadText.text = SavedText ;
            }
        notepadText.preferredSize = [ 200 , Dlg.children[0].size[1] - 25 ];
        notepadText.onActivate = function(){ if( notepadText.text == { en : "You can write or thoughts here..." , fr: "   Note ici tes pensées..." } ){ notepadText.text = "" ; } };
        notepadText.onChange = function(){ CTsaveString( "CTboxSave" , "Notepad" , notepadText.text ) };
    } else {
        Dlg.remove( Dlg.children[1] );
    }
    Dlg.layout.layout(true)
    
}