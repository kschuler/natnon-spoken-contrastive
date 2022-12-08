/* initialize jsPsych */
var jsPsych = initJsPsych({
  on_finish: function () {
    // Childlanglab.saveData(jsPsych.data.get().json());
    jsPsych.data.displayData();
  }
});

var start = {
  type: jsPsychHtmlButtonResponse,
  stimulus: "",
  choices: ["Run demo"]
};

var show_data = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function () {
    var trial_data = jsPsych.data.get().last(2).values();
    var trial_json = JSON.stringify(trial_data, null, 2);
    return `<p style="margin-bottom:0px;"><strong>Trial data:</strong></p>
    <pre style="margin-top:0px;text-align:left;">${trial_json}</pre>`;
  },
  choices: ["Repeat demo"]
};

var init_mic = {
  type: jsPsychInitializeMicrophone
};

var instruction = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
  <img src='img/10.gif' style="width:100px; padding: 20px;"></img>
  <p>Make up a name for this shape. When you have one in mind, click the button and then say the name aloud.</p>`,
  choices: ["I am ready."]
};

var record = {
  type: jsPsychHtmlAudioResponse,
  stimulus: `
  <img src='img/10.gif' style="width:100px; padding: 20px;"></img>
  <p>Recording...</p>`,
  recording_duration: 3500,
  save_audio_url: true,
  on_finish: function (data) {
    // Childlanglab.saveRecording(data.response, 'trial');
    data.response = "removed base64 string";
  }
};

var playback = {
  type: jsPsychAudioButtonResponse,
  stimulus: () => {
    return jsPsych.data.get().last(1).values()[0].audio_url;
  },
  prompt: "<p>Click the object the matches the spoken name.</p>",
  choices: ["img/9.gif", "img/10.gif", "img/11.gif", "img/12.gif"],
  button_html: '<img src="%choice%" style="width:100px; padding: 20px;"></img>'
};

var trial_loop = {
  timeline: [instruction, record, playback, show_data],
  loop_function: function () {
    return true;
  }
};

var timeline = [start, init_mic, trial_loop];
/* init Childlanglab.js then run the jsPsych experiment */
jsPsych.run(timeline);
