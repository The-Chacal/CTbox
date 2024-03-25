//****************************************//
//  Marker Animation
//****************************************//

/**
 * Creates an expression stepping the animation according to the markers on the layer.
 */
function markerAnimation(){
    
    var propertiesToTreat = CTcheckSelectedProperties();
    if( propertiesToTreat != null ){
        for( var i = 0 ; i < propertiesToTreat.length ; i ++ ){
            var currentProperty = CTgetProperty( propertiesToTreat[i] );
            if( currentProperty.canSetExpression )
            {
                //opening the UndoGroup.
                app.beginUndoGroup( "Marker Anim" );
                //Adding the Expression.
                currentProperty.expression = "//Marker rythmed Animation Expression.\
//---------- Code ----------\
var result = value\
if( thisLayer.marker.numKeys > 0 )\
{\
    var closestMarker = thisLayer.marker.nearestKey( time );\
    if( time < closestMarker.time && closestMarker.index == 1 )\
    {\
        result = valueAtTime( thisLayer.inPoint );\
    } else if( time < closestMarker.time )\
    {\
        result = valueAtTime( thisLayer.marker.key( closestMarker.index - 1).time )\
    } else if( time >= closestMarker.time )\
    {\
        result = valueAtTime( thisLayer.marker.key( closestMarker.index ).time )\
    }\
}\
\
//---------- Result ----------\
result";
                //Closing the UndoGroup.
                app.endUndoGroup() ;
            }
        }
        CTalertDlg( "I'm Done" , "I've finished modifying your expressions" );
    }
    
}