
// <!-- Show methods -->
function showTrial() {
  showFixation(board.fixation);
  setTimeout(showStimuli, parameters.fix_time)
  setTimeout(function() {
    showButtons() 
    showPermBonus()}, 
    parameters.presentation_time);
}

function showStimuli() {
  var att = [sdata.trial_att[coding.index]];

  // this shows an image
  board.image.objects[sdata.vbxi_category[coding.index]][sdata.exemplar[coding.index]].attr({"opacity": 1});

}

function showButtons(){

  var att = [sdata.trial_att[coding.index]];

  // allow answering
  coding.answering = true;

  board.circButtons.object = drawNCircButtons(board.paper, board.buttonCentres, parameters.nProperties, board.buttonRadius);
  // show the buttons 
  board.circButtons.object.map((x)=>x.attr({"opacity": 1}));
  
  board.circButtons.object.map((x, index)=>x.click(function(e){
    handleButtonFeedback(index)}));

  // move to front
  board.circButtons.object.map((x)=>x.toFront());

  // show the labels and move them to the front
  sdata.property_order[coding.index][att].map((x, i)=>board.labels.objects[i][x].attr({"opacity": 1}));
  sdata.property_order[coding.index][att].map((x, i)=>board.labels.objects[i][x].toFront());
  sdata.property_order[coding.index][att].map((x, i)=>board.labels.objects[i][x].node.setAttribute("pointer-events", "none"));

  // show the submit trial button
  board.submitButton.object.attr({"opacity": 1});
  board.submitButton.object.toFront()
}

function showNextTrialButton(){
  board.nextTrialButton.object.attr({"opacity": 1});
  board.nextTrialButton.object.click(function(e){
    handleNextTrial()})
  board.nextTrialButton.object.toFront();
}

function showLabels(){
  // show the labels and move them to the front
  sdata.property_order[coding.index].map((x, i)=>board.labels.objects[i][x].attr({"opacity": 1}))
  sdata.property_order[coding.index].map((x, i)=>board.labels.objects[i][x].toFront())
  //board.labels.objects.map((x,i)=>x.attr({"opacity": 1}));
  //board.labels.objects.map((x)=>x.toFront());
}


function showInstructions() {
  board.instructions.object.attr({"opacity": 1});
}

function showFeedback() {
  if(sdata.resp_correct[coding.index]){
    showFeedbackPos();
  } else {
    showFeedbackNeg();
  }
}

function showFeedbackPos() {
  board.posFeedText.object.attr({"opacity": 1});
}

function showRetryMssg() {
  board.retryMssg.object.attr({"opacity": 1});
}

function showLoadMessage(){
  board.loadMssg.object.attr({"opacity" : 1});
}

function showFeedbackTexts(responseCorrect, responseRelevant){
  // a function to show the feedback error
  for(let i = 0; i < responseCorrect.length; i++){
    if ((responseCorrect[i] == true) && (responseRelevant[i] == 1)){
      // show the positive feedback boxes
      board.posFeedText.objects[i].attr({"opacity":1})
      board.posFeedText.objects[i].toFront();
    }

    if ((responseCorrect[i] === false) && (responseRelevant[i] == 1)){
      // show the negative feedback boxes
      board.negFeedText.objects[i].attr({"opacity":1})
      board.negFeedText.objects[i].toFront();
    }
  }
}


function showCorrect(trialProperties){
  board.circButtons.object.map((x)=>x.attr({"fill":board.color_background}));
  board.circles.objects.glow.map((x)=>x.remove());
  // a function to show the properties relevant in this trial which are correct
  for(let i = 0; i < trialProperties.length; i++){
    if (trialProperties[i]){
      board.circles.objects.glow[i] = board.circles.objects[i].glow()
      board.circles.objects.glow[i].toFront();
      updateButtons(i)
    }
  }
}
function showPermBonus(){
  // function that shows bonus on each trial
  board.perm_bonus.object = drawText(board.paper.object, board.perm_bonus.location, "Block Bonus: " + sdata.current_bonus.toString());
  board.perm_bonus.object.attr(board.perm_bonus.attributes);
}
function showBlock(){
  // function to show after a specific block
  board.block = {};
  board.block.centre = board.paper.centre;
  board.block.text = `A couple of seconds' break. Press the SPACE bar when you're ready to continue`;
  board.block.object = drawText(board.paper.object,board.block.centre,board.block.text);
  board.block.object.attr({"font-size": 20});
  board.block.blockText = "You finished " + coding.block.toString() + "/" + parameters.nb_blocks.toString() + " blocks";
  board.block.blockobject = drawText(board.paper.object,[board.block.centre[0] , board.block.centre[1] + 50] ,board.block.blockText);
  board.block.blockobject.attr({"font-size": 20});
  board.block.bonusText = "You received " + (sdata.block_bonus[coding.block-1]).toString() + " out of " + (parameters.nb_trials*3).toString() + " possible bonus points on this block.";
  board.block.bonusobject = drawText(board.paper.object,[board.block.centre[0] , board.block.centre[1] + 100] ,board.block.bonusText);
  board.block.bonusobject.attr({"font-size": 20});
}

function showSelectionError(){
  board.selectionError.object.attr({"opacity": 1});
}

function showCorrectionMssg(){
  board.correctionMssg.object.attr({"opacity": 1});
}

function shomIncompleteCorrect(){
  board.incompCorrect.object.attr({"opacity": 1});
}

function showCorrection(){
  // remove a click handle
  board.circButtons.object.map((x, index)=>x.unclick(function(e){
    handleButtonFeedback(index)}));
}

function UpdateFeedbackText(index){
    board.negFeedText.objects[index].attr({"opacity":0})
    board.posFeedText.objects[index].attr({"opacity":1})
    board.posFeedText.objects[index].toFront()
}









