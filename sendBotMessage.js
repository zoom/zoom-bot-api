const express = require('express')
const app = express()
const config = require('./config');
const request = require('request');

app.get('/', (req, res) => {

        //STEP 1 -  For Server to Server Integration
        // Send bot message
        let url = 'https://zoom.us/oauth/token?grant_type=client_credentials&client_id=' + config.clientID + '&client_secret=' + config.clientSecret;

        //STEP 2
        //we need to exchange the code for a oauth token
        request.post(url, function (error, response, body) {

            //the response should be a JSON payload
            body = JSON.parse(body);

            //get refresh token
            let refresh_token = body.refresh_token

            if (body.access_token) {

                //STEP 3 
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
});

app.listen(3000, () => console.log('Zoom chat bot sample app listening on port 3000!'))
 