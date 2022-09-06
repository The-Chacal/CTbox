//****************************************//
//  Update Expressions v1.0
//****************************************//

//  Functions allowing you to modify expressions in properties or layers selected.
/**
 * Creates the UI.
 */
function updateExpChoice(){
    
    var MAJexpDlg = new Window( "palette" , "Expression Modifier" );
    MAJexpDlg.global = MAJexpDlg.add( "Panel" , undefined , "Upd. Expression : " );
    MAJexpDlg.global.alignChildren = "Fill" ;
        //Creating a first Row to define the text to replace.
        MAJexpDlg.row1 = MAJexpDlg.global.add( "Group" );
        MAJexpDlg.row1.orientation = "row" ;
        MAJexpDlg.row1.alignchildren = "Left" ;
            var row1Text = MAJexpDlg.row1.add( "StaticText" , undefined , "Text to Replace : " );
            row1Text.characters = 11 ;
            var textToReplace = MAJexpDlg.row1.add( "EditText{ justify : 'right' , characters : 15 , properties : { enabled : true } }" );
            textToReplace.text = "Text to Replace" ;
        //Creating a second Row to define the text to replace with.
        MAJexpDlg.row2 = MAJexpDlg.global.add( "Group" );
        MAJexpDlg.row2.orientation = "row" ;
        MAJexpDlg.row2.alignchildren = "Left" ;
            var row2Text = MAJexpDlg.row2.add( "StaticText" , undefined , "Replace by : " );
            row2Text.characters = 11 ;
            var replacementText = MAJexpDlg.row2.add( "EditText{ justify : 'right' , characters : 15 , properties : { enabled : true } }" );
            replacementText.text = 'Text to Use' ;
        //Creating a third Row to choose if the script will work trough layers or properties.
        MAJexpDlg.row3 = MAJexpDlg.global.add( "Group" );
        MAJexpDlg.row3.orientation = "row" ;
        MAJexpDlg.row3.alignment = "center" ;
            var onLayers = MAJexpDlg.row3.add( "radiobutton" , undefined , " - by Layer." );
            onLayers.characters = 10 ;
            onLayers.value = true ;
            var onProps = MAJexpDlg.row3.add( "radiobutton" , undefined , " - by Properties." );
            onProps.characters = 10 ;
        //Creating a fourth Row for the Buttons.
        MAJexpDlg.Btns = MAJexpDlg.global.add( "Group" )
        MAJexpDlg.Btns.orientation = "row" ;
        MAJexpDlg.Btns.alignment = "Center" ;
            var replace = MAJexpDlg.Btns.add( "Button" , undefined , "Replace" );
            var cancel = MAJexpDlg.Btns.add( "Button" , undefined , "Cancel" );
    //UI Events.
    textToReplace.onActivate = function(){ if( textToReplace.text == "Text to Replace" ){ textToReplace.text = "" ; } } ;
    replacementText.onActivate = function(){ if( replacementText.text == "Text to Use" ){ replacementText.text = "" ; } } ;
    replace.onClick = function(){ updateExp( textToReplace.text , replacementText.text , onLayers.value ); } ;
    cancel.onClick = function(){ MAJexpDlg.close() } ;
    //Showing UI
    MAJexpDlg.show();

}
/**
 * Checks that the inputs are right before launching the correction.
 * @param { string } textA Text to Replace.
 * @param { string } textB Text to Use.
 * @param { boolean } worksOnLayers Works on Layers or Properties.
 * @param { boolean } [ showEndAlert = true] Does the script alerts when it's done.
 * @param { boolean } [ createUndoGroup = true ] Does the script creates an UndoGroup.
 */
function updateExp( textA , textB , worksOnLayers , showEndAlert , createUndoGroup ){
    if( typeof showEndAlert === "undefined" ){ showEndAlert = true ; }
    if( typeof createUndoGroup === "undefined" ){ createUndoGroup = true ; }
    
    //Checking if the inputs are usable.
    if( textA == "Text to Replace" || textA == "" ){
        CTalertDlg( "Error : " , "   You did not tell me what to replace" );
        return ;
    } else if( textB ==  "Text to Use" ){
        CTalertDlg( "Error : " , "   You did not tell me what to replace with." );
        return ;
    }
    //Starting the actual work.
    if( worksOnLayers ){
        var layersToUpdate = CTcheckSelectedLayers();
        if( layersToUpdate.length > 0 ){
            for( var i = 0 ; i < layersToUpdate.length ; i++ ){
                //Opening the UndoGroup.
                if( createUndoGroup ){ app.beginUndoGroup( "Expression Modification" , "Modification de l'Expression" ); }
                //Correcting the Expressions.
                applyExpUpdate( layersToUpdate[i] , textA , textB ) ;
                //Closing the UndoGroup.
                if( createUndoGroup ){ app.endUndoGroup(); }
            }
            if( showEndAlert ){
                CTalertDlg( "I'm Done" , "I've finished updating your expressions" );
            }
        }
    } else {
        var propertiesToTreat = CTcheckSelectedProperties();
        if( propertiesToTreat != null ){
            for( var i = 0 ; i < propertiesToTreat.length ; i ++ ){
                var currentProperty = CTgetProperty( propertiesToTreat[i] );
                if( currentProperty.canSetExpression ){
                    //Opening the UndoGroup.
                    if( createUndoGroup ){ app.beginUndoGroup( "Expression Modification" ); }
                    //Correcting the Expressions.
                    var reg = new RegExp( textA.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'), "g");//"$&", in the regExp, means "the String found". So, in our case, it means one of the special characters in the list will be replaced by himself preceeded by a "\".
                    currentProperty.expression = currentProperty.expression.replace( reg , textB );
                    //Closing the UndoGroup.
                    if( createUndoGroup ){ app.endUndoGroup(); }
                }
            }
            if( showEndAlert ){
                CTalertDlg( "I'm Done" , "I've finished updating your expressions" );
            }
        }
    }
    
}
/**Parses recursively the properties of a layer to check all the expressions.
 * @param { object } item Property or Property Base Object.
 * @param { string } textA Text to Replace.
 * @param { string } textB Text to Use.
 */
function applyExpUpdate( item , textA , textB ){
    
    for( var i = 1 ;  i <= item.numProperties ; i++ ){   
        if( item.property(i).numProperties != undefined ){
            applyExpUpdate( item.property(i) , textA , textB );
        } else {
            if( item.property(i).canSetExpression && item.property(i).expression != "" ){
                var reg = new RegExp( textA.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'), "g");//"$&", in the regExp, means "the String found". So, in our case, it means one of the special characters in the list will be replaced by himself preceeded by a "\".
                item.property(i).expression = item.property(i).expression.replace( reg , textB );
            }
        }
    }

}