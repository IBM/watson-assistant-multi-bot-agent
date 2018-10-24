# **Work in progress**

# watson-assistant-multi-bot-agent

## Bots Compose - Agent Bot to redirect messages to specific Bots

Generally bots address queries related to a specific domain or topic. If a user wants to query for something from a different domain then the user will have to switch to a different bot and ask question. E.g. If I want to travel to a place, I might query for weather and also book a cab or flight. I might have to end up switching between two bots, weather bot and travel bot. What if I could just have one interface bot which will redirect my messages to a specific bot and get answers to me? Well, this code pattern showcases an implementation of this approach.

The solution here is to have an agent bot (or an interface bot) and a few other bots which can handle queries for a specific domain, let's call these specific bots. The agent bot knows about the specific bots and also about which domain each of them can handle. When user initiates conversation with agent bot, the agent bot will understand the intent of user query and it will redirect the user query to a specific bot. Subsequent requests from user are redirected to specific bot. When the conversation with the specific bot is over or when the specific bot is not able to handle the request, the control is given back to agent bot which will then redirect the messages to appropriate bot.

This approach provides and seamless experience for the user. It can be used by organisations which provide a host of services to its customers like financial services, tours and travel agencies, news agencies etc..

Advantages with this approach are:
- plug and play the bots
- Modular approach facilitates bots composition
- Come up with new services by composing two or more bots
- Easy to maintain, make changes, add/remove functionalities
- Easy to troubleshoot issues
- Transparent to user

In this code pattern we will use Watson assistant bot for building bots and Nodejs application as orchestration layer.

<TODO> When you complete this code pattern, you will learn
1.
2.
</TODO>

## Watch the Overview Video

Coming soon!!!

## Flow

![Architecture](images/Architecture.png)

1. User accesses web application and types in a message. Nodejs application, an orchestration later, send user message to agent bot
2. Agent bot determines the intent of the message and responds with the specific bot details to which the message needs to be redirected.
3. Nodejs application sends message to the specific bot (Weather Bot, in this case). Specific bot responds. Conversation continues between user and specific bot.
4. When the conversation with specific bot is over, user message is then sent to agent bot to determine the intent
5. Nodejs application sends message to the specific bot (Travel Bot, in this case). Specific bot responds. Conversation continues between user and specific bot.


## Included components

* [Watson Assistant](https://console.bluemix.net/catalog/services/watson-assistant-formerly-conversation): Add a natural language interface to your application to automate interactions with your end users. Common applications include virtual agents and chat bots that can integrate and communicate on any channel or device.
* [SDK of Node.js](https://console.bluemix.net/docs/runtimes/nodejs/index.html#nodejs_runtime): The Node.js runtime on IBM® Cloud is powered by the sdk-for-nodejs buildpack. The sdk-for-nodejs buildpack provides a complete runtime environment for Node.js apps.


## Featured technologies


## Prerequisites
- IBM Cloud Account: If you do not have an IBM Cloud account already, then create one [here](https://console.bluemix.net/registration/).
- Git: If not already setup, [download and install git](https://git-scm.com/downloads).
- IBM Cloud CLI: If not already setup, [install IBM Cloud CLI](https://console.bluemix.net/docs/cli/reference/ibmcloud/download_cli.html#install_use).

## Steps

1. Clone git repo
2. Create bots.
3. Configure application with bots details.
4. Deploy application to IBM Cloud.
5. Run the application.

### 1. Clone git repo

- On command prompt run the below command to clone the git repo.
```
git clone git@github.com:IBM/watson-assistant-multi-bot-agent.git
```
or
```
git clone https://github.com/IBM/watson-assistant-multi-bot-agent.git
```
run `cd watson-assistant-multi-bot-agent` to change directory to project parent folder


### 2. Create bots

#### 2.1 Create Watson Assistant service instance
- Click this [link](https://console.bluemix.net/catalog/services/watson-assistant-formerly-conversation) to create Watson assistant service.
- Enter the service name as `wbc-Watson Assistant (formerly Conversation)-bots`. You can choose to enter any name you like.
- Ensure you select the right region, organisation and space.
- Under `Pricing Plans`, select `Lite` plan.
- Click `Create`.
- Watson Asistant service instance should get created.

#### 2.2 Import json files of different bots
- Go to IBM Cloud dashboard and click on the Watson Assistant service instance created in above steps.
- On the Assistant Dashboard, click `Launch Tool`.

![LaunchTool](images/launch_tool.png)

- Click `Workspaces` tab.

![Workspaces](images/workspaces.png)

- Click `Import workspace` button.

![ImportWorkspace](images/import_workspace.png)

- Click on `Choose a file`.
- Browse to the cloned repository parent folder -> WA.
- Select `agent-bot.json` and click `Open`.
- Under `Import`, select the option `Everything (Intents, Entities, and Dialog)`.

![ImportAWorkspace](images/import_a_workspace.png)

- Click `Import` button.
- Repeat above steps in section 2.2 Import json files of different bots to import `travel_bot.json` and `weather_bot.json`.

### 3. Configure application with bots details

- Go to IBM Cloud dashboard and click on the Watson Assistant service instance.
- On the Assistant Dashboard, click `Launch Tool`.
- Click `Workspaces` tab.
- On `agentBot` click `actions`, the three vertical dots on the top right corner.

![BotActions](images/bot_actions.png)

- Click `View Details`.
- Copy and save workspace id for later use.
- Repeat above steps in section 3 Configure application with bots details for all the other bots also.
- Go to IBM Cloud dashboard and click on the Watson Assistant service instance.
- Click `Service Credentials` on the left hand navigation bar.

![ServiceCredentialsLink](images/service_credentials_link.png)

- Click on `View Credentials`.

![ViewCredentials](images/view_credentials.png)

- Copy `url`, `username` and `password` and save them for later use.



# Summary


# Troubleshooting

See [Debugging.md](./Debugging.md)


# License

[Apache 2.0](LICENSE)
