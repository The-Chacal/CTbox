//****************************************//
//  Posterize Property v1.0
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
                app.beginUndoGroup( { en: "Posterising the Property" , fr: "Ajout de la Posterisation" } );
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
var StepSlider = effect(\"Posterize - Step\")(1);\
\
//---------- Code ----------\
var Result = value ;\
var CurrentStep = StepSlider ;\
var Delta = 0 ;\
if( StepSlider.numKeys > 1 )\
{\
    var StepSliderNearestKey = StepSlider.nearestKey( time );\
    if( time < StepSliderNearestKey.time && StepSliderNearestKey.index == 1 )\
    {\
        CurrentStep = StepSliderNearestKey ;\
    } else if( time < StepSliderNearestKey.time )\
    {\
        CurrentStep = StepSlider.key( StepSliderNearestKey.index - 1 );\
    } else if( time >= StepSliderNearestKey.time )\
    {\
        CurrentStep = StepSliderNearestKey ;\
    }\
}\
Delta = framesToTime( timeToFrames( time - inPoint ) % CurrentStep );\
Result = valueAtTime( time - Delta );\
//--------------------\
Result";
                currentProperty.expression = newExpression ;
                //Closing the UndoGroup.
                app.endUndoGroup() ;
            }
        }
        CTalertDlg( { en: "I'm Done" , fr: "J'ai Fini" } , { en: "I've finished adding posterisation to your properties." , fr: "   J'ai fini de posterizer tes expressions." } );
    }
}