//****************************************//
//  Paint Effect Driver Applier
//****************************************//

//  Functions adding a separator layer in your active comp.
/**
 * Changes the collapse transformation status.
 */
function addPaintDriver(){

    //Saving the selected layers.
    var layerSelection = CTcheckSelectedLayers();
    //Starting undoGroup.
    app.beginUndoGroup("Add Paint Driver.")
    //Getting the path to the Script on the Computer.
    var scriptFolder = CTgetScriptFolder();
    //If one or more layers are selected.
    if( layerSelection.length > 0 ){
        //Applying the Paint Drive for each selected Layer.
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            var refLayer = layerSelection[i];
            //Naming the layer as base for the Masks.
            refLayer.name = refLayer.name + " - Masks";
            //Creating the needed Layers.
            var cleanLayer = refLayer.duplicate();
            var paintLayer = refLayer.duplicate();
            //Moving the Layers under the ref Layer.
            cleanLayer.moveAfter( refLayer );
            paintLayer.moveAfter( refLayer );
            //Selecting both Layers.
            cleanLayer.selected = true ;
            paintLayer.selected = true ;
            //Cleaning the layers.
            layerCleaner( false , false , true );
            //Renaming the layers
            cleanLayer.name = cleanLayer.name.replace( " - Masks 2" , " - refLayer");
            paintLayer.name = paintLayer.name.replace( " - Masks 3" , " - paintLayer");
            //Changing the label of the Layers. Parsing trough the labels as a loop - "- 16" so it goes back to 1 instead of 0.
            if( cleanLayer.label + 2 <= 16 ){ cleanLayer.label = cleanLayer.label + 2 ; } else { cleanLayer.label = cleanLayer.label + 2 - 16 ;}
            if( paintLayer.label + 1 <= 16 ){ paintLayer.label = paintLayer.label + 1 ; } else { paintLayer.label = paintLayer.label + 1 - 16 ;}
            //Locking the clean Layer.
            cleanLayer.locked = true ;
            cleanLayer.selected = false ;
            for( var j = 1 ; j <= refLayer.property( "ADBE Mask Parade" ).numProperties ; j++){
                paintLayer.selected = true ;
                //Adding the Paint Driver Pseudo Effect.
                paintLayer.applyPreset( new File( scriptFolder.fsName + "/CTboxElements/06_PseudoEffects/PaintDriver - paintLayer v1.ffx" ) );
                //Adjusting the values of the Paint Driver - Masked Layer and Mask Index.
                paintLayer.property( "ADBE Effect Parade" ).property("CTbox - Paint Driver")(2).setValue( refLayer.index );
                paintLayer.property( "ADBE Effect Parade" ).property("CTbox - Paint Driver")(3).setValue( j );
                //Naming the Effects according to the Masks indexes.
                var effectNb = j ;
                if( effectNb < 10 ){ effectNb = "0" + effectNb ;}
                paintLayer.property( "ADBE Effect Parade" ).property("CTbox - Paint Driver").name = "CTbox - Paint Driver " + effectNb ;
                paintLayer.property( "ADBE Effect Parade" ).property("CTbox - Paint").name = "CTbox - Paint " + effectNb ;
                //Updating the Expressions with the new names of the Effects.
                app.project.autoFixExpressions( "CTbox - Paint Driver" , "CTbox - Paint Driver " + effectNb );
                //Retargeting the clone strokes to the CleanLayer.
                for( var k = 2 ; k <= paintLayer.property( "ADBE Effect Parade" ).property("CTbox - Paint " + effectNb )(2).numProperties ; k++ ){
                    paintLayer.property( "ADBE Effect Parade" ).property("CTbox - Paint " + effectNb )(2)(k)(4)(12).setValue( cleanLayer.index );
                }
                //Disabling the "Paint on Transparent" option of the Paint Effect for the second and further Effects added so it let us see the previous ones.
                if( j > 1 ){ paintLayer.property( "ADBE Effect Parade" ).property("CTbox - Paint " + effectNb )(1).setValue( false ); }
                paintLayer.selected = false ;
            }
            //Adding the Set Matte Effect.
            paintLayer.selected = true ;
            paintLayer.applyPreset( new File( scriptFolder.fsName + "/CTboxElements/06_PseudoEffects/PaintDriver - paintLayer - setMatte v1.ffx" ) );
            paintLayer.property( "ADBE Effect Parade" ).property("CTbox - Set Matte")(1).setValue( refLayer.index );
            paintLayer.selected = false ;
            refLayer.selected = true ;
            //Adding the Stroke Pseudo Effect.
            refLayer.applyPreset( new File( scriptFolder.fsName + "/CTboxElements/06_PseudoEffects/PaintDriver - maskLayer v1.ffx" ) );
            refLayer.selected = false ;
            refLayer.enabled = false ;
        }
    }
    //Closing the UndoGroup.
    app.endUndoGroup();

}