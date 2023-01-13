
// <!-- Response methods -->

function handleResponse() {
  if(!coding.answering){
    showFeedbackPos();
    setTimeout(function() {
    hideStimuliAndFeedback()   // hide stimuli
    hideAndResetButtons()      // hide selection buttons
    hidePermBonus()
    nextTrial()},              // initiate the next trial
    2000);
    }
  }

function  handleTestResponse(){
  // if they are correct
  if (arraysEqual(sdata.test_responses[coding.testindex], parameters.testPropCorrectOr[coding.testindex])){
    console.log("It worked");
    hideallLevelIcon();
    hideIcon();
    showFeedbackIcons();
    showGreenIcon();
    setTimeout(function(){hideGreenIcon();
      hideTestButtons();
      hidePrime();
      hideFeedbackIcons()}, 3000)
      setTimeout(nextTestTrial, 3500);
  }
  else{
    console.log("else");
    hideallLevelIcon();
    showFeedbackIcons();
    setTimeout(function(){hideIcon();
    hideTestButtons();
    hidePrime();
    hideFeedbackIcons()}, 3000)
    setTimeout(nextTestTrial, 3500);
  }
}

function handleNoResponse() {
  if(!isFullscreen() && startedexperiment && !finishedexperiment) {
    finishExperiment_noresponse();
  }
}


function handleNextAttempt(){

    var att = [sdata.trial_att[coding.index]];
    showCorrectionMssg();
    showCorrect(sdata.trialPropShuff[coding.index][att]);
    setTimeout(function() {
    hideStimuliAndFeedback()                // hide stimuli
    hideAndResetButtons()                   // hide selection buttons
    hideCorrectionMssg()                    // hide the correction message
    sdata.trial_att[coding.index]++         // update the attempt number
    updateAttempt()                         // update data for a new attempt
    showStimuli()},                         // show the stimuli for the next attempt
    parameters.feedneg_timeout);
    setTimeout(function() {
      showButtons()
      showRetryMssg()},
      5500);
}

function handleSubmit(){
  var att = [sdata.trial_att[coding.index]];

  // a function to be called when clicking the next trial button
  if(coding.answering){

    if (sdata.resp_indices[coding.index][att].length == 3){
      // clear the timeout
      clearTimeout(window.timeout);

      board.submitButton.object[0].attr({"fill": board.color_response})

      coding.answering = false;

      saveResponse();                                   // save the response
                                                        // grey out the irrelevant choices
      hideSubmitButton(board.submitButton.object);      // hide the button for our next trial
      hideRetryMssg();

      // we show what would have been correct if they are wrong
      if (sdata.resp_correct_array[coding.index][att].includes(false)){
        handleNextAttempt()
      }
      else{handleResponse()}
    }
    else{
      hideRetryMssg();
      showSelectionError();
      setTimeout(function(){
        hideSelectionError()
        if (sdata.trial_att[coding.index] > 0){showRetryMssg()}}, 
        700);
    }
  }
}

function handleTestSubmit(){
  // a function to be called when clicking the next trial button

  if (! sdata.test_responses[coding.testindex].includes(NaN)){
    board.testsubmitButton.object[0].attr({"fill": board.color_response})
                                        
    hideSubmitButton(board.testsubmitButton.object);      // hide the button for our next trial

    handleTestResponse();
  }

  // else{
  //   console.log("test")
  //   showSelectionError();
  //   setTimeout(hideSelectionError(), 700);
  // }
}

function saveResponse() {
  var att = [sdata.trial_att[coding.index]];

  sdata.resp_timestamp[coding.index][att]    = getTimestamp();
  sdata.resp_reactiontime[coding.index][att] = getSecs(coding.timestamp);

  // vector of which properties the participant was correct
  // we do this by element-wise comparison
  sdata.resp_correct_array[coding.index][att]  = sdata.trialPropShuff[coding.index][att].map(function(x, i){ 
                                                  if(isequal(x, sdata.prop_responses[coding.index][att][i])){return(true)}
                                                  else if((x == 0) && (sdata.prop_responses[coding.index][att][i] == 1)){return false}
                                                  else{return(NaN)}});
  
  sdata.groundTruthCorrect[coding.index][att]  = sdata.trialPropShuff[coding.index][att].map(function(x, i){
                                                  if(x == sdata.prop_responses[coding.index][att][i]){return(1)}
                                                  else if ((x == 0) && (isNaN(sdata.prop_responses[coding.index][att][i]))){return(1)}
                                                  else{return 0}})
  if (att == 0){
    // save the bonus of this trial in array
    sdata.trial_bonus[coding.index] = sdata.resp_correct_array[coding.index][att].filter(x => x === true).length;
    // save the current bonus achieved in this block
    sdata.current_bonus += sdata.trial_bonus[coding.index]
    // update the bonus on screen
    hidePermBonus();
    showPermBonus();
  };
  //debugging
  // console.log("what participant responded")
  // console.log(sdata.prop_responses[coding.index][att]);
  // console.log("if this is correct")
  // console.log(sdata.resp_correct_array[coding.index][att]);
  // console.log("bonus");
  // console.log(sdata.trial_bonus[coding.index]);
  // console.log(sdata.current_bonus);
  // console.log("the ground truth of correctness")
  // console.log(sdata.groundTruthCorrect[coding.index][att]);
  // console.log("undid shuffling")
  sdata.groundTruthCorrect_unshuf[coding.index][att] = undoShuffling(
                                                          sdata.property_order[coding.index][att],
                                                          sdata.groundTruthCorrect[coding.index][att]);
  // console.log(sdata.groundTruthCorrect_unshuf[coding.index][att]);

  sdata.resp_correct_array_unshuf[coding.index][att] = undoShuffling(
                                                          sdata.property_order[coding.index][att], 
                                                          sdata.resp_correct_array[coding.index][att]);
}


