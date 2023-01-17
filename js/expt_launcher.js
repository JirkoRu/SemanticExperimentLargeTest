
// <!-- Block methods -->
function newBlock() {
  hideTrial();
  //hideFeedback();
  showBlock();
  saveExperiment();
}

function startBlock() {
  if (coding.newblock){
    coding.newblock  = false;
    hideBlock();
    newTrial();
  }
}

// <!-- Trial methods -->
function nextTrial() {
  // INCREMENT TRIAL
  coding.index++;
  coding.trial++;

  // INCREMENT BLOCK
  if (coding.trial==parameters.nb_trials) {
    // showTestTrial();
    sdata.block_bonus[coding.block] = sdata.trial_bonus.slice(coding.block*parameters.nb_trials, coding.index).reduce((pv, cv) => pv + cv, 0);
    coding.block++;
    coding.trial=0;
    sdata.current_bonus=0;
    // start the test trials
    if ([2,4,6,8].includes(coding.block)){
      hidePermBonus();
      newTestTrial(); 
    }
    else{
      coding.newblock  = true;
      newBlock();
    }

    // NEW BLOCK
    // coding.newblock  = true;
    // newBlock();
    return;
  }

  // NEW TRIAL
  newTrial();
}

function newTrial() {
  if (!startedexperiment) {return;}
  // update
  updateSdata();
  updateAttempt();

  // timeout
  window.timeout = setTimeout(handleTimeout, parameters.response_timeout);

  // show
  showTrial();
  // hide
  //hideFeedback();
  //hideStimuliAndFeedback();
  // timestamp
  coding.timestamp = getTimestamp();
  coding.newblock  = false;
  // countdown
  //startCountdown();
}

function newTestTrial(){
  updateTestSdata();
  showTestTrial();
}

function nextTestTrial(){
  coding.testindex++;
  coding.testtrial++;

  if (coding.testtrial == parameters.nTestBlocktrials){
    coding.testblock++;
    coding.testtrial = 0;
    // END OF EXPERIMENT
    if (coding.block==parameters.nb_blocks){
      sdata.general_bonus = sdata.block_bonus.reduce((pv, cv) => pv + cv, 0);
      finishExperiment_data();
      return;
    }
    else{
      // continue the experiment if we did all the test trials required
      coding.newblock  = true;
      newBlock();
    }
  }

  else{
    newTestTrial();
  }
}

function handleTimeout(){
  var att = [sdata.trial_att[coding.index]];
  // make a function that handles a potential timeout
  if (sdata.resp_indices[coding.index][att].length != 3){
      sdata.timed_out[coding.index] = true;
      hideStimuliAndFeedback()   // hide stimuli
      hideAndResetButtons();
      hideSubmitButton(board.submitButton.object);
      hidePermBonus();
      showTimeoutMssg();
      setTimeout(function(){hideTimeoutMssg();
                            nextTrial();}
                            ,parameters.timeoutMssgtime);
  }
}

