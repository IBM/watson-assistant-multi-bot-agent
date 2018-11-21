/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var AssistantV1 = require('watson-developer-cloud/assistant/v1'); // watson sdk

var app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

var assistantAPIKey = process.env["ASSISTANT_IAM_API_KEY"];
var assistantURL = process.env["ASSISTANT_IAM_URL"];
var assistantVersion = process.env["VERSION"];

// Create the service wrapper

var assistant = new AssistantV1({
  version: assistantVersion,
  iam_apikey: assistantAPIKey,
  url: assistantURL
});


// Endpoint to be call from the client side
app.post('/api/message', function (req, res) {
  console.log("");
  var workspace = getDestinationBot(req.body.context) || '<workspace-id>';
  //workspace = '2601a4af-82bd-4097-b5fb-83477ba0d257';
  if (!workspace || workspace === '<workspace-id>') {
    return res.json({
      'output': {
        'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
      }
    });
  }
  var payload = {
    workspace_id: workspace,
    context: req.body.context || {},
    input: req.body.input || {}
  };

  // Send the input to the assistant service
  assistant.message(payload, function (err, data) {
    console.log("Message: " + JSON.stringify(payload.input));
    if (err) {
      console.log("Error: " + JSON.stringify(err))
      return res.status(err.code || 500).json(err);
    }


    if( isRedirect(data.context) ){
      // When there is a redirect, get the redirect bot workspace id
      payload.workspace_id = getDestinationBot(data.context);
      // When there is a redirect, update destination bot in context so it persists along with the conversation
      payload.context.destination_bot = data.context.destination_bot;
      // Where there is redirect, old conversation_id is not needed. Delete it
      delete payload.context.conversation_id;
      // For redirect, no user action is needed. Call the redirect bot automatically and send back that response to user
      assistant.message(payload, function (err, data) {
        console.log("Message: " + JSON.stringify(payload.input));
        if (err) {
          return res.status(err.code || 500).json(err);
        }
        return res.json(updateMessage(payload, data));
      });
    }else{ // There is no redirect. So send back the response to user for further action
    return res.json(updateMessage(payload, data));
    }

  });
});

// The function checks if the bot response says messages to be redirected
function isRedirect(context){
  if( context && context.redirect_to_another_bot ){
    var isRedirect = context.redirect_to_another_bot;
      if( isRedirect == true ){
        return true;
      }else{
        return false;
      }
  }
}

// The agent bot decides which bot the request should be redirected to and updates that in context variable.
// Get worspace_id for redirected bot details so messages can be sent to that bot
function getDestinationBot(context){
  var destination_bot = null;
  if( context && context.destination_bot ){
    destination_bot = context.destination_bot.toUpperCase();
  }

  var wsId = process.env[ "WORKSPACE_ID_" + destination_bot];

  if( !wsId ){
    wsId = process.env["WORKSPACE_ID_AGENT"];
  }

  if( !destination_bot ){
    destination_bot = "AGENT";
  }

  console.log("Message being sent to: " + destination_bot + " bot");
  return wsId;

  // if( context && context.destination_bot && context.destination_bot.toUpperCase() === "TRAVEL" ){
  //   return process.env['WORKSPACE_ID_TRAVEL'];
  // }else if( context && context.destination_bot && context.destination_bot.toUpperCase() === "WEATHER" ){
  //   return process.env['WORKSPACE_ID_WEATHER'];
  // }else{
  //   return process.env["WORKSPACE_ID_AGENT"];
  // }
}
/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Assistant service
 * @param  {Object} response The response from the Assistant service
 * @return {Object}          The response with the updated message
 */
function updateMessage(input, response) {
  var responseText = null;
  if (!response.output) {
    response.output = {};
  } else {
    console.log("Response message: " + JSON.stringify(response.output.text));
    return response;
  }
  if (response.intents && response.intents[0]) {
    var intent = response.intents[0];
    // Depending on the confidence of the response the app can return different messages.
    // The confidence will vary depending on how well the system is trained. The service will always try to assign
    // a class/intent to the input. If the confidence is low, then it suggests the service is unsure of the
    // user's intent . In these cases it is usually best to return a disambiguation message
    // ('I did not understand your intent, please rephrase your question', etc..)
    if (intent.confidence >= 0.75) {
      responseText = 'I understood your intent was ' + intent.intent;
    } else if (intent.confidence >= 0.5) {
      responseText = 'I think your intent was ' + intent.intent;
    } else {
      responseText = 'I did not understand your intent';
    }
  }
  response.output.text = responseText;
  return response;
}

module.exports = app;
