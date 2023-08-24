const GoalModel = require('../models/goal-model');
const CampaignModel = require('../models/campaign-model');
const mongoDb = require('../helpers/mongo-helpers/mongo-helpers');
const IntegrationHelper = require('../helpers/mongo-helpers/integration-helper-campaign');
const IntegrationModel = require('../models/integration-model');
const mongoose = require('mongoose');
const request = require("request");
module.exports = {
    /*createIntegrationCampaignController: async (req, res, next) => {
        const data = req.body;
        await IntegrationHelper.add_New_Integration(data).then(fres => {
            const response = {
                payload: fres,
                message: 'Integration Added Successfully',
                status: 200
            };
            res.status(200).send(response);
        }).catch(err => {
            console.log('res error', err);
            res.status(500).send({message: `error while adding goal `});
        });
    },*/
    createCustomField: async (req, res, next) => {
        const data = req.body;
        const response = await customFieldAdd(data);
        console.log('responses', response);
        if (response.errors) {
            res.status(500).send({message: response.errors});
        } else if (!response.errors) {
            res.status(200).send({message: 'field Added', response});
        }

    },
    createWebHook: async (req, res, next) => {
        const data = req.body;
        const response = await addWebHook(data);
        console.log('responses webhook', response);
        if (response.errors) {
            res.status(500).send({message: response.errors});
        } else if (!response.errors) {
            res.status(200).send({message: 'WebHook Added', response});
        }

    },
    loadUserCampaigns: async (req, res, next) => {
        const userId = req.query.userId;
        console.log('userId', userId);
        const arrayTrigger = [];
        const query = {"userProfile.userId": userId, campaignStatus: 'ACTIVE', campaignType: 'FUNNEL'};// query to fetch all campaign by one user.
        const campaign = await CampaignModel.find(query).sort({createdDateTime: -1});
        campaign.forEach((element, index) => {
            const body = {
                id: element.campaignId,
                campaignId: element.campaignId,
                campaignName: element.campaignName,
                variantId: element.variants[0]
            };
            arrayTrigger.push(body);
        });
        console.log('campaign Data altered data', arrayTrigger);
        res.status(200).send(arrayTrigger);
    },
    triggerWebHook: async (req, res, next) => {
        const userId = req.query.userId;
        console.log('zapier action body', req.body, req.query);
        const query = {"userProfile.userId": userId, campaignStatus: 'ACTIVE'};// query to fetch all campaign by one user.
        /*const campaign = await CampaignModel.find(query).sort({createdDateTime: -1});*/
        res.status(200).send({message: 'webhook triggered from cavako'});
    }


}
;

const requestOptions = (method, apiKey, apiUrl, body) => {
    return {
        method: method,
        headers: {
            "Api-Token": apiKey
        },
        url: `${apiUrl}`
    };
};

const contactObject = (body) => {
    return {
        "field": {
            "type": "text",
            "title": body.title,
            "descript": "Field description",
            "isrequired": 1,
            "perstag": "Personalized Tag",
            "defval": "Defaut Value",
            "visible": 1,
            "ordernum": 1
        }
    }
};
const webHookObject = (body) => {
    return {
        "webhook": {
            "title": body.name,
            "name": body.name,
            "url": body.webHookUrl,
            "events": [
                "subscribe",
                "unsubscribe",
                "sent"
            ],
            "sources": [
                "public",
                "system"
            ]
        }
    }
};

async function customFieldAdd(data) {
    let options = requestOptions('POST', data.apiKey, data.integrationUrl);
    let objectField = contactObject({title: data.fieldTitle});
    options['json'] = true;
    options['body'] = objectField;

    return new Promise(function (resolve, reject) {
        // Do async job
        request.post(options, function (err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    });
}

async function addWebHook(data) {
    let options = requestOptions('POST', data.apiKey, data.integrationUrl);
    let objectField = webHookObject({name: data.fieldTitle, webHookUrl: data.webHookUrl});
    options['json'] = true;
    options['body'] = objectField;

    return new Promise(function (resolve, reject) {
        // Do async job
        request.post(options, function (err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    });
}
