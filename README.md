# zoom-bot-api

> This is a sample app that uses your Zoom Bot created in the marketplace to to call Zoom's API. 

## Getting Started

### Install

Clone the repo using git clone.
` git clone https://github.com/zoom/zoom-bot-api.git`

> Install the dependent node modules.
``` npm install ```

### Quick Start


> In the config.js file, input your Marketplace clientID, clientSecret, and redirectUrl credentials.
``` const config = {
        production:{	
        clientID : '',
        clientSecret : '',
        redirectUrl: ''
	      }
    };
```
> Set your environment varaibles.
` export NODE_NEV=[environment name] (e.g. export NODE_NEV=production) `

> Start the node app depending on the corresponding api file. 
` node sendBotMessage.js ` or ` node listChatChannels.js `

### For more Information about Zooms Bot and APIs
Documentation is available on the [Zoom REST API for IM chat](https://devdocs.zoom.us/v1.0/reference#im-chat-1)
