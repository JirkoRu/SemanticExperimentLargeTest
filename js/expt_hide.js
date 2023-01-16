
// <!-- Hide methods -->
function hideTrial() {
  hideFixation(board.fixation);
  hidePermBonus();
  //hideStimuli();
  hideInstructions();
  //hideClock();
}

function hideStimuli() {
  // this is an example
  board.image.objects[sdata.vbxi_category[coding.index]].attr({"opacity": 0});
}

function hideStimuliAndFeedback() {
  // hide the trial image
  board.image.objects[sdata.vbxi_category[coding.index]][sdata.exemplar[coding.index]].attr({"opacity": 0});
  board.posFeedText.object.attr({"opacity": 0});
}

function hideAndResetButtons(){
  var att = [sdata.trial_att[coding.index]];
  // reset the buttons
  board.circButtons.object.map((x)=>x.remove());
  // hide the labels
  sdata.property_order[coding.index][att].map((x, i)=>board.labels.objects[i][x].attr({"opacity": 0, "fill":board.color_text}))
  board.circles.objects.glow.map((x)=>x.remove());
}

function hideSubmitButton(submitButton){
  // hide the button and reset color_background
  submitButton[0].attr({"fill": board.color_background});
  submitButton.attr({"opacity": 0});
}

function hideNextTrialButton(){
  // hide the button and
  board.nextTrialButton.object.attr({"opacity": 0});
  board.nextTrialButton.object.unclick();

}

function hideFeedback() {
  board.posFeedText.object.attr({"opacity": 0});
  board.negFeedText.object.attr({"opacity": 0});
}

function hideRetryMssg() {
  board.retryMssg.object.attr({"opacity": 0});
}

function hidePermBonus(){
  board.perm_bonus.object.remove();
}

function hideLoadMessage (){
  board.loadMssg.object.remove()
}

function hideBlock() {
  board.block.object.remove();
  board.block.blockobject.remove();
  board.block.bonusobject.remove()
}

function hideSelectionError(){
  board.selectionError.object.attr({"opacity": 0});
}

function hideCorrectionMssg(){
  board.correctionMssg.object.attr({"opacity": 0})
}

function hideIncompleteCorrect(){
  board.incompCorrect.object.attr({"opacity": 0});
}

function hideTimeoutMssg(){
  board.timeoutMssg.object.attr({"opacity": 0});
}

function showTimeoutMssg(){
  board.timeoutMssg.object.attr({"opacity": 1});
}

function hideIcon(){
  board.iconimage.object.attr({"opacity":0});
}

function hideLevelIcon(index){
  board.levelIcons.objects[index[0]][index[1]].attr({"opacity":0});
}

function hideallLevelIcon(){
  board.levelIcons.objects.map((i)=>i.map((j)=>j.attr({"opacity":0})));
}

function hideTestButtons(){
  // hide the buttons 
  board.testButtons.object.map((x)=>x.attr({"opacity": 0}));
  board.testButtons.object.map((x)=>x.attr({"fill":board.color_background}));

  // hide the labels and move them to the front
  sdata.testpropsshuff[coding.testindex].map((x, i)=>board.testButtons.labelobject[i][x].attr({"opacity": 0}));

  // remove the glow
  board.testButtons.object.glow.map((x)=>x.remove());

}

function hidePrime(){
  board.primes.objects.map((x)=>x.attr({"opacity": 0}));
}

function hideFeedbackIcons(){
  parameters.testPropCorrectOr[coding.testindex].map((x, i)=>board.levelIconsColor.objects[x][i].attr({"opacity":0}));
}