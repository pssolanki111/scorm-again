[![CircleCI](https://img.shields.io/circleci/build/github/jcputney/scorm-again/master?style=for-the-badge "CircleCI Build Status")](https://circleci.com/gh/jcputney/scorm-again) [![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/jcputney/scorm-again?style=for-the-badge)](https://codeclimate.com/github/jcputney/scorm-again) [![Code Climate coverage](https://img.shields.io/codeclimate/coverage/jcputney/scorm-again?style=for-the-badge)](https://codeclimate.com/github/jcputney/scorm-again/trends/test_coverage_total) [![Code Climate technical debt](https://img.shields.io/codeclimate/tech-debt/jcputney/scorm-again?style=for-the-badge)](https://codeclimate.com/github/jcputney/scorm-again/trends/technical_debt) [![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/jcputney/scorm-again?style=for-the-badge) ](https://app.snyk.io/org/jcputney/projects?origin[]=github)

# SCORM Again
This project was created to modernize the SCORM JavaScript runtime, and to provide a stable, tested platform for running AICC, SCORM 1.2, and SCORM 2004 modules. This module is designed to be LMS agnostic, and is written to be able to be run without a backing LMS, logging all function calls and data instead of committing, if an LMS endpoint is not configured.

### What is this not and what doesn't it do?
1. This is not an LMS
1. This does not handle the uploading and verification of SCORM/AICC modules
1. This project does not **currently** support the TinCan/xAPI runtime, but is it something I am considering in the very near future.
1. This library does not setup communication between an external AICC module and an LMS.
1. This project is not complete! I'm still working on AICC testing, and continuing to write proper test cases for all APIs


### Setup
To begin with, you include either the `scorm-again.js` or `scorm-again.min.js` file on your launching page:
```html
<script type="text/javascript" src="/dist/scorm-again.js"></script>
```

Or, if you would like to install the library using your package manager, you can do the following:
```sh
npm install scorm-again
```
or
```sh
yarn add scorm-again
```

You would then initialize the APIs using the following JS statements:
```javascript
var settings = {}
# AICC
window.API = new AICC(settings);

# SCORM 1.2
window.API = new Scorm12API(settings);

# SCORM 2004
window.API_1484_11 = new Scorm2004API(settings);
```

### Available Settings
The APIs include several settings to customize the functionality of each API:

| Setting        | Default           | Values  | Description |
| ------------- |:-------------:| :-----:| --- |
| `autocommit`      | false | true/false | Determines whether the API schedules an autocommit to the LMS after setting a value. |
| `autocommitSeconds`      | 60      |   int | Number of seconds to wait before autocommiting. Timer is restarted if another value is set. |
| `lmsCommitUrl` | false      |    url | The URL endpoint of the LMS where data should be sent upon commit. If no value is provided, modules will run as usual, but all method calls with just be logged to the console. |
| `dataCommitFormat` | `json` | `json`, `flattened`, `params` | `json` will send a JSON object to the lmsCommitUrl in the format of <br>`{'cmi': {'core': {...}}`<br><br> `flattened` will send the data in the format <br>`{'cmi.core.exit': 'suspend', 'cmi.core.mode': 'normal'...}`<br><br> `params` will send the data as <br>`?cmi.core.exit=suspend&cmi.core.mode=normal...` |
| `commitRequestDataType` | 'application/json;charset=UTF-8' | string | This setting is provided in case your LMS expects a different content type or character set. |
| `autoProgress` | false | true/false | In case Sequencing is being used, you can tell the API to automatically throw the `SequenceNext` event.|
| `logLevel` | 4 | int<br><br>1 => DEBUG<br>2 => INFO<br>3 => WARN<br>4 => ERROR<br>5 => NONE | By default, the APIs only log error messages. |
| `mastery_override` | false | true/false | (SCORM 1.2) Used to override a module's `cmi.core.lesson_status` so that a pass/fail is determined based on a mastery score and the user's raw score, rather than using whatever status is provided by the module. An example of this would be if a module is published using a `Complete/Incomplete` final status, but the LMS always wants to receive a `Passed/Failed` for quizzes, then we can use this setting to override the given final status. |

## Initial Values

If you want to initially load data from your backend API, you must do it before launching your SCORM/AICC player. After the player has initialized, you will not be able to change any read-only values.

You can initialize your variables on the CMI object individually:

```javascript
window.API_1484_11.cmi.learner_id = "123";
```

You can also initialize the CMI object in bulk by supplying a JSON object. Note that it can be a partial CMI JSON object:

```javascript
window.API_1484_11.loadFromJSON(json);
```

<details>
  <summary>Example JSON input</summary>

  ```javascript
  var json = {
    "learner_id": "123",
    "learner_name": "Bob The Builder",
    "suspend_data": "viewed=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31|lastviewedslide=31|7#1##,3,3,3,7,3,3,7,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,11#0#b5e89fbb-7cfb-46f0-a7cb-758165d3fe7e=236~262~2542812732762722742772682802752822882852892872832862962931000~3579~32590001001010101010101010101001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001010010010010010010010010011010010010010010010010010010010010112101021000171000~236a71d398e-4023-4967-88fe-1af18721422d06passed6failed000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000105wrong110000000000000000000000000000000000~3185000000000000000000000000000000000000000000000000000000000000000000000000000000000~283~2191w11~21113101w41689~256~2100723031840~21007230314509062302670~2110723031061120000000000000000000~240~234531618~21601011000100000002814169400,#-1",
    "interactions": {
      "0": {
        "id": "Question14_1",
        "type": "choice",
        "timestamp": "2018-08-26T11:05:21",
        "weighting": "1",
        "learner_response": "HTH",
        "result": "wrong",
        "latency": "PT2M30S",
        "objectives": {
          "0": {
            "id": "Question14_1"
          }
        },
        "correct_responses": {
          "0": {
            "pattern": "CPR"
          }
        }
      }
    }
  };
  ```
</details>

Another option for initializing the CMI object in bulk is by supplying a "flattened" JSON object. Note that it can be a partial CMI JSON object:

```javascript
window.API_1484_11.loadFromFlattenedJSON(json);
```

<details>
  <summary>Example flattened JSON input</summary>

  ```javascript
  var json = {
    "cmi.learner_id": "123",
    "cmi.learner_name": "Bob The Builder",
    "cmi.suspend_data": "viewed=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31|lastviewedslide=31|7#1##,3,3,3,7,3,3,7,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,11#0#b5e89fbb-7cfb-46f0-a7cb-758165d3fe7e=236~262~2542812732762722742772682802752822882852892872832862962931000~3579~32590001001010101010101010101001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001010010010010010010010010011010010010010010010010010010010010112101021000171000~236a71d398e-4023-4967-88fe-1af18721422d06passed6failed000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000105wrong110000000000000000000000000000000000~3185000000000000000000000000000000000000000000000000000000000000000000000000000000000~283~2191w11~21113101w41689~256~2100723031840~21007230314509062302670~2110723031061120000000000000000000~240~234531618~21601011000100000002814169400,#-1",
    "cmi.interactions.0.id": "Question14_1",
    "cmi.interactions.0.type": "choice",
    "cmi.interactions.0.timestamp": "2018-08-26T11:05:21",
    "cmi.interactions.0.weighting": "1",
    "cmi.interactions.0.learner_response": "HTH",
    "cmi.interactions.0.result": "wrong",
    "cmi.interactions.0.latency": "PT2M30S",
    "cmi.interactions.0.objectives.0.id": "Question14_1"
    "cmi.interactions.0.objectives.0.correct_responses.0.pattern": "CPR"
  };
  ```
</details>

### Accessing CMI Data

The CMI data stored by the API can be accessed directly through the `API.cmi` object or `API_1484_11.cmi` object. For example, to get the Student Name in SCORM 1.2, you would do the following:
```javascript
var studentName = window.API.cmi.core.student_name;
```

### SCORM 1.2 and AICC Listeners

For convenience, hooks are available for all the SCORM 1.2/AICC API Signature functions:
`LMSInitialize`,
`LMSFinish`,
`LMSGetValue`,
`LMSSetValue`,
`LMSCommit`,
`LMSGetLastError`,
`LMSGetErrorString`,
`LMSGetDiagnostic`,
`SequenceNext`,
`SequencePrevious`

You can add your hook into these by adding a listener to the `window.API` object:

```javascript
window.API.on("LMSInitialize", function() {
  [...]
});
```

You can also listen for events on specific SCORM CMI elements:

```javascript
window.API.on("LMSSetValue.cmi.core.student_id", function(CMIElement, value) {
  [...]
});
```

### SCORM 2004 Listeners

For convenience, hooks are available for all the SCORM API Signature functions:
`Initialize`,
`Terminate`,
`GetValue`,
`SetValue`,
`Commit`,
`GetLastError`,
`GetErrorString`,
`GetDiagnostic`,
`SequenceNext`,
`SequencePrevious`,
`SequenceChoice`,
`SequenceExit`,
`SequenceExitAll`,
`SequenceAbandon`,
`SequenceAbandonAll`

You can add your hook into these by adding a listener to the `window.API_1484_11` object:

```javascript
window.API_1484_11.on("Initialize", function() {
  [...]
});
```

You can also listen for events on specific SCORM CMI elements:

```javascript
window.API_1484_11.on("SetValue.cmi.learner_id ", function(CMIElement, value) {
  [...]
});
```

### Total Time Calculation
The APIs provide a convenience method `getCurrentTotalTime()` that can be used for calculating the current `total_time` value, based on the current `session_time` and the `total_time` supplied when the module was launched. This works for both ISO 8601 duration time formats in SCORM 2004 as well as the HH:MM:SS format in SCORM 1.2 and AICC, and outputs the correct format based on the version used.

### Completion Status
The APIs will calculate the proper completion status to send back to an LMS. This status is usually based on completion threshold, progress measure, and lesson mode, but please see the `mastery_override` setting for how statuses can be changed based on scores, as well.

### Sequencing
The APIs provide some hooks for the sequencing of modules, but this is primarily handled by the LMS, so no functionality beyond event listeners is provided. More work can be done in this area, but I'm primarily focused on the stability of the rest of the APIs at this point.


### Credits and Thanks!
This project was heavily influenced by the [simplify-scorm](https://github.com/gabrieldoty/simplify-scorm) project by @gabrieldoty, but ended up being pretty much a ground-up rewrite. The big influence from this project was the inclusion of event listeners.

I also drew from the [Moodle SCORM module](https://github.com/moodle/moodle/tree/master/mod/scorm), but avoided directly copying their code because it is...not very clean.

### Contributing
I welcome any and all feedback and contributions to this project! I'm sure it would do with some cleanup and refactoring, and could definitely use some more test cases.

#### Setup and Development
You will need `node` installed on your local machine, and you'll have to run `npm install` in the repo directory before starting development. 

To run a build, you need to just run the `grunt` command in the root of the project.

Similarly, to run the tests, you just run the `grunt test` or `npm test` command.

Before submitting pull requests, please also run `eslint ./src --fix` against your code first, otherwise your pull request build could fail.

