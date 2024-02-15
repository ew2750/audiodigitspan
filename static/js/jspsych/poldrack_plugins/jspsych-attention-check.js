/**
 * jspsych-attention-check
 * attention-check
 **/

jsPsych.plugins["attention-check"] = (function () {
  var randomDraw = function (lst) {
    var index = Math.floor(Math.random() * lst.length);
    return lst[index];
  };

  var questions = [
    { Q: "Press the Left Arrow key</p>", A: 37 },
    { Q: "<p>Press the Right Arrow key</p>", A: 39 },
    {
      Q: "<p>If (4 + 12) / 4 is greater than 3 press the 'm' key. Otherwise press the 'z' key.</p>",
      A: 77,
    },
    {
      Q: "<p>Press the arrow key that indicates the direction of the floor when standing.</p>",
      A: 40,
    },
    {
      Q: "<p>Russell loves to rock out to 'punk' music. It's his favorite genre. Press the key that corresponds to the first letter of Russell's favorite genre.</p>",
      A: 80,
    },
    {
      Q: "<p>Jaime went to go see the band 'Bedlocked' play live. Press the key that corresponds to the first letter of the band Jaime went to go see play live.</p>",
      A: 66,
    },
    {
      Q: "<p>Press the key corresponding to the number of sides a square has.</p>",
      A: 52,
    },
    {
      Q: "<p>Press the arrow key that indicates the direction of the sky when standing.</p>",
      A: 38,
    },
    {
      Q: "<p>If (7+1+4) is even, press the 'e' key. Otherwise press the 'o' key. </p>",
      A: 69,
    },
    {
      Q: '<p>Press the key that indicates "minus" when you press it or "underscore" when you hold the shift key and press it.</p>',
      A: 189,
    },
    {
      Q: "<p>Press the number key corresponding to the number of moons that Earth has orbiting it.</p>",
      A: 49,
    },
    {
      Q: "<p>Press the number key corresponding to the number of sides that a triangle has.</p>",
      A: 51,
    },
    {
      Q: "<p>Press the number key corresponding to the number of sides that a cube has.</p>",
      A: 54,
    },
    {
      Q: '<p>Press the key that indicates "equals" or "equality" when you press it, and "plus" or "addition" if you are holding the shift-key when you press it. </p>',
      A: 187,
    },
    {
      Q: "<p>Press the letter key that is like the letter key indicated at the end of this instructions page, but flipped upside down.<p><p>Press the 'm' key.</p>",
      A: 87,
    },
  ];

  questions = jsPsych.randomization.shuffle(questions);

  var plugin = {};

  plugin.trial = function (display_element, trial) {
    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // set default values for the parameters
    var default_question = questions.pop();
    trial.question = trial.question || default_question["Q"];
    trial.key_answer = trial.key_answer || default_question["A"];
    trial.choices = trial.choices || [];
    trial.response_ends_trial =
      typeof trial.response_ends_trial == "undefined"
        ? true
        : trial.response_ends_trial;
    trial.timing_stim = trial.timing_stim || -1;
    trial.timing_response = trial.timing_response || -1;
    trial.prompt = trial.prompt || "";

    // this array holds handlers from setTimeout calls
    // that need to be cleared if the trial ends early
    var setTimeoutHandlers = [];

    // display stimulus
    display_element.append(
      $("<div>", {
        html: trial.question,
        id: "jspsych-attention-check-stimulus",
      })
    );

    //show prompt if there is one
    if (trial.prompt !== "") {
      display_element.append(trial.prompt);
    }

    // store response
    var response = {
      rt: -1,
      key: -1,
    };

    // function to end trial when it is time
    var end_trial = function () {
      // kill any remaining setTimeout handlers
      for (var i = 0; i < setTimeoutHandlers.length; i++) {
        clearTimeout(setTimeoutHandlers[i]);
      }

      // kill keyboard listeners
      if (typeof keyboardListener !== "undefined") {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      //calculate stim and block duration
      if (trial.response_ends_trial) {
        if (response.rt != -1) {
          var block_duration = response.rt;
        } else {
          var block_duration = trial.timing_response;
        }
        if ((stim_duration < block_duration) & (stim_duration != -1)) {
          var stim_duration = trial.timing_stim;
        } else {
          var stim_duration = block_duration;
        }
      } else {
        var block_duration = trial.timing_response;
        if ((stim_duration < block_duration) & (stim_duration != -1)) {
          var stim_duration = timing_stim;
        } else {
          var stim_duration = block_duration;
        }
      }

      //calculate correct
      correct = false;
      if (response.key == trial.key_answer) {
        var correct = true;
      }

      // gather the data to store for the trial
      var trial_data = {
        rt: response.rt,
        stimulus: trial.question,
        correct: correct,
        correct_response: trial.key_answer,
        key_press: response.key,
        possible_responses: trial.choices,
        stim_duration: stim_duration,
        block_duration: block_duration,
        timing_post_trial: trial.timing_post_trial,
      };

      //jsPsych.data.write(trial_data);

      // clear the display
      display_element.html("");

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function (info) {
      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      $("#jspsych-attention-check-stimulus").addClass("responded");

      // only record the first response
      if (response.key == -1) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (JSON.stringify(trial.choices) != JSON.stringify(["none"])) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: "date",
        persist: false,
        allow_held_key: false,
      });
    }

    // hide image if timing is set
    if (trial.timing_stim > 0) {
      var t1 = setTimeout(function () {
        $("#jspsych-attention-check-stimulus").css("visibility", "hidden");
      }, trial.timing_stim);
      setTimeoutHandlers.push(t1);
    }

    // end trial if time limit is set
    if (trial.timing_response > 0) {
      var t2 = setTimeout(function () {
        end_trial();
      }, trial.timing_response);
      setTimeoutHandlers.push(t2);
    }
  };

  return plugin;
})();
