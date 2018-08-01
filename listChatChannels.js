const express = require('express')
const app = express()
const config = require('./config');
const request = require('request');

app.get('/', (req, res) => {

    //this will check if the code parameter is in the url, if not the most likely case is that this is the user's inital visit to oauth and we need to redirect them (Step 1)
    //if there is a code, it most likely means they were redirected here from zoom oauth screen

    if (req.query.code) {

        // List chat channels
        let url = 'https://zoom.us/oauth/token?grant_type=authorization_code&code=' + req.query.code + '&redirect_uri=' + config.redirectUrl;

        //STEP 3
        //we need to exchange the code for a oauth token
        request.post(url, function (error, response, body) {

            //the response should be a JSON payload
            body = JSON.parse(body);

            //get refresh token
            let refresh_token = body.refresh_token

            if (body.access_token) {

                //STEP 4 
                //we can now use the access token to make API calls

                /* 
                    List Channels /GET v2/im/users/{user-id}/channels 
                */
                var options = { method: 'GET',
                                url: 'https://api.zoom.us/v2/im/users/<user-id>/channels',
                                headers: 
                                { 
                                    Authorization: 'Bearer ' +  body.access_token 
                                    } 
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
 