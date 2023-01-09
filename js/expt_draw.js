
function drawStimuli(paper,stimID,stim_len) {
  const Prop2Dim = parameters.map_Prop2Dim;
  const stim_center = paper.centre;

  const stimuli = {};
  
  //construct filename according to dim value  
  let dimVal  = parameters.stim_list.find((x)=>x[3]==stimID);
  let object  = parameters.propertyLists['object'][dimVal[0]];
  let painter = parameters.propertyLists['painter'][dimVal[1]];
  let exemplarID = parameters.propertyLists['examplarfileID'][dimVal[2]].toString();
  //set up stimlus
  stimuli.src = "media/stimuli/".concat(object,"_",painter,exemplarID,".png");
  stimuli.loc = [stim_center[0]-0.5*stim_len,stim_center[1]-0.7*stim_len,stim_len,stim_len];
  stimuli.object = drawImage(paper.object,stimuli.src,stimuli.loc);
  
  stimuli.object.attr({"opacity":0})
  return(stimuli)
}

function drawRectButton(paper,centre,text, attrText, attrButton, handle){

  buttontext = drawText(paper.object,centre,text);
  buttontext.attr(attrText);

  [box_w,box_h] = [buttontext.getBBox().width, buttontext.getBBox().height];

  buttonrect  = paper.object.rect(centre[0]-.7*box_w, centre[1]-.7*box_h, 1.4*box_w, 1.4*box_h, 5);
  buttonrect.attr(attrButton);
  buttontext.toFront();

  var button = paper.object.set();
  button.push(
    buttonrect,
    buttontext
  );

  if (typeof(handle)=='function') {
    button.click(handle);
  }
  return(button)
}

function drawNCircButtons(paper, centres, nProperties, radius, handle){
  // a function which allows me to draw all different buttons on screen
  // docstring tba
  // define an empty array for our buttons and the button radius
  var buttons = [];

  for (var nButton = 0; nButton < nProperties; nButton++){

    // draw n circular buttons
    currentButton = drawCircle(paper.object, [centres[nButton][0], centres[nButton][1]], radius);

    // define the relevant attributes of the buttons
    currentButton.attr(board.attr_buttonshape);

    // push button to set probably deprecated
    var button = paper.object.set();
    button.push(
      currentButton,
    );

    // check if we have a button event attached
    if (typeof(handle)=='function') {
      button.click(handle);
    }
    
    buttons.push(button);
  }
  return (buttons);
}


function drawLabels(paper, centres, texts, attributes){

  var labels = [];

  for(var j = 0; j < centres.length; j++){
    // store the labels for a particular button position
    var posLabels = [];
    for (var i = 0; i < texts.length; i++){
      label = drawText(paper.object, [centres[j][0], centres[j][1]], texts[i]);
      label.attr(attributes);
      posLabels.push(label);
    }
    posLabels.map((x)=>x.attr(attributes));
    labels.push(posLabels)
  }
  return(labels);
}

function drawFeedback(paper, centres, radius, attrText, text){
  // draw feedback around the buttons using their radius centre
  var feedbackText = [];

  for (let i = 0; i < centres.length; i++){
    feedbackText[i]  = drawText(paper.object, [centres[i][0], centres[i][1] - radius - 55], text);
    feedbackText[i].attr(attrText)
  }

  return (feedbackText);
}

function drawPrimes(paper, texts, attributes, centre){
  var labels = [];

  for (var i = 0; i < texts.length; i++){
    label = drawText(paper.object, [centre[0], centre[1]], texts[i]);
    label.attr(attributes);
    labels.push(label);
  }
  return(labels);
}









