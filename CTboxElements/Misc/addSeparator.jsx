//****************************************//
//  Add Separator v1.0
//****************************************//

//  Functions adding a separator layer in your active comp.
/**
 * Changes the collapse transformation status.
 */
function addSeparator(){

    //Saving the modifiers keys statuses.
    var modifiers = CTmodifiersStatuses() ;
    //Saving the selected layers.
    var layerSelection = CTcheckSelectedLayers();
    //Creating an empty variable.
    var separator = null ;
    //Starting undoGroup.
    app.beginUndoGroup("Add Separator.")
    //Doing the job...
    if( layerSelection.length > 0 ){
        //If one or more layers are selected.
        if( !modifiers.ctrlState && !modifiers.majState && !modifiers.altState ){
            //No Modifier = Add a Separator on top of the selected Layers.
            //Finding the highest layer in the pile.
            var highestLayer = layerSelection[0];
            if( layerSelection.length > 1 ){
                highestLayer = sortLayersByIndex( layerSelection )[0];
            }
            //Adding the Separator.
            separator = createShape();
            separator.name = "----------------------------------------";
            separator.moveBefore( highestLayer );
        }else if( modifiers.ctrlState && !modifiers.majState && !modifiers.altState ){
            //Ctrl = Add a named Separator on top of the selected Layers.
            if( layerSelection.length < 2 ){
                separator = createShape();
                separator.name = layerSelection[0].name + " - Controller";
                separator.moveBefore( layerSelection[0] );
            } else {
                //Finding the highest layer in the pile.
                var highestLayer = sortLayersByIndex( layerSelection )[0];
                //Adding the Separator.
                separator = createShape();
                separator.name = "---------- Controller ----------";
                separator.moveBefore( highestLayer );
            }
        }else if( !modifiers.ctrlState && modifiers.majState && !modifiers.altState ){
            //Shift = Add a Separator on top of the selected Layers and parent the selected Layers to it.
            //Finding the highest layer in the pile.
            var highestLayer = layerSelection[0];
            if( layerSelection.length > 1 ){
                highestLayer = sortLayersByIndex( layerSelection )[0];
            }
            //Adding the Separator.
            separator = createShape();
            separator.name = "---------- Controller ----------";
            separator.moveBefore( highestLayer );
            //Moving the separator to the average position of the selected Layers.
            separator.property( "ADBE Transform Group" ).property( "ADBE Position" ).setValue( getAveragePosition( layerSelection ) );
            //Parenting the selected Layers to the Separator.
            for( var i = 0 ; i < layerSelection.length ; i++ ){
                if( layerSelection[i].parent == null ){
                    layerSelection[i].parent = separator ;
                }
            }
        }else if( !modifiers.ctrlState && !modifiers.majState && modifiers.altState ){
            //Alt = Add a Separator for each selected Layer.
            for( var i = 0 ; i < layerSelection.length ; i++ ){
                //Adding the Separator.
                separator = createShape();
                separator.name = "----------------------------------------";
                separator.moveBefore( layerSelection[i] );
            }
        }else if( !modifiers.ctrlState && modifiers.majState && modifiers.altState ){
            //Alt + Shift = Add a Separator for each selected Layer and parent the layer to it.
            for( var i = 0 ; i < layerSelection.length ; i++ ){
                //Adding the Separator.
                separator = createShape();
                separator.name = "---------- Controller ----------";
                separator.moveBefore( layerSelection[i] );
                //Moving the separator to the average position of the selected Layers.
                separator.property( "ADBE Transform Group" ).property( "ADBE Position" ).setValue( getAveragePosition( [ layerSelection[i] ] ) );
                //Parenting the selected Layers to their Separator.
                if( layerSelection[i].parent == null ){ layerSelection[i].parent = separator ; }
            }
        }else if( modifiers.ctrlState && modifiers.majState && modifiers.altState ){
            //Alt + Shift + Ctrl = Add a named Separator for each selected Layer and parent the layer to it.
            for( var i = 0 ; i < layerSelection.length ; i++ ){
                separator = createShape();
                separator.property( "ADBE Transform Group" ).property( "ADBE Position" ).setValue( getAveragePosition( [ layerSelection[i] ] ) );
                separator.name = layerSelection[i].name + " - Controller";
                separator.moveBefore( layerSelection[i] );
                if( layerSelection[i].parent == null ){ layerSelection[i].parent = separator ; }
            }
        }
    } else {
        //If there is no layer selection = Add a separator on top of the composition.
        separator = createShape();
        separator.name = "----------------------------------------";
    }
    //Closing the UndoGroup.
    app.endUndoGroup();
}
/**
 * Create the Shape layer for Separator
 * @returns { object } Shape Layer created.
 */
