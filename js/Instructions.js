

var ins = {};

function loadInstructions(){
		// make the images with the instructions
	ins.images = {};
	ins.images.rectangle = [board.paper.centre[0] - board.paper.width/3,
							board.paper.centre[1] - board.paper.height/3,
							board.paper.width/1.5,
							board.paper.height/1.5
							];
	
	ins.images.objects = Array(8);
	for (let i = 0; i <= 7; i++){
		ins.images.objects[i] = drawImage(board.paper.object, 
									"media/Instructions/instructions_" + (i).toString() + ".png",
									ins.images.rectangle);
		ins.images.objects[i].attr({"opacity":0})
	}
}

function setInstructions(){
	// load the images
	loadInstructions();
	// the current instruction being shown
	ins.current = 0; 

	// make the buttons
	ins.buttons 				= {};
	ins.buttons.prevloc 		= [board.paper.centre[0] - .1 * board.paper.width, board.paper.centre[1] + .4 * board.paper.height];
	ins.buttons.nextloc 		= [board.paper.centre[0] + .1 * board.paper.width, board.paper.centre[1] + .4 * board.paper.height];
	ins.buttons.previousButton 	= drawRectButton(board.paper, ins.buttons.prevloc, " << Previous", board.nextTrialButton.attrText, board.nextTrialButton.attributes, handlePreviousInst);
	ins.buttons.nextButton 	 	= drawRectButton(board.paper, ins.buttons.nextloc, " Next >>", board.nextTrialButton.attrText, board.nextTrialButton.attributes, handleNextInst);

	// make the start experiment button
	ins.buttons.startExp = drawRectButton(board.paper, ins.buttons.nextloc, "Start Experiment!", board.nextTrialButton.attrText, board.nextTrialButton.attributes,runExperiment);

	// make the texts for the buttons
	ins.buttons.nextAndPrevLoc = [board.paper.centre[0], board.paper.centre[1] + .46 * board.paper.height];
	ins.buttons.nextAndPrevAttr = {"fill":board.color_text,"font-size": board.paper.width/50, "text-anchor" : "middle", "opacity":0};
	
	ins.buttons.nextText = {};
	ins.buttons.nextText.text = "Click 'Next >>' to go to the next instruction screen";
	ins.buttons.nextText.object = drawText(board.paper.object, ins.buttons.nextAndPrevLoc, ins.buttons.nextText.text);
	ins.buttons.nextText.object.attr(ins.buttons.nextAndPrevAttr);

	ins.buttons.nextAndPrevText = {};
	ins.buttons.nextAndPrevText.text = "Click 'Next >>' to go to the next instruction screen or \n click '<< Previous' to go back";
	ins.buttons.nextAndPrevText.object = drawText(board.paper.object,ins.buttons.nextAndPrevLoc,ins.buttons.nextAndPrevText.text);
	ins.buttons.nextAndPrevText.object.attr(ins.buttons.nextAndPrevAttr);

	ins.buttons.previousText = {};
	ins.buttons.previousText.text = "Click '<< Previous' to go back or \n click 'Start Experiment!' if you are ready to beginn the task "; 
	ins.buttons.previousText.object = drawText(board.paper.object,ins.buttons.nextAndPrevLoc,ins.buttons.previousText.text);
	ins.buttons.previousText.object.attr(ins.buttons.nextAndPrevAttr);

	// make the specific screen wise instructions
	ins.screenWiseInstr = {};
	ins.screenWiseInstr.loc = [board.paper.centre[0], board.paper.centre[1] - .42 * board.paper.height];
	ins.screenWiseInstr.attr = {"fill":board.color_text,"font-size": board.paper.width/42, "text-anchor" : "middle", "opacity":0};
	ins.screenWiseInstr.strings = [ `In this task, you will play a space botanist encounterting new alien planets. \n
									As a diligent botanist you have to learn which plants can grow on which planets.`,
									"On each trial you will first see a black dot.", 
									`Your task is to associate types of alien planets with the plants that grow on them. \n 
									On each trial you will see a planet and potential plant names. \n
									Plant names are indicated by the labels in the circular buttons.`,
									`For on each planet type there are three plants that can grow on them. \n 
									You must clicking three plant names that you think can grow on the planet. \n
									Do not take too long to click as the trial will time out after a few seconds.`,
									`You can change you choice by clicking another button. \n
									When you are sure of your selection you should click 'Submit >>' `,
									`If all or some of your choices were incorrect a red message appears. \n 
									The correct plants will then be indicated for the buttons.`,
									`Then, you must try again. The order of the plant buttons will be shuffled. \n 
									You will have to keep trying until your answer is correct. \n
									You will only get bonus for answers on your first attempt, so try to get it right!`,
									`Once your answer is correct we will move on to the next trial. \n
									After each block we will tell you how many bonus points you got.`
									];

	ins.screenWiseInstr.objects = Array(8);

	for(let j = 0; j < 8; j++){
		ins.screenWiseInstr.objects[j] = drawText(board.paper.object, ins.screenWiseInstr.loc, ins.screenWiseInstr.strings[j]);
		ins.screenWiseInstr.objects[j].attr(ins.screenWiseInstr.attr);
	}
}

