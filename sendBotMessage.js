const express = require('express')
const app = express()
const config = require('./config');
const request = require('request');

 app.get('/', (req, res) => {
     //this will check if the code parameter is in the url, if not the most likely case is that this is the user's inital visit to oauth and we need to redirect them (Step 1)
    //if there is a code, it most likely means they were redirected here from zoom oauth screen
     if (req.query.code) {
         // Send bot message
        let url = 'https://zoom.us/oauth/token?grant_type=client_credentials&client_id=' + config.clientID + '&client_secret=' + config.clientSecret;
         //STEP 3
        //we need to exchange the code for a oauth token
        request.post(url, function (error, response, body) {
             //the response should be a JSON payload
            body = JSON.parse(body);
      
             if (body.access_token) {
                 //STEP 4 
                //we can now use the access token to make API calls
                /* 
                    Send Bot Message /POST v2/im/chat/messages 
                */
                var options = { method: 'POST',
                                url: 'https://api.zoom.us/v2/im/chat/messages',
                                headers: { 
                                    Authorization: 'Bearer ' + body.access_token,
                                    'Content-Type': 'application/json' 
                                },
                                body: { 
                                  robot_jid: '<bot-jid>', //located in marketplace, bot JID 
                                  to_jid: '<group-ID>', //group jid
                                  account_id: '<user-account-id>', //user account ID
                                  content: '<message-content>' //message to be group  
                                },
                                json: true 
                            };
                         request(options, function (error, response, body) {
                          if (error) throw new Error(error);
                           console.log(body);
                        });
             
            } else {
                //handle error, something went wrong
                 console.log('something went wrong')
            }
         }).auth(config.clientID, config.clientSecret);
         return;
    }
     //STEP 2
    //no code provided, so redirect the user to get the code
    res.redirect('https://zoom.us/oauth/authorize?response_type=code&client_id=' + config.clientID + '&redirect_uri=' + config.redirectUrl);
});
 app.listen(3000, () => console.log('Zoom chat bot sample app listening on port 3000!'))
