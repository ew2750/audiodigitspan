/* ************************************ */
/* Define helper functions */
/* ************************************ */
function evalAttentionChecks() {
  var check_percent = 1
  if (run_attention_checks) {
    var attention_check_trials = jsPsych.data.getTrialsOfType('attention-check')
    var checks_passed = 0
    for (var i = 0; i < attention_check_trials.length; i++) {
      if (attention_check_trials[i].correct === true) {
        checks_passed += 1
      }
    }
    check_percent = checks_passed / attention_check_trials.length
  }
  return check_percent
}

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}

var arraysEqual = function(arr1, arr2) {
  if (arr1.length !== arr2.length)
    return false;
  for (var i = arr1.length; i--;) {
    if (arr1[i] !== arr2[i])
      return false;
  }
  return true;
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var lang = 'chi'

var setStims = function() {
  curr_seq = []
  stim_array = []
  time_array = []
  var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  var last_num = 0
  for (var i = 0; i < num_digits; i++) {
    var num = randomDraw(nums.filter(function(x) {return Math.abs(x-last_num)>2}))
    last_num = num
    curr_seq.push(num)
    stim_array.push('<div> <audio autoplay> <source src="static/'+lang+'/'+lang+'_0'+num+'.wav" type="audio/wav"></audio></div>');
    time_array.push(stim_time)
  }
  total_time = num_digits*1300+500

}

var getTestText = function() {
  return '<div class = centerbox><div class = center-text>' + num_digits + ' Digits</p></div>'
}

var getStims = function() {
  return stim_array
}

var getTimeArray = function() {
  return time_array
}

var getTotalTime = function() {
  return total_time
}

var getFeedback = function() {
  return '<div class = centerbox><div class = center-text>' + feedback + '</div></div>'
}

var recordClick = function(elm) {
  response.push(Number($(elm).text()))
}

var clearResponse = function() {
  response = []
}



/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var num_digits = 3
var num_forward_trials = 10
var num_reverse_trials = 7
var curr_seq = []
var stim_time = 1300
var gap_time = 100
var time_array = []
var total_time = 0
var errors = 0
var error_lim = 3
var response = []
setStims()
var stim_array = getStims()

var response_grid =
  '<div class = numbox>' +
  // '<button id = button_1 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>1</div></div></button>' +
  // '<button id = button_2 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>2</div></div></button>' +
  // '<button id = button_3 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>3</div></div></button>' +
  // '<button id = button_4 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>4</div></div></button>' +
  // '<button id = button_5 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>5</div></div></button>' +
  // '<button id = button_6 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>6</div></div></button>' +
  // '<button id = button_7 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>7</div></div></button>' +
  // '<button id = button_8 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>8</div></div></button>' +
  // '<button id = button_9 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>9</div></div></button>' +
  '<button class = clear_button id = "ClearButton" onclick = "clearResponse()">Clear</button>' +
  '<button class = submit_button id = "SubmitButton">Submit Answer</button></div>'


/* ************************************ */
/* Set up preload */
/* ************************************ */

  var all_audios = [
    'static/sk/sk_1.wav',
    'static/sk/sk_2.wav',
    'static/sk/sk_3.wav',
    'static/sk/sk_4.wav',
    'static/sk/sk_5.wav',
    'static/sk/sk_6.wav',
    'static/sk/sk_7.wav',
    'static/sk/sk_8.wav',
    'static/sk/sk_9.wav',
    'static/chi/chi_01.wav',
    'static/chi/chi_02.wav',
    'static/chi/chi_03.wav',
    'static/chi/chi_04.wav',
    'static/chi/chi_05.wav',
    'static/chi/chi_06.wav',
    'static/chi/chi_07.wav',
    'static/chi/chi_08.wav',
    'static/chi/chi_09.wav'
  ]


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
  type: 'attention-check',
  data: {
    trial_id: "attention_check"
  },
  timing_response: 180000,
  response_ends_trial: true,
  timing_post_trial: 200
}

var attention_node = {
  timeline: [attention_check_block],
  conditional_function: function() {
    return run_attention_checks
  }
}

//Set up post task questionnaire
// var post_task_block = {
//    type: 'survey-text',
//    data: {
//        exp_id: "digit_span",
//        trial_id: "post task questions"
//    },
//    questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
//               '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
//    rows: [15, 15],
//    columns: [60,60]
// };

/* define static blocks */
var feedback_instruct_text =
  'Welcome to the experiment. This experiment will take less than 10 minutes. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  cont_key: [13],
  data: {
    trial_id: "instruction"
  },
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
  type: 'poldrack-instructions',
  data: {
    trial_id: "instruction"
  },
  pages: [
'<div class = centerbox><p class = block-text>In this test you will have to try to remember a sequence of numbers that will appear on the screen one after the other. At the end of each trial, enter all the numbers into the presented numpad in the sequence in which they occurred. Do your best to memorize the numbers, but do not write them down or use any other external tool to help you remember them.</p><p class = block-text>Trials will start after you end instructions.</p></div>'
 ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var instruction_node = {
  timeline: [feedback_instruct_block, instructions_block],
  /* This function defines stopping criteria */
  loop_function: function(data) {
    for (i = 0; i < data.length; i++) {
      if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
        rt = data[i].rt
        sumInstructTime = sumInstructTime + rt
      }
    }
    if (sumInstructTime <= instructTimeThresh * 1000) {
      feedback_instruct_text =
        'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        'Done with instructions. Press <strong>enter</strong> to continue.'
      return false
    }
  }
}

