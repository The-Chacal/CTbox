//****************************************//
//  Posterize Property
//****************************************//

/**
 * Adds an expression posterizing the properties' animation according to the frame rate defined by the slider.
 */
function posterizeProp(){
    
    var propertiesToTreat = CTcheckSelectedProperties();
    if( propertiesToTreat != null ){
        for( var i = 0 ; i < propertiesToTreat.length ; i ++ ){
            var currentProperty = CTgetProperty( propertiesToTreat[i] );
            if( currentProperty.canSetExpression ){
                //Opening the UndoGroup.
                app.beginUndoGroup( "Posterising the Property" );
                //Adding a Slider setting the step of the Animation, if it does not already exists.
                var propertyParentLayer = propertiesToTreat[i][ propertiesToTreat[i].length - 1 ];
                var posterizeStepSlider = null ;
                try{ posterizeStepSlider = propertyParentLayer.effect( "Posterize - Step" ) }catch(e){};
                if( posterizeStepSlider == null ){
                    posterizeStepSlider = propertyParentLayer.property( "ADBE Effect Parade" ).addProperty("ADBE Slider Control");
                    currentProperty = CTgetProperty( propertiesToTreat[i] );
                    posterizeStepSlider.name = "Posterize - Step" ;
                    posterizeStepSlider.property(1).setValue( 2 );
                }
                //Adding the Expression.
                var newExpression = "//---------- Links ----------\
var stepSlider = effect(\"Posterize - Step\")(1);\
\
//---------- Code ----------\
var result = value ;\
var currentStep = stepSlider ;\
var delta = 0 ;\
if( stepSlider != 1 ){\
    if( stepSlider.numKeys > 1 )\
    {\
        var stepSliderNearestKey = stepSlider.nearestKey( time );\
        if( time < stepSliderNearestKey.time )\
        {\
            stepSliderNearestKey = stepSlider.key( stepSliderNearestKey.index - 1 );\
        }\
        currentStep = stepSliderNearestKey ;\
        delta = framesToTime( timeToFrames( time - stepSliderNearestKey.time ) % currentStep );\
    } else {\
        delta = framesToTime( timeToFrames( time - inPoint ) % currentStep );\
    }\
    result = valueAtTime( time - delta );\
}\
//--------------------\
result";
                currentProperty.expression = newExpression ;
                //Closing the UndoGroup.
                app.endUndoGroup() ;
            }
        }
        CTalertDlg( "I'm Done" , "   I've finished adding posterisation to your properties." );
    }
}