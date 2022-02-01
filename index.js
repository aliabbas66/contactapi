//Import the express dependency
const express = require('express');

const admin = require("firebase-admin");

const { getAuth } = require("firebase-admin/auth");

const serviceAccount = require("./service/surge-bb99e-firebase-adminsdk-3fs68-9fa14c024e.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://surge-bb99e-default-rtdb.firebaseio.com"
});

const onReadUser = (uid, res) => {
    getAuth()
        .getUser(uid)
        .then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
           // console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
           // console.log(userRecord.toJSON());
           res.send(userRecord.toJSON());

        })
        .catch((error) => {
            console.log('Error fetching user data:', error.message);
            res.send(error.message);
        });
};

const onBlockUser = (uid, res) => {
    getAuth()
        .updateUser(uid, {
            disabled: true,
        })
        .then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
           // console.log('Successfully updated user', userRecord.toJSON());
            res.send(userRecord.toJSON());
        })
        .catch((error) => {
            console.log('Error updating user:', error);
            res.send(error.message);
        });
}
const onUnblockUser = (uid, res) => {
    getAuth()
        .updateUser(uid, {
            disabled: false,
        })
        .then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
          //  console.log('Successfully updated user', userRecord.toJSON());
            res.send(userRecord.toJSON());
        })
        .catch((error) => {
            console.log('Error updating user:', error);
            res.send(error.message);
        });
}


const ondeleteUser = (uid, res) => {
    getAuth()
        .deleteUser(uid)
        .then(() => {
            console.log('Successfully deleted user');
            let response = [200, "Successfully deleted user"];
            let responser = {status:200, message:"Successfully deleted user"};
            res.send(responser);
        })
        .catch((error) => {
            console.log('Error deleting user:', error);
            let responser = {status:400, message: error.message};
            res.send(responser);
        });
}
console.log('list of user');

const onlistAllUsers = (res) => {
    // List batch of users, 1000 at a time.
    getAuth()
        .listUsers(1000)
        .then((listUsersResult) => {
            res.send(listUsersResult);

        })
        .catch((error) => {
            console.log('Error listing users:', error);
            res.send(error.message);
        });
};
// Start listing users from the beginning, 1000 at a time.


//onReadUser('enn8F7MZAGSkPNqFHhXSGPOXl813');

const app = express();              //Instantiate an express app, the main work horse of this server
const port = process.env.PORT || 8080;                  //Save the port number where your server will be listening
app.use(express.json()); // It parses incoming requests with JSON payloads and is based on body-parser

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Importing the fb business sdk dependency.
const bizSdk = require('facebook-nodejs-business-sdk');

// Access Token .
let access_token = 'EAAGn8ZC8UjGMBAD2zT38xJGBKsuoWyeDW3uEV20lZCthUPSXcRDPD1JIm6zKjkAuKCv338VfuurI3uYxyO9Wo4BDjoMbgaUl3AC4BUho8baZCpM8HMRvHj0ncqEZBPxqKCxyoZAxwSTMGClQP5WdOoNyIKqlBtltkMNrXZBanQvsARI1rb8Gwy7uJ4tJBmgUDd6LZAnTLoCvAZDZD';

// Account Id to add.
// let ad_account_id = 'act_451318816611942';
// let ad_account_id = 'act_231039647562725';

// let ad_account_id = 'act_231039647562725';

// Getting Some Objects from fb sdk..
const AdAccount = bizSdk.AdAccount;
const AdsInsights = bizSdk.AdsInsights;
const Campaign = bizSdk.Campaign;

// My App Secrete and app Id.
// let app_secret = '3ced430ce27fc9e0684c1f0fbbd7a91d';
// let app_id = '466141375138915';

// instantiating an api and AdAccount objects.
const api = bizSdk.FacebookAdsApi.init(access_token);


const getfdata = (id, res) => {
    const account = new AdAccount(id);

// Setting this below to true shows more debugging info.
    const showDebugingInfo = true;
    if (showDebugingInfo) {
        api.setDebug(true);
    }

    /*
    * Clicks, Impressions, Reach, CTR, Messages, On-Facebook Leads, CPM, CPC
    * */

// Dummy Endpoints for
// getting campaign and Insight with details ...
// act_231039647562725/campaigns?fields=name,id,daily_budget,insights{clicks,campaign_name,cpc,cpm,reach,spend,ctr,impressions,conversions}

// console.log(account.id);

// fields to get
    const fields = [
        'name',
        'id',
        'daily_budget',
        ' insights{clicks,campaign_name,cpc,cpm,reach,spend,ctr,impressions,conversions,cost_per_inline_post_engagement}',
    ];

// Parameters to modify the request.
    const params = {
        'time_range' : {'since':'2021-12-08','until':'2022-01-07'},
        'filtering' : [],
        'level' : 'campaign',
        'breakdowns' : [],
    };

    account.getCampaigns(fields, { limit: 10 })
        .then((campaigns) => {
            for (let i = 0; i < campaigns.length; i++) {
                books.push(campaigns[i]._data);
            }
            // console.log(campaigns[0]._data);
            // console.log(campaigns[0]._data.insights);
            res.send(books);
            /*  if (campaigns.length >= 2 && campaigns.hasNext()) {
                  return campaigns.next();
              } else {
                  Promise.reject(
                      new Error('campaigns length < 2 or not enough campaigns')
                  );
              } */
        })
        .catch((error) => {
            console.log(error);
        });

}





app.get('/', (req, res) => {
    res.send('Welcome to Surge Connects.');
});

const books = [

];

app.get('/api/campaignsttt', (req,res)=> {
    res.send(books);
});


app.get('/api/campaigns', (req, res)=> {

    const id = req.query.id;
    getfdata(id, res);
    // books.push(id);
});

app.get('/api/readUser', (req, res)=> {

    const id = req.query.id;
    onReadUser(id, res);
    // books.push(id);
});

app.get('/api/delUser', (req, res)=> {

    const id = req.query.id;
    ondeleteUser(id, res);

});

app.get('/api/blockUser', (req, res)=> {

    const id = req.query.id;
    onBlockUser(id, res);

});

app.get('/api/unblockUser', (req, res)=> {

    const id = req.query.id;
    onUnblockUser(id, res);

});

app.get('/api/unBlockUser', (req, res)=> {

    const id = req.query.id;
    onUnblockUser(id, res);

});

app.get('/api/listUser', (req, res)=> {

    const id = req.query.id;
    onlistAllUsers(res);
});



app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});