var end_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "end",
    exp_id: 'digit_span'
  },
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 500
};


var start_test_block = {
  type: 'poldrack-single-stim',
  is_html: true,
  stimulus: getTestText,
  data: {
    trial_id: "test_intro"
  },
  choices: 'none',
  timing_stim: 1000,
  timing_response: 1000,
  response_ends_trial: false,
  timing_post_trial: 1000
};

var start_reverse_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "start_reverse"
  },
  text: '<div class = centerbox><p class = block-text>In these next trials, instead of reporting back the sequence you just saw, report the <strong>reverse</strong> of that sequence. So the last item should be first in your response, the second to last should be the second in your response, etc...</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  on_finish: function() {
  	errors = 0
    num_digits = 3
    stims = setStims()
  }
}

/* define test block */
var test_block = {
  type: 'poldrack-multi-stim-multi-response',
  stimuli: getStims,
  prompt: '<div class = centerbox><div class = center-text> + </p></div>',
  is_html: true,
  timing_stim: getTimeArray,
  timing_gap: 0,
  choices: [
    ['none']
  ],
  data: {
    trial_id: "stim",
    exp_stage: 'test'
  },
  timing_response: getTotalTime,
  timing_post_trial: 0,
  on_finish: function() {
    console.log(stim_array),
    jsPsych.data.addDataToLastTrial({
      "sequence": curr_seq,
      "num_digits": num_digits
    })
  }
}

function updateResponse() {
  var responseInput = document.getElementById('response-input');
  var typedNumber = responseInput.value;
  document.getElementById('typed-number-display').innerText = typedNumber;
}




var forward_response_block = {
  type: 'survey-text',
  // rows: 
  data: {
           exp_id: "digit_span",
           trial_id: "post task questions"
       },
  questions: [
    '<p class = center-block-text style = "font-size: 20px">Please enter the numbers FORWARD. </p>'
  ],
  button_label:	'Submit',

  on_finish: function(data) {
    var responsesObj = JSON.parse(data.responses)
    responseInput = responsesObj["009"].slice();
    response = Array.from(String(responseInput), Number)
    // var enteredText = responseInput.value;
    console.log(curr_seq);
    console.log(responseInput)
    console.log(response); 


    jsPsych.data.addDataToLastTrial({
      // "response": response.slice(),
      "response":response,
      "sequence": curr_seq,
      "num_digits": num_digits,
      "condition": "forward"
    })
   
    var correct = false
      // staircase
    if (arraysEqual(response, curr_seq)) {
      num_digits += 1
      feedback = '<span style="color:green">Correct!</span>'
      stims = setStims()
      correct = true
    } else {
      errors += 1
      if (num_digits > 1 && errors == 2) {
        num_digits -= 1
        errors = 0
      }
      feedback = '<span style="color:red">Incorrect</span>'
      stims = setStims()
    }
    jsPsych.data.addDataToLastTrial({
      correct: correct
    })
    response = []
  },
  timing_post_trial: 500
}

var reverse_response_block = {
  type: 'survey-text',
  data: {
           exp_id: "digit_span",
           trial_id: "post task questions"
       },
  questions: [
    '<p class = center-block-text style = "font-size: 20px">Please enter the numbers BACKWARD. </p>'
  ],
  button_label:	'Submit',

  on_finish: function(data) {
    var responsesObj = JSON.parse(data.responses)
    responseInput = responsesObj["009"].slice();
    response = Array.from(String(responseInput), Number)
    // var enteredText = responseInput.value;
    console.log(curr_seq);
    console.log(responseInput)
    console.log(response); 


    jsPsych.data.addDataToLastTrial({
      // "response": response.slice(),
      "response":response,
      "sequence": curr_seq,
      "num_digits": num_digits,
      "condition": "forward"
    })
    var correct = false
      // staircase
    if (arraysEqual(response.reverse(), curr_seq)) {
      num_digits += 1
      feedback = '<span style="color:green">Correct!</span>'
      stims = setStims()
      correct = true
    } else {
      errors += 1
      if (num_digits > 1 && errors == 2) {
        num_digits -= 1
        errors = 0
      }
      feedback = '<span style="color:red">Incorrect</span>'
      stims = setStims()
    }
    jsPsych.data.addDataToLastTrial({
      correct: correct
    })
    response = []
  },
  timing_post_trial: 500
}

var feedback_block = {
  type: 'poldrack-single-stim',
  stimulus: getFeedback,
  data: {
    trial_id: "feedback"
  },
  is_html: true,
  choices: 'none',
  timing_stim: 1000,
  timing_response: 1000,
  response_ends_trial: true
}

/* create experiment definition array */
var digit_span_experiment = [];
digit_span_experiment.push(instruction_node);
for (i = 0; i < num_forward_trials ; i++ ) {
	digit_span_experiment.push(start_test_block)
	digit_span_experiment.push(test_block)
	digit_span_experiment.push(forward_response_block)
	digit_span_experiment.push(feedback_block)
}
digit_span_experiment.push(attention_node)
digit_span_experiment.push(start_reverse_block)
for (i = 0; i < num_reverse_trials ; i++ ) {
	digit_span_experiment.push(start_test_block)
	digit_span_experiment.push(test_block)
	digit_span_experiment.push(reverse_response_block)
	digit_span_experiment.push(feedback_block)
}
digit_span_experiment.push(end_block)