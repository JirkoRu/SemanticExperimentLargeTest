
var sdata;
var edata;
var parameters;
var parameters_loaded;
var board;
var coding;

function save_parameters() {
  var page_to = "lib/php/save_param.php";
  return new Promise((resolve,reject) => {
    $.ajax({
            type: "POST",
            url: page_to,
            data:{'id':JSON.stringify(edata.expt_subject),
                  'turker':JSON.stringify(edata.expt_turker),
                  'parameters':JSON.stringify(parameters)},
            success: function(datasavingstatus){
              resolve(datasavingstatus)
            },
            error: function(error){
              reject(error)
              alert("Data saving failed! Please contact the experimenter")
            }
          })
  })
}

function find_partitipantID() {
  var lookupID_PHP = "lib/php/lookup_id.php";
  return new Promise((resolve,reject) => {
    $.ajax({
      type: "POST",
      url: lookupID_PHP,
      data:{'turker':JSON.stringify(edata.expt_turker)},
      success: function(id){
        resolve(id)
      },
      error: function(error){
        reject(error)
        alert("Data retrieval failed! Please contact the experimenter")
      }
      })
  })
}

function load_parameters(){   
   var loadPARAM_PHP = "lib/php/load_param.php";
   return new Promise((resolve,reject) => {
    $.ajax({
      type: "POST",
      url: loadPARAM_PHP,
      data:{'id':JSON.stringify(edata.expt_subject)},
      success: function(data){
        resolve(data)
      },
      error: function(){
        reject(error)
        alert("Data retrieval failed! Please contact the experimenter")
      }
      })
   })
}

async function makeRandomisation() {
  return new Promise((resolve) => {
      if (curr_session==0){
      // make a radom permutation of the image classes
      parameters.image.randomOrder = randperm(parameters.nClasses);
  
      // the random order of the labels
      parameters.labelOrder = randperm(parameters.nProperties);
      
      resolve("it worked");
      } 
      else{
        find_partitipantID()
        .then((subjectidfromlookup)=>{
          if (JSON.parse(subjectidfromlookup)==false){
            alert("Data retrieval failed! Please contact the experimenter");
          } 
          else{
            console.log("id lookup succeeded!");
            edata.expt_subject = JSON.parse(subjectidfromlookup);
            load_parameters()
              .then((data)=>{
                if (JSON.parse(data)==false){
                  alert("Data retrieval failed! Please contact the experimenter");
                }
                else{
                  // the parameters we loaded
                  parameters_loaded = JSON.parse(data);
                  // now we set the random order to that of the previous runs
                  parameters.image.randomOrder = parameters_loaded.image.randomOrder;
                  parameters.labelOrder        = parameters_loaded.labelOrder;
                  // get the current session etc
                  parameters.curr_session = curr_session;
                  parameters.path_session = "session"+(curr_session+1).toString();
                  console.log("parameter loading succeeded!");
                  // participant_id = subjectidfromlookup;
                  participant_id = JSON.parse(subjectidfromlookup);
                  logStart(participant_task, participant_id);
                  resolve("it worked!");
                }
              })
              .catch(()=>{
                alert("Data retrieval failed! Please contact the experimenter");
              })
          }
        })
        .catch(()=>{
          alert("Data retrieval failed! Please contact the experimenter");
        })
      };
  });
}

