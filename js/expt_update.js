
// <!-- Update methods -->
function updateSdata() {
  // index, trial, block and attempts
  sdata.expt_index[coding.index]        = coding.index;
  sdata.expt_trial[coding.index]        = coding.trial;
  sdata.expt_block[coding.index]        = coding.block;
  sdata.trial_att[coding.index]         = 0;

  // category, exemplar
  sdata.vbxi_category[coding.index]   = parameters.stim_order[coding.index][0];
  sdata.exemplar[coding.index]        = parameters.stim_order[coding.index][1];
  
  // properties of this trial derived from the current stimulus category 
  sdata.trialProperties[coding.index]     = board.propertyValues.object[sdata.vbxi_category[coding.index]];
  
}

function updateAttempt(){

  var att = [sdata.trial_att[coding.index]];
  
  // empty array of responses
  sdata.prop_responses[coding.index][att]          = Array(14).fill(NaN);

  // empty array of the indices of relevant responses
  sdata.resp_indices[coding.index][att]            = [];

  // empty array of the values the above indexed properties take
  sdata.resp_indices_values[coding.index][att]     = [];

  // order of properties on screen shuffled for this trial
  sdata.property_order[coding.index][att]          = randperm(14);

  // the array of the trial properties shuffled
  sdata.trialPropShuff[coding.index][att]          = sdata.property_order[coding.index][att].map((i)=>sdata.trialProperties[coding.index][i]);

  // console.log("Original trial properties")
  // console.log(sdata.trialProperties[coding.index]);
  // console.log("The order to shuffle to")
  // console.log(sdata.property_order[coding.index][att]);
  // console.log("the result of the shuffling (properties)");
  // console.log(sdata.trialPropShuff[coding.index][att]);
}

function updateTestSdata() {
  // // index, trial, block and attempts
  // sdata.expt_index[coding.index]        = coding.index;
  // sdata.expt_trial[coding.index]        = coding.trial;
  // sdata.expt_block[coding.index]        = coding.block;
  // sdata.trial_att[coding.index]         = 0;

  // category, exemplar
  // sdata.vbxi_category[coding.index]   = parameters.stim_order[coding.index][0];
  // sdata.exemplar[coding.index]        = parameters.stim_order[coding.index][1];
  
  // properties of this trial
  sdata.test_primes[coding.testindex]    = parameters.primeorder[coding.testblock][coding.testtrial];
  sdata.testpropsshuff[coding.testindex] = parameters.testPropOder[coding.testindex];
}
