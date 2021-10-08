//****************************************//
//  Marker Animation v1.0
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
                var newExpression = "//---------- MarkerAnim ----------\
var Result = value\
if( thisLayer.marker.numKeys > 0 )\
{\
    var ClosestMarker = thisLayer.marker.nearestKey( time );\
    if( time < ClosestMarker.time && ClosestMarker.index == 1 )\
    {\
        Result = valueAtTime( thisLayer.inPoint );\
    } else if( time < ClosestMarker.time )\
    {\
        Result = valueAtTime( thisLayer.marker.key( ClosestMarker.index - 1).time )\
    } else if( time >= ClosestMarker.time )\
    {\
        Result = valueAtTime( thisLayer.marker.key( ClosestMarker.index ).time )\
    }\
}\
//--------------------\
Result";
                currentProperty.expression = newExpression ;
                //Closing the UndoGroup.
                app.endUndoGroup() ;
            }
        }
        CTalertDlg( { en: "I'm Done" , fr: "J'ai Fini" } , { en: "I've finished modifying your expressions" , fr: "   J'ai fini de customiser tes expressions." } );
    }
    
}