async function setExperiment() {
  // EDATA ----------------
  edata = {};
  // expt
  edata.expt_subject = participant_id;
  edata.expt_sex     = participant_gender;
  edata.expt_age     = participant_age;
  edata.expt_task    = participant_task;
  edata.expt_turker  = participant_turker;

  // PARAMETERS -----------
  parameters = {};

  //time outs
  parameters.response_timeout  =  12000;      // response timeout is 8 seconds (response_timeout - presentation_time)
  parameters.warnings_timeout  =  20000;      // response warning time
  parameters.feedpos_timeout   =  8000;       // feedback time (good)
  parameters.feedneg_timeout   =  3200;       // feedback time (bad)
  parameters.fix_time          =  500;        // lenth of fixation time
  parameters.presentation_time =  2000;       // length of stimulus presentation before buttons
  parameters.timeoutMssgtime   =  900;        // length of presentation of timeout mssg

  // numbers
  parameters.nb_trials        =   20;
  parameters.nb_blocks        =   8;

  // test
  parameters.nTestTrials      =   64;
  parameters.nTestBlocks      =   4;
  parameters.nTestBlocktrials =   16;
  parameters.nTestProperties  =   3;
  parameters.primeorder       =   createPrimeOrder();
  parameters.testPropCorrectOr=   [...Array(parameters.nTestTrials)].map(e => parameters.nTestProperties);
  parameters.testPropOder     =   createTestPropOrder();

  parameters.nProperties      =  14;
  parameters.nClasses         =   8;
  parameters.nExemplars       =  20;

  // the strings of images we will use
  parameters.srcs= [];

  // defined for the loading of the random order of image classes
  parameters.image = {};

  globalThis.curr_session = abs(parseInt(getQueryParams().s)) - 1;

  // ------------ here we get all the images source strings -----------

  for (let j = 0; j <= parameters.nClasses - 1; j++) {
    for (let i = 0; i <= parameters.nExemplars -1 ; i++) {
        parameters.srcs.push( "media/PlanetStimuli/" + "class_" + (j+1).toString() + "/" + i.toString()+ ".png");
    }
  }

  // ---------- trial order ------------

  // make the cartesian product to get the location of all stimuli
  // we do this with respect to the array of images saved on the board 
  // rows = category, columns = exemplar

  parameters.stim_locs = [];
  var cat_indecies   = Array.from(Array(parameters.nClasses).keys()); 
      exemp_indecies = Array.from(Array(parameters.nExemplars).keys());

  for (var cat = 0; cat < cat_indecies.length; cat++) {
    for (var exemp = 0; exemp < exemp_indecies.length; exemp++){
        parameters.stim_locs.push([cat_indecies[cat], exemp_indecies[exemp]])
      }
  }
  
  // shuffle the array of order for experimental presentation
  parameters.stim_order = shuffle(parameters.stim_locs);

  // SDATA ----------------
  sdata = {};
  // expt
  sdata.expt_index        = [];
  sdata.expt_trial        = [];
  sdata.expt_block        = [];
  sdata.trial_att         = [];

  // vbxi
  sdata.vbxi_category     = [];
  sdata.exemplar          = [];
  sdata.trialProperties   = [];       // the properties of the current trial
  sdata.trialPropShuff    = Array.from(new Array(parameters.stim_order.length), function(){return [];});     // the properties in the order as shuffeled for the current trial

  // vbxi for test trials
  // sdata.testprops         = []; 
  // sdata.TestRandomorder   = [];
  sdata.testpropsshuff    = [];
  sdata.test_responses    = [...Array(parameters.nTestTrials)].map(e => Array(parameters.nTestProperties).fill(NaN));
  sdata.test_primes       = [];
  // bonus
  sdata.trial_bonus       = [];
  sdata.block_bonus       = [];
  sdata.general_bonus     = []; 
  sdata.current_bonus     =  0;

  // resp
  sdata.resp_timestamp             = Array.from(new Array(parameters.stim_order.length), function(){return [];});
  sdata.resp_reactiontime          = Array.from(new Array(parameters.stim_order.length), function(){return [];});
  sdata.property_order             = Array.from(new Array(parameters.stim_order.length), function(){return [];});

  sdata.resp_correct_array         = Array.from(new Array(parameters.stim_order.length), function(){return [];});   // stores exact items participant was correct on
  sdata.resp_correct_array_unshuf  = Array.from(new Array(parameters.stim_order.length), function(){return [];});   // store correct items in an unshuffled order
  sdata.prop_responses             = Array.from(new Array(parameters.stim_order.length), function(){return [];});   // trial wise responses with respect to the features
  sdata.groundTruthCorrect         = Array.from(new Array(parameters.stim_order.length), function(){return [];});   // correct array in terms of baseline correct and incorrect
  sdata.groundTruthCorrect_unshuf  = Array.from(new Array(parameters.stim_order.length), function(){return [];});   // correct array in terms of baseline unshuffeld

  sdata.resp_indices               = Array.from(new Array(parameters.stim_order.length), function(){return [];});   // the indices that were responded to
  sdata.resp_indices_values        = Array.from(new Array(parameters.stim_order.length), function(){return [];});   // the values of the selected indices [0,1]

  // sdata.timed out
  sdata.timed_out                  = Array.from(new Array(parameters.stim_order.length), function(){return false;});
  // BOARD ----------------

  board = {};

  // fonts and text attributes
  board.font_bigsize   = 100;
  board.font_medsize   = 15;
  board.font_medlasize = 50;
  board.font_tinysize  = 12;
  board.stroke_width   = 5;
  board.color_text     = "#000000"
  board.color_background = "#FFFFFF"
  board.color_response = "#B2BEB5"

  // paper (paper)
  board.paper = {};
  board.paper.width  = window.innerWidth;
  board.paper.height = window.innerHeight;
  board.paper.centre = [0.5*window.innerWidth , 0.5*window.innerHeight];
  board.paper.rect   = [
                        0,
                        0,
                        board.paper.width,
                        board.paper.height
                       ];
  board.paper.object = drawPaper(board.paper.rect);


  // background
  board.background = {};
  board.background.width  = window.innerWidth;
  board.background.height = window.innerHeight;
  board.background.rect   = [0, 0,
                        board.background.width,
                        board.background.height
                       ];
  board.background.object = drawRect(board.paper.object, board.background.rect);
  board.background.object.attr({"fill": "white"});
  board.background.object.toBack();

  // FIXATION
  board.fixation = createFixation(board.paper);
  showFixation(board.fixation);

  // ------------ Buttons for submitting and next trial -------------

  // --------- submit button -----------
  // get the parameters for the next trial button
  board.submitButton              = {};
  board.submitButton.location     = [board.paper.centre[0], board.paper.centre[1] + .46 * board.paper.height];
  // button attributes
  board.submitButton.attrButton   = {"fill":board.color_background, "stroke-width": 3, "opacity":0};
  // text attributes
  board.submitButton.attrText     = {"fill":board.color_text, "font-size": board.paper.width/60, "text-anchor" : "middle", "opacity":0};
  // create the button and give the relevant attributes
  board.submitButton.object       = drawRectButton(board.paper, board.submitButton.location, "Submit >>", board.submitButton.attrText, board.submitButton.attrButton, handleSubmit);

  // ------- next trial button ------------
  board.nextTrialButton              = {};
  board.nextTrialButton.location     = [board.paper.centre[0], board.paper.centre[1] + .46 * board.paper.height];
  board.nextTrialButton.attributes   = {"fill":board.color_background, "stroke-width": 3, "opacity":0};
  board.nextTrialButton.attrText     = {"fill":board.color_text,"font-size": board.paper.width/60, "text-anchor" : "middle", "opacity":0};
  board.nextTrialButton.object       = drawRectButton(board.paper, board.nextTrialButton.location, "Next Trial >>", board.nextTrialButton.attrText, board.nextTrialButton.attributes);

  // --------- Feedback if not all features selected ---------
  board.selectionError            = {};
  board.selectionError.location   = [board.paper.centre[0], board.paper.centre[1] + board.paper.height/16];
  board.selectionError.attributes = {"fill":"#D22","font-size": board.paper.width/30, "text-anchor" : "middle", "opacity":0};
  board.selectionError.object     = drawText(board.paper.object, board.selectionError.location, "Please select three properties!");
  board.selectionError.object.attr(board.selectionError.attributes);


  // -------- define property vectors for ground truth ---------
  board.propertyValues = {};
  board.propertyValues.object = createRelevPropVectors();
  // board.propertyValues.object = createPropertyVectors();

  // -------- define the relevant features for ground truth -----
  board.relevantVectors = {};
  board.relevantVectors.object = createRelevPropVectors();

  // -------- draw positive and negative feedback ---------

  // make positive feedback texts
  board.posFeedText            = {};
  board.posFeedText.textAttr   = {"fill":"#2D2","font-size": board.paper.width/30, "text-anchor" : "middle", "opacity":0};

  // we draw and use the button radius to determine button size
  board.posFeedText.object    = drawText(board.paper.object, board.selectionError.location, "Correct, Next Trial.");
  board.posFeedText.object.attr(board.posFeedText.textAttr);

  // ------------ draw message to try again -----------
  board.retryMssg            = {};
  board.retryMssg.location   = [board.paper.centre[0], board.paper.centre[1] + board.paper.height/16];
  board.retryMssg.attributes = {"fill":board.color_text,"font-size": board.paper.width/25, "text-anchor" : "middle", "opacity":0};
  board.retryMssg.object     = drawText(board.paper.object, board.retryMssg.location, "Now try again!");
  board.retryMssg.object.attr(board.retryMssg.attributes);

  // -------- Make the message that they are incorrect --------
  board.correctionMssg            = {};
  board.correctionMssg.location   = [board.paper.centre[0], board.paper.centre[1] + board.paper.height/16];
  board.correctionMssg.attributes = {"fill":"#D22","font-size": board.paper.width/28, "text-anchor" : "middle", "opacity":0};
  board.correctionMssg.object     = drawText(board.paper.object, board.correctionMssg.location, "Incorrect! These are the correct plants:");
  board.correctionMssg.object.attr(board.correctionMssg.attributes);

  // -------- Make a message to show when not all corrected -----
  board.incompCorrect = {};
  board.incompCorrect.attributes = {"fill":"#D22","font-size": board.paper.width/20, "text-anchor" : "middle", "opacity":0};
  board.incompCorrect.object = drawText(board.paper.object, board.correctionMssg.location, "You did not correct all relevant properties!");
  board.incompCorrect.object.attr(board.incompCorrect.attributes);

  // -------- Make the bonus shown permanently on screen, only properties defined here -----
  board.perm_bonus = {};
  board.perm_bonus.location   = [board.paper.centre[0] + board.paper.width/2.7, board.paper.centre[1] - board.paper.height/2.2];
  board.perm_bonus.attributes = {"fill":board.color_text,"font-size": board.paper.width/45, "text-anchor" : "middle", "opacity":1};

  // -------- Make the timeout message  --------
  board.timeoutMssg               = {};
  board.timeoutMssg.attributes    = {"fill":"#000000","font-size": board.paper.width/25, "text-anchor" : "middle", "opacity":0};
  board.timeoutMssg.object        = drawText(board.paper.object, board.correctionMssg.location, "Too slow. Try to be faster!");
  board.timeoutMssg.object.attr(board.timeoutMssg.attributes);

  // ------------ make load message -----------
  board.loadMssg            = {};
  board.loadMssg.location   = [board.paper.centre[0], board.paper.centre[1] - .42 * board.paper.height];
  board.loadMssg.attributes = {"fill":board.color_text,"font-size": board.paper.width/25, "text-anchor" : "middle", "opacity":0};
  board.loadMssg.object     = drawText(board.paper.object, board.loadMssg.location, "The task is loading. Please wait.");
  board.loadMssg.object.attr(board.loadMssg.attributes);

  // TEXT
  // instructions (text)
  board.instructions = {};
  board.instructions.centre       = [board.paper.centre[0], board.paper.centre[1]-150];
  board.instructions.text         = " ";
  board.instructions.object       = drawText(board.paper.object,board.instructions.centre,board.instructions.text);
  board.instructions.object.attr({"font-size": board.font_medsize});
  board.instructions.object.attr({"text-anchor": "middle"});

  // --------- Random order for buttons and stimuli
  // get the random order of classes and labels
  makeRandomisation()
    .then(()=>{
    
      //  ------- MAKING THE BUTTONS for clicking ----------

      // ------- Properties ----------
    
      board.properties = ["Derd",
                          "Lorp",
                          "Reng",
                          "Stad",
                          "Blap",
                          "Culp",
                          "Wost", 
                          "Fimp",
                          "Husp",
                          "Jang",
                          "Kern",
                          "Nilt",
                          "Pank",
                          "Tand",
                          ];
    
      board.propertiesShuff = parameters.labelOrder.map((i)=>board.properties[i]);
    
      // define button relevant parameters for drawing //
    
      // button text attributes
      board.attr_buttontext  = {"fill":board.color_text,"font-size": board.paper.width/80, "text-anchor" : "middle", "opacity":0};
      // button shape attibutes
      board.attr_buttonshape = {"fill":board.color_background, "stroke-width": 2,"opacity":0};
    
    
      // get the radius of our buttons
      board.buttonRadius = board.paper.width / (3.4 * (parameters.nProperties/2)); 
    
      // centres of the n buttons
      board.buttonCentres = Array(parameters.nProperties);
      // we loop to creat evenly spaced button centres,
      for(var i = 1; i <= board.buttonCentres.length/2 ; i++){
        // adding the first row
        board.buttonCentres[i-1] = [(board.paper.width/(parameters.nProperties/2 + 1)) * i, board.paper.centre[1] + board.paper.height/5.5];
        // adding the second row
        board.buttonCentres[i+6] = [(board.paper.width/(parameters.nProperties/2 + 1)) * i, board.paper.centre[1] + board.paper.height/2.9];
        
      } 
    
      // creating the buttons
      board.circButtons = {};
    
      // make some circles in the background to create glow around selected options
      board.circles = {};
      board.circles.objects = [];
      for(let i = 0; i < board.buttonCentres.length; i++){
        board.circles.objects.push(drawCircle(board.paper.object, board.buttonCentres[i], board.buttonRadius));
      }
      board.circles.objects.map((x)=>x.attr(board.attr_buttonshape));
    
      // glow objects stored here
      board.circles.objects.glow = Array(board.circles.objects.length);
    
      // ---------- feature labels ----------
      // button feature label attributes created here
      board.attr_labels = {"fill":board.color_text,"font-size": board.paper.width/44, "text-anchor" : "middle", "opacity":0};
      board.labels = {}; 
      board.labels.objects = drawLabels(board.paper, board.buttonCentres, board.propertiesShuff, board.attr_labels);


      // -------------- Draw the Planet icon ----------------
      board.iconimage = {};
      board.iconimage.rectangle = [ board.paper.centre[0] - board.paper.width/5.2,
                                    board.paper.centre[1] - board.paper.height * (2/4.45),
                                    board.paper.width/2.6,
                                    board.paper.height/2.6
                                  ];

      board.iconimage.object = drawImage(
          board.paper.object, 
          "media/testImages/planet_icon.png",
          board.iconimage.rectangle
          );
      board.iconimage.object.attr({"opacity":0});
      // -------------- make test buttons ----------
      board.testButtons = {};
      
      // define button relevant parameters for drawing the test Buttons //
      // get the radius of our buttons
      board.testButtons.radius = board.paper.width / (8 * (parameters.nTestProperties)); 
    
      // centres of the n buttons
      board.testButtons.buttonCentres = Array(parameters.nTestProperties);
      // we loop to creat evenly spaced button centres,
      for(var i = 1; i <= board.testButtons.buttonCentres.length ; i++){
        // adding the buttons
        board.testButtons.buttonCentres[i-1] = [(board.paper.width/(parameters.nTestProperties + 1)) * i, board.paper.centre[1] + board.paper.height/7];
      }
      board.testButtons.object = drawNCircButtons(board.paper, board.testButtons.buttonCentres, parameters.nTestProperties, board.testButtons.radius);

      board.testButtons.object.map((x, index)=>x.click(function(e){
        handleTestButtonFeedback(index)}));

      // hide the buttons 
      board.testButtons.object.map((x)=>x.attr({"opacity": 0}));

      // add the glow
      board.testButtons.object.glow = Array(board.testButtons.object.length);

      // make the labels
      board.testButtons.labels = board.propertiesShuff.slice(6);
      board.testButtons.labelobject = drawLabels(board.paper, board.testButtons.buttonCentres, board.testButtons.labels, board.attr_labels);

      // ------------- draw the first second and third icons ---------------
      board.levelIcons = {};
      board.levelIcons.rectangles = []
      board.levelIcons.strings = ["first.png", "second.png", "third.png"]

      // make the rectangles
      for (let k = 0; k < board.testButtons.buttonCentres.length; k++) {
        board.levelIcons.rectangles[k]= [board.testButtons.buttonCentres[k][0] - board.paper.width/16,
                                          board.testButtons.buttonCentres[k][1] + board.paper.height/12,
                                          board.paper.width/8,
                                          board.paper.height/6
                                        ];
      }

      // draw the images
      board.levelIcons.objects = [...Array(board.levelIcons.strings.length)].map(e => Array(board.levelIcons.strings.length).fill(NaN));

      for (let i = 0; i < board.levelIcons.strings.length; i++) {
        for (let k = 0; k < board.levelIcons.strings.length; k++) {
          board.levelIcons.objects[i][k] = drawImage(board.paper.object, 
                                                  "media/testImages/" + board.levelIcons.strings[i],
                                                  board.levelIcons.rectangles[k]
                                                  );
          board.levelIcons.objects[i][k].attr({"opacity":0});
        }
      }

      // ------------- draw the first second and third icons with color ---------------
      board.levelIconsColor = {};
      board.levelIconsColor.rectangles = []
      board.levelIconsColor.strings = ["first_green.png", "second_amber.png", "third_red.png"]

      // make the rectangles
      for (let k = 0; k < board.testButtons.buttonCentres.length; k++) {
        board.levelIconsColor.rectangles[k]= [board.testButtons.buttonCentres[k][0] - board.paper.width/16,
                                          board.testButtons.buttonCentres[k][1] + board.paper.height/12,
                                          board.paper.width/8,
                                          board.paper.height/6
                                        ];
      }

      // draw the images
      board.levelIconsColor.objects = [...Array(board.levelIcons.strings.length)].map(e => Array(board.levelIcons.strings.length).fill(NaN));

      for (let i = 0; i < board.levelIconsColor.strings.length; i++) {
        for (let k = 0; k < board.levelIconsColor.strings.length; k++) {
          board.levelIconsColor.objects[i][k] = drawImage(board.paper.object, 
                                                  "media/testImages/" + board.levelIconsColor.strings[i],
                                                  board.levelIconsColor.rectangles[k]
                                                  );
          board.levelIconsColor.objects[i][k].attr({"opacity":0});
        }
      }

      // ------------------------ draw the prime words -----------------------------------
      board.primes          = {};
      board.primes.location = [board.paper.centre[0], board.paper.centre[1]];
      board.primes.attr     = {"fill":board.color_text,"font-size": board.paper.width/50, "text-anchor" : "middle", "opacity":0};
      board.primes.words    = board.propertiesShuff.slice(2,6);
      board.primes.strings  = [];
      for (let i = 0; i < board.primes.words.length; i++) {
        board.primes.strings[i] = "You encounter a new planet on which the plant '" + board.primes.words[i].toUpperCase() + "' grows." + 
                                  `\n What other plants do you think could grow on this planet? \n Rank your choice by clicking all three buttons.`
      }
      board.primes.objects  = drawPrimes(board.paper, board.primes.strings, board.primes.attr, board.primes.location);

      // ----------------------- make a submit button for the test trials ----------
        // --------- submit button -----------
        // get the parameters for the next trial button
        board.testsubmitButton              = {};
        // create the button and give the relevant attributes
        board.testsubmitButton.object       = drawRectButton(board.paper, board.submitButton.location, "Submit >>", board.submitButton.attrText, board.submitButton.attrButton, handleTestSubmit);

      // ------- Stimuli ----------
    
      //loading all the images for all the classes
      board.image = {};
    
      board.image.rectangle = [ board.paper.centre[0] - board.paper.width/4,
                                board.paper.centre[1] - board.paper.height * (2.3/5),
                                board.paper.width/2,
                                board.paper.height/2.2
                              ];
    
    
      board.image.object = Array.from(Array(parameters.nClasses), () => []);
    
      for (let j = 0; j <= parameters.nClasses - 1; j++) {
        for (let i = 0; i <= parameters.nExemplars -1 ; i++) {
            board.image.object[j][i] = drawImage(
                                              board.paper.object, 
                                              "media/PlanetStimuli/" + "class_" + (j+1).toString() + "/" + i.toString()+ ".png", 
                                              board.image.rectangle, 
                                              board
                                              );
    
            board.image.object[j][i].attr({"opacity": 0});
        }
      }
    
      board.image.objects = parameters.image.randomOrder.map((i)=>board.image.object[i]);
    
      // --------- CODING ------------
      coding = {};
      // index
      coding.index  = 0;
      coding.trial  = 0;
      coding.block  = 0;
      // test index
      coding.testindex  = 0;
      coding.testtrial  = 0;
      coding.testblock  = 0;
      // other
      coding.answering = false;
      coding.timestamp = NaN;
      
      // finally we save the parameteres if the current session is 0
      if (curr_session==0){
        save_parameters()
          .then((datasavingstatus)=>{
            datasaving = JSON.parse(datasavingstatus);
            if (datasaving){
              parameters.curr_session = curr_session;
              parameters.path_session = "session1";
              logStart(participant_task,participant_id);       
            } 
            else {
              alert("Data saving failed! Please contact the experimenter")
            }
          })
          .catch(()=>{
            alert("Data saving failed! Please contact the experimenter");
          })
      };
    })
    
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// function to undo shuffling
function undoShuffling(permutation, target) {
  // just to unshuffle the responses
  var unshuffled = Array(permutation.length);
  for(var i = 0; i<permutation.length; i++){
    unshuffled[permutation[i]] = target[i];
  }
  return(unshuffled);
}

function createRelevPropVectors(){
  // a function to create relevant features for feedback

  // I first define the indices of properties for a given trial
  var relevantIndices = [[0,2,6], [0,2,7], [0,3,8], [0,3,9], [1,4,10], [1,4,11], [1,5,12], [1,5,13]];
  var relevantVectors = [...Array(8)].map(e => Array(14).fill(0));
  // now we loop over the property indices and fill in our target array
  for (let i = 0; i < relevantIndices.length; i++){
    for(let j = 0; j < relevantIndices[i].length ; j++){
      relevantVectors[i] [relevantIndices[i][j]] = 1;
    }
  }
  return(relevantVectors)
}

function createPrimeOrder(){
  // a function to create the order of prime stimuli for each test block
  var prime_idx = [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5];
  var primeorder = [...Array(parameters.nTestBlocks)].map(e => prime_idx);
  for (let j = 0; j < parameters.nTestBlocks; j++){
    var random_prime_order = randperm(parameters.nTestBlocktrials);
    primeorder[j] =  random_prime_order.map((i)=>primeorder[j][i]);
  }
  return(primeorder)
}

function createTestPropOrder(){
  // function that creates a test order of the button indices
  var testproplist = [...Array(parameters.nTestTrials)].map(e => parameters.nTestProperties);
  var trial_nr     = 0

  for (let i = 0; i < parameters.nTestBlocks; i++){
    for (let j = 0; j < parameters.nTestBlocktrials; j++){

      if (parameters.primeorder[i][j] == 2 || parameters.primeorder[i][j] == 3){
        var testprops_2_3         = [randomElement([0,1]), randomElement([2,3]), randomElement([4,5,6,7])];
        var randomorder           = randperm(testprops_2_3.length);
        testproplist[trial_nr]    = randomorder.map((i)=>testprops_2_3[i]);
        if (parameters.primeorder[i][j] == 2){
          var correct = [0,1,2];
          parameters.testPropCorrectOr[trial_nr] = randomorder.map((i)=>correct[i]);
        }
        else{
          var correct = [1,0,2];
          parameters.testPropCorrectOr[trial_nr] = randomorder.map((i)=>correct[i]);
        }
      }

      else if (parameters.primeorder[i][j] == 4 || parameters.primeorder[i][j] == 5){
        var testprops_4_5         = [randomElement([0,1,2,3]), randomElement([4,5]), randomElement([6,7])];
        var randomorder           = randperm(testprops_4_5.length);
        testproplist[trial_nr]    = randomorder.map((i)=>testprops_4_5[i]);
        if (parameters.primeorder[i][j] == 4){
          var correct = [2,0,1];
          parameters.testPropCorrectOr[trial_nr] = randomorder.map((i)=>correct[i]);
        }
        else{
          var correct = [2,1,0];
          parameters.testPropCorrectOr[trial_nr] = randomorder.map((i)=>correct[i]);
        }
      }
      trial_nr++
    }
  }
  return(testproplist)
}

function preloadImages(srcs, continueExp) {
  if (!preloadImages.cache) {
      preloadImages.cache = [];
  }
  var img;
  var remaining = srcs.length;
  showLoadMessage();
  for (var i = 0; i < srcs.length; i++) {
      img = new Image();
      img.onload = function () {
          --remaining;
          if (remaining <= 0) {
             console.log('all images cached');
             hideLoadMessage();
              continueExp();
          }
      };
      img.src = srcs[i];
      preloadImages.cache.push(img);
  }
}

function startLoading(){
  // load images and execute callback once finished
  img_srcs = parameters.srcs

  preloadImages(img_srcs, function() {
    
    if (isFullscreen()) {
        console.log("we have made it to if isFullscreen")
        // set the instructions
        setInstructions();

        //show the instructions
        showInstruction();
  }
});
}
