//****************************************//
//  Stabilizer Creator
//****************************************//

/**
 * Function adding a null to stabilize a 2D footage from which a 3D camera has been created.
 */
function addStabilizer(){

    //Saving the selected layers.
    var layerSelection = CTcheckSelectedLayers();
    //Starting undoGroup.
    app.beginUndoGroup("Add Stabilizer.")
    //If one layer is selected.
    if( layerSelection.length > 0 && layerSelection.length < 2 && app.project.activeItem.activeCamera != null ){
        var threeDnull = layerSelection[0] ;
        var camera = app.project.activeItem.activeCamera ;
        var activeComp = app.project.activeItem ;
        var stabilizer = activeComp.layers.addNull();
        stabilizer.moveAfter( threeDnull );
        stabilizer.name = "Stabilizer"
        var ptAeffect = stabilizer.property( "ADBE Effect Parade" ).addProperty( "ADBE Point Control" );
        ptAeffect.name = "Point A";
        ptAeffect.property(1).expression = "//---- Links ----\
var L = thisComp.layer(\"" + threeDnull.name + "\");\
\
//---- Script ----\
var result = L.toComp( [ 0 , 0 ] );\
//---- Result ----\
result";
        var ptBeffect = stabilizer.property( "ADBE Effect Parade" ).addProperty( "ADBE Point Control" );
        ptBeffect.name = "Point B";
        ptBeffect.property(1).expression = "//---- Links ----\
var L = thisComp.layer(\"" + threeDnull.name + "\");\
\
//---- Script ----\
var result = L.toComp( [ 1000 , 0 ] );\
//---- Result ----\
result";
        //Adding the expression to the Position of the Stabilizer.
        stabilizer.property(6).property(2).expression = "//---- Links ----\
var cameraPos = thisComp.layer(\"" + camera.name + "\")(2)(2);\
var pos = effect( \"Point A\" )(1);\
\
//---- Script ----\
var t0 = cameraPos.key(1).time ;\
var pos0 = pos.valueAtTime( t0 );\
var delta = pos0 - pos ;\
\
//---- Result ----\
pos0 + delta";
        //Adding the expression to the Scale of the Stabilizer.
        stabilizer.property(6).property(6).expression = "//---- Links ----\
var cameraPos = thisComp.layer(\"" + camera.name + "\")(2)(2);\
var Apos = effect( \"Point A\" )(1);\
var Bpos = effect( \"Point B\" )(1);\
\
//---- Script ----\
var t0 = cameraPos.key(1).time ;\
var Apos0 = Apos.valueAtTime( t0 );\
var Bpos0 = Bpos.valueAtTime( t0 );\
var dist0 = length( Apos0 , Bpos0 );\
var dist = length( Apos , Bpos );\
var delta = 1 / ( dist / dist0 );\
\
//---- Result ----\
value * delta"
    }

}