//****************************************//
//  Add Separator v1.0
//****************************************//

//  Functions adding a separator layer in your active comp.
/**
 * Changes the collapse transformation status.
 */
function addSeparator(){
    var modifiers = modifiersStatuses() ;
    alert( modifiers.ctrlState + " / " + modifiers.majState + " / " + modifiers.altState );
}