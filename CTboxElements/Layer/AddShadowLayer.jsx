//****************************************//
//   Add Shadow Layer v2.0
//****************************************//

/**
 * Creates an Oval under the selected layer.
 */
function addShadowLayer(){
    
    var layerSelection = CTcheckSelectedLayers();
    if( layerSelection.length > 0 ){
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            //Opening the UndoGroup.
            app.beginUndoGroup( { en : "Creation of cast shadow." , fr: "Création d'ombre au sol."} );
            //Creating the shadow layer.
            var shadowLayer = app.project.activeItem.layers.addSolid( [ 0 , 0 , 0 ] , layerSelection[i].name + " - Shadow" , 500 , 30 , 1 );
            shadowLayer.moveAfter( layerSelection[i] );
            shadowLayer.parent = layerSelection[i] ;
            shadowLayer.label = 8 ;
            shadowLayer.shy = true ;
            shadowLayer.inPoint = layerSelection[i].inPoint ;
            shadowLayer.outPoint = layerSelection[i].outPoint ;
            //Adding the slider controling the size of the mask on the layer.
            var shadowSlider = shadowLayer.property( "ADBE Effect Parade" ).addProperty( "ADBE Slider Control" );
            shadowSlider.name = "CTbox - Shadow - Size";
            shadowSlider.property(1).setValue( 100 );
            //Applying a mask to the layer.
            var shadowMask = shadowLayer.Masks.addProperty( "Mask" );
            shadowMask.name = "MaskForShadow";
            //Adding the expression to be able to resize the shape.
            shadowMask.property(1).expression = "//---------- Links ----------\
var S = effect(\"CTbox - Shadow - Size\")(1)/100;\
//---------- Code ----------\
var W = thisLayer.width ;\
var H = thisLayer.height ;\
var C = [ W / 2 , H / 2 ];\
var Pts = [ [ C[0] , C[1]-H/2*S ] , [ C[0]+W/2*S , C[1] ] , [ C[0] , C[1]+H/2*S ] , [ C[0]-W/2*S , C[1] ] ];\
var inPts = [ [ -W/4*S , 0 ] , [ 0 , -H/2*S ] , [ W/4*S , 0 ] , [ 0 , H/2*S ] ];\
var outPts= [ [ W/4*S , 0 ] , [ 0 , H/2*S ] , [ -W/4*S , 0 ] , [ 0 , -H/2*S ] ];\
//---------- End ----------\
createPath( Pts , inPts , outPts , true )";
            //Adding the horizontal box Blur Effect.
            var horizontalBlur = shadowLayer.property( "ADBE Effect Parade" ).addProperty( "ADBE Box Blur2" );
            horizontalBlur.property(1).setValue( 30 );
            horizontalBlur.property(3).setValue( 2 );
            //Adding the vertical box Blur Effect.
            var verticalBlur = shadowLayer.property( "ADBE Effect Parade" ).addProperty( "ADBE Box Blur2" );
            verticalBlur.property(1).setValue( 3 );
            verticalBlur.property(3).setValue( 3 );
            //Checking if the reference layer has a bottom detected and linking the Shadow to it if so.
            if( layerSelection[i].property( "ADBE Effect Parade" ).property( "CTbox - Content Lowest Point" ) != null ){
                shadowLayer.property( "ADBE Transform Group" ).property( "ADBE Position" ).expression = "comp(\"" + app.project.activeItem.name + "\").layer(\"" + layerSelection[i].name + "\").effect(\"CTbox - Content Lowest Point\")(\"Lowest Point\") + value";
                shadowLayer.property( "ADBE Transform Group" ).property( "ADBE Position" ).setValue( [ 0 , 0 , 0 ] );
            }
            //Unselecting the Shadow Layer.
            shadowLayer.selected = false ;
            //Closing the UndoGroup.
            app.endUndoGroup();

        }
        //Recreating the original layer selection.
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            layerSelection[i].selected = true ;
        }
        CTalertDlg( { en: "I'm Done" , fr: "J'ai Fini" } , { en: "   I've created your Cast Shadows." , fr: "J'ai fini de créer ton ombre au sol." } );
    }
    
}