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
                    markerAccumSlider.name = currentProperty.name + " - MarkAccumAmp" ;
                    markerAccumSlider.property(1).setValue( 50 );
                }
                //Updating the Expression adding our variable.
                var resultValue = "" ;
                if( currentProperty.propertyValueType == PropertyValueType.TwoD || currentProperty.propertyValueType == PropertyValueType.TwoD_SPATIAL ){
                    resultValue = "\n    result = [ result , result ]" ;
                } else if( currentProperty.propertyValueType == PropertyValueType.ThreeD || currentProperty.propertyValueType == PropertyValueType.ThreeD_SPATIAL ){
                    resultValue = "\n    result = [ result , result , result ]" ;
                } else {
                    CTalertDlg( "Alert!" , "   I can't work on this kind of property.\n\n   Maybe you misscliked, maybe I do not know how to do it?!" );
                    return ;
                }
                var newExpression = "//Marker Accumulator Expression.\
//---------- Links ----------\
var amp = effect(\"" + markerAccumSlider.name + "\")(1);\
\
//---------- Code ----------\
var result = value ;\
if( thisLayer.marker.numKeys > 0 )\
{\
	var markerNb = 0 ;\
	var currentMarker = thisLayer.marker.nearestKey( time );\
	if( time < currentMarker.time && currentMarker.index > 1 ){\
		currentMarker = thisLayer.marker.key( currentMarker.index - 1 );\
	}\
	if( time < currentMarker.time ){\
		markerNb = 0 ;\
	} else if ( thisLayer.marker.key(1).time <= inPoint ){\
		markerNb = currentMarker.index - 1 ;\
	} else {\
		markerNb = currentMarker.index ;\
	}\
    result = markerNb * amp ;" + resultValue + "\
}\
\
//---------- Result----------\
result" ;
                currentProperty.expression = newExpression ;
                //Closing the UndoGroup.
                app.endUndoGroup();
            }
        }
        CTalertDlg( "I'm Done" , "   I've finished modifying your expressions" );
    }
    
}