function createShape(){

    //Creating the Shape Layer.
    var shapeLayer = app.project.activeItem.layers.addShape();
    //Moving the Separator out of screen.
    shapeLayer.property( "ADBE Transform Group" ).property( "ADBE Position" ).setValue( [ -50 , -50 ] );
    shapeLayer.guideLayer = true ;
    shapeLayer.label = 0 ;
    //Creating the icon/
    var iconGroup = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    iconGroup.name = "Skull" ;
    var iconContent = iconGroup.property("ADBE Vectors Group");
    var shape01 = iconContent.addProperty("ADBE Vector Shape - Group");
    var skullShape = new Shape();
    skullShape.vertices = [[1.55055236816406,-23.9894409179688],[-19.186279296875,-8.39686584472656],[-14.1187896728516,13.9894409179688],[-6.35812377929688,13.0339813232422],[-6.4609375,17.8054046630859],[-4.10159301757812,18.6315002441406],[-2.60211181640625,15.8726348876953],[-2.46903991699219,18.9436492919922],[0.18310546875,19.9777374267578],[1.17318725585938,17.7432403564453],[2.16328430175781,19.9098663330078],[4.28150939941406,19.5071563720703],[4.24623107910156,16.6111907958984],[6.02276611328125,18.746826171875],[7.87411499023438,17.9747314453125],[7.74383544921875,13.1176605224609],[13.6310272216797,14.2018890380859],[20.7663421630859,-8.31101989746094]];
    skullShape.inTangents = [[12.4916229248047,0],[0.86830139160156,-8.15628051757812],[-6.75621032714844,1.19805908203125],[-1.98977661132812,-1.05450439453125],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[-1.47941589355469,1.29710388183594],[-3.26185607910156,-0.82843017578125],[0.37132263183594,11.4245300292969]];
    skullShape.outTangents = [[-12.4916076660156,0],[-1.14085388183594,10.7165679931641],[4.30224609375,-0.76292419433594],[1.23312377929688,0.65351867675781],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0.00001525878906,0],[1.63116455078125,-1.43016052246094],[8.55647277832031,2.17311096191406],[-0.27812194824219,-8.55706787109375]];
    skullShape.closed = true ;
    shape01.property('ADBE Vector Shape').setValue( skullShape );
    var shape02 = iconContent.addProperty("ADBE Vector Shape - Group");
    var rightEyeShape = new Shape();
    rightEyeShape.vertices = [[-14.9605407714844,-3.51991271972656],[-2.51734924316406,-3.36589050292969],[-2.77360534667969,4.28157043457031],[-14.5351715087891,6.94718933105469]];
    rightEyeShape.inTangents = [[-2.08033752441406,1.908935546875],[-1.76005554199219,-1.72726440429688],[1.59956359863281,-2.30789184570312],[3.02996826171875,1.66633605957031]];
    rightEyeShape.outTangents = [[2.36679077148438,-2.17179870605469],[1.23951721191406,1.21641540527344],[-1.22926330566406,1.77360534667969],[-3.29341125488281,-1.81120300292969]];
    rightEyeShape.closed = true ;
    shape02.property('ADBE Vector Shape').setValue( rightEyeShape );
    var shape03 = iconContent.addProperty("ADBE Vector Shape - Group");
    var leftEyeShape = new Shape();
    leftEyeShape.vertices = [[15.2706909179688,-3.71211242675781],[15.2747497558594,7.691650390625],[3.87040710449219,4.67555236816406],[3.36582946777344,-3.46060180664062]];
    leftEyeShape.inTangents = [[-3.12396240234375,-2.34742736816406],[3.60025024414062,-1.12083435058594],[1.68862915039062,1.92823791503906],[-1.43533325195312,1.67672729492188]];
    leftEyeShape.outTangents = [[3.12396240234375,2.34742736816406],[-2.69346618652344,0.83853149414062],[-1.68864440917969,-1.92823791503906],[1.43534851074219,-1.67672729492188]];
    leftEyeShape.closed = true ;
    shape03.property('ADBE Vector Shape').setValue( leftEyeShape );
    var shape04 = iconContent.addProperty("ADBE Vector Shape - Group");
    var noseShape = new Shape();
    noseShape.vertices = [[0.24085998535156,4.67805480957031],[0.32530212402344,9.70823669433594]];
    noseShape.inTangents = [[-2.2796630859375,0.75453186035156],[3.12396240234375,3.26962280273438]];
    noseShape.outTangents = [[3.63055419921875,2.17976379394531],[-3.7994384765625,3.77264404296875]];
    noseShape.closed = true ;
    shape04.property('ADBE Vector Shape').setValue( noseShape );
    var fill = iconContent.addProperty("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue( [ 1 , Math.min( Math.random() , .6 ) , Math.min( Math.random() , .6 ) ] );
    fill.property( "ADBE Vector Fill Rule").setValue( 2 );
    return shapeLayer ;

}
/**
 * Sort an array of layers according to their index
 * @param { array } layers Array containing the layers to sort.
 • @returns { array } Entered Array sorted by index number.
 */
function sortLayersByIndex( layers ){

    var sortedLayers = layers.sort( function( a , b ){ return parseFloat( a.index ) - parseFloat( b.index ) } );
    return sortedLayers ;

}
/**
 * Get the average position of a group of layers
 * @param { array } layers Array containing the layers to get the average position from.
 * @returns { array } The average position value for the selected layers.
 */
function getAveragePosition( layers ){
    
    var averagePosition = [ 0 , 0 , 0 ];
    for( var i = 0 ; i < layers.length ; i++ ){
        //temporarily removing the parenting to get the actual position of the Layer.
        var hasParent = false;
        if( layers[i].parent != null ){
            hasParent = true ;
            var savedParent = layers[i].parent ;
            layers[i].parent = null ;
        }
        //Adding the Layer position.
        averagePosition += layers[i].property( "ADBE Transform Group" ).property( "ADBE Position" ).value ;
        //Retoring the parenting.
        if( hasParent ){ layers[i].parent = savedParent ; }
    }
    //Getting the average position.
    averagePosition = averagePosition / layers.length ;
    return averagePosition ;

}