function handleButtonFeedback (index){
  // this functions handles response to clicking a button
  // this is an awful function, I should probably change this
  var att = [sdata.trial_att[coding.index]];

  // handle further clicks for the same button
  if(coding.answering){

    // update the buttons
    updateButtons(index);
    // remove the redundant button
    removeRedunChoice(index);
    // update the glow
    updateGlow(index);
    // we change the value of our array of responses
    sdata.prop_responses[coding.index][att][index] = 1;

    // we store the response indices
    storeIndicesAndValues(index, 1);

  }
}

function storeIndicesAndValues(index, value){
    // we push the new index and shift and shift if needed
    // we also push and shift the values of the selected buttons

    var att = [sdata.trial_att[coding.index]];

    if (sdata.resp_indices[coding.index][att].length == 3 && !sdata.resp_indices[coding.index][att].includes(index)){
      sdata.prop_responses[coding.index][att][sdata.resp_indices[coding.index][att][0]] = NaN;
      sdata.resp_indices[coding.index][att].shift();
      sdata.resp_indices_values[coding.index][att].shift();
    }
    if (!sdata.resp_indices[coding.index][att].includes(index)){
      sdata.resp_indices[coding.index][att].push(index);
      sdata.resp_indices_values[coding.index][att].push(value);
    }
    // if the same button is selected we replace the entry
    if (sdata.resp_indices[coding.index][att].includes(index)){
       sdata.resp_indices_values[coding.index][att][sdata.resp_indices[coding.index][att].indexOf(index)] = value
    }

}

function updateButtons(index){
    // first we change the colour of the button 
    // change the colour
    board.circButtons.object[index].attr({"fill":board.color_response}); 
}

function removeRedunChoice(index){
    var att = [sdata.trial_att[coding.index]];
    // then we remove the redundant choice 

    if(!(sdata.resp_indices[coding.index][att].includes(index)||sdata.resp_indices[coding.index][att].length == 0)){
      if (sdata.resp_indices[coding.index][att].length == 3){
      // first color of the choice
      board.circButtons.object[(sdata.resp_indices[coding.index][att][0])][0].attr({"fill":board.color_background});
      // then we remove the glow
      board.circles.objects.glow[sdata.resp_indices[coding.index][att][0]].remove();
      }
    }

}

function updateGlow(index){
    var att = [sdata.trial_att[coding.index]];
    // we show the glow for the clicked button, but only once per trial
    if((!sdata.resp_indices[coding.index][att].includes(index))||(sdata.resp_indices[coding.index][att].length == 0)){
      board.circles.objects.glow[index] = board.circles.objects[index].glow()
      board.circles.objects.glow[index].toFront();
    }
}

// ----- update functions for the test Buttons -------

function handleTestButtonFeedback (index){
  // this functions handles response to clicking a button
  // this is an awful function, I should probably change this

  // handle further clicks for the same button

    // we change the value of our array of responses
    updateTestRespArray(index);
    // update the buttons
    updateTestButton(index);
    // we store the response indices
    // storeIndicesAndValues(index, 1);
}

function updateTestButtons(index){
  // first we change the colour of the button 
  // change the colour
  board.testButtons.object[index].attr({"fill":board.color_response}); 
}

function updateTestButton(index){
    if (! isNaN(sdata.test_responses[coding.testindex][index])){
      board.testButtons.object.glow[index] = board.testButtons.object[index].glow()
      board.testButtons.object.glow[index].toFront();
      board.testButtons.object[index].attr({"fill":board.color_response});
      showLevelIcon([sdata.test_responses[coding.testindex][index], index]);
    }
    else{
      board.testButtons.object.glow[index].remove();
      board.testButtons.object[index].attr({"fill":board.color_background});
    }
}

function updateTestRespArray(index){
  var poss_values    = [0,1,2];
  var missing_vals = poss_values.filter(function(x){
                                        return sdata.test_responses[coding.testindex].indexOf(x) < 0;
                                        });
  if (isNaN(sdata.test_responses[coding.testindex][index])){
    sdata.test_responses[coding.testindex][index] = Math.min(...missing_vals);
  }
  else{
    hideLevelIcon([sdata.test_responses[coding.testindex][index], index]);
    sdata.test_responses[coding.testindex][index] = NaN;
  }
}




