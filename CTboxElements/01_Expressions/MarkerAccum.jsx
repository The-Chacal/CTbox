//****************************************//
//  Marker Accumulator Creator
//****************************************//

/**
 * Adds an expression to a property containing a variable growing for each marker you have on the layer.
 * Creates a Slider to set the amplitude.
 */
function markerAccum(){
    
    var propertiesToTreat = CTcheckSelectedProperties();
    if( propertiesToTreat != null ){
        for( var i = 0 ; i < propertiesToTreat.length ; i ++ ){
            var currentProperty = CTgetProperty( propertiesToTreat[i] );
            if( currentProperty.canSetExpression ){
                //Opening the UndoGroup.
                app.beginUndoGroup( "Marker Accum" );
                //Adding a Slider setting the amplitude of the increment for the variable, if it does not already exists.
                var propertyParentLayer = propertiesToTreat[i][ propertiesToTreat[i].length - 1 ];
                var markerAccumSlider = null ;
                try{ markerAccumSlider = propertyParentLayer.effect( currentProperty.name + " - MarkAccumAmp" ) }catch(e){};
                if( markerAccumSlider == null ){
                    markerAccumSlider = propertyParentLayer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
                    currentProperty = CTgetProperty( propertiesToTreat[i] );
                    markerAccumSlider.name = currentProperty.name + " - MarkAccumAmp"
                    markerAccumSlider.property(1).setValue( 50 );
                }
                //Updating the Expression adding our variable.
                var newExpression = "//Marker Accumulator Expression.\
                //---------- Links ----------\
var amp = effect(\"Rotation - MarkAccumAmp\")(1);\
\
//---------- Code ----------\
var result = value ;\
if( thisLayer.marker.numKeys > 0 )\
{\
    var markerNb = 0 ;\
    if( time < thisLayer.marker.nearestKey( time ).time && thisLayer.marker.nearestKey( time ).index != 1 )\
    {\
        markerNb = thisLayer.marker.nearestKey( time ).index - 2 ;\
    } else {\
        markerNb = thisLayer.marker.nearestKey( time ).index - 1 ;\
    }\
    //Final Variable to be used where you want it.\
    result = markerNb * amp ;\
}\
\
//---------- Result----------\
result";
                currentProperty.expression = newExpression ;
                //Closing the UndoGroup.
                app.endUndoGroup() ;
            }
        }
        CTalertDlg( "I'm Done" , "   I've finished modifying your expressions" );
    }
    
}