function handlePreviousInst(){
	if(ins.current != 0){
		ins.images.objects[ins.current].attr({"opacity": 0});
		// hide the large instructions
		ins.screenWiseInstr.objects[ins.current].attr({"opacity": 0})
		--ins.current;
	}
	hideInstructions();
	showInstruction();
}

function handleNextInst(){
	if(ins.current != 8){
		ins.images.objects[ins.current].attr({"opacity": 0});
		// hide the large instructions
		ins.screenWiseInstr.objects[ins.current].attr({"opacity": 0})
		++ins.current;
	}
	hideInstructions();
	showInstruction();
}

function hideInstructions(){
	ins.buttons.previousButton.attr({"opacity": 0});
	ins.buttons.nextButton.attr({"opacity": 0});
	ins.buttons.startExp.attr({"opacity": 0})

	// hide the texts
	ins.buttons.nextText.object.attr({"opacity": 0});
	ins.buttons.nextAndPrevText.object.attr({"opacity": 0});
	ins.buttons.previousText.object.attr({"opacity": 0});
}

function showInstruction(){
	ins.images.objects[ins.current].attr({"opacity": 1});
	ins.images.objects[ins.current].toFront();
	ins.screenWiseInstr.objects[ins.current].attr({"opacity": 1});
	ins.screenWiseInstr.objects[ins.current].toFront();
	showNextInstButton();
	showButtonTexts();
}

function showButtonTexts(){
	// show the appropriate button texts
	if(ins.current == 0){
		ins.buttons.nextText.object.attr({"opacity": 1});
		ins.buttons.nextText.object.toFront();
	}
	else if (ins.current != 0 && ins.current != 7){
		ins.buttons.nextAndPrevText.object.attr({"opacity": 1});
		ins.buttons.nextAndPrevText.object.toFront();
	}
	else if (ins.current == 7){
		ins.buttons.previousText.object.attr({"opacity": 1});
		ins.buttons.previousText.object.toFront();
	}
}
function showNextInstButton(){
	// show the buttons when needed
	if (ins.current != 0){
		// button
		ins.buttons.previousButton.attr({"opacity": 1});
		ins.buttons.previousButton.toFront();
	}
	if (ins.current != 7){
		// button
		ins.buttons.nextButton.attr({"opacity": 1});
		ins.buttons.nextButton.toFront();
	}

	if (ins.current == 7){
		// button
		ins.buttons.startExp.attr({"opacity": 1})
		ins.buttons.startExp.toFront();
	}
}

function hideAllInstructions(){
	ins.images.objects.map((x)=>x.remove());
	ins.buttons.previousButton.remove();
	ins.buttons.nextButton.remove();
	ins.buttons.startExp.remove();

	ins.buttons.nextText.object.remove();
	ins.buttons.nextAndPrevText.object.remove();
	ins.buttons.previousText.object.remove();
	ins.screenWiseInstr.objects.map((x)=>x.remove());
}
