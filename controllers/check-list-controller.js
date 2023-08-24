const CampaignModel = require('../models/campaign-model');
const CheckListModel = require('../models/campaign-check-list');
const IntegrationModel = require('../models/integration-model');
const campaignHelper = require('../helpers/mongo-helpers/campaign-helper');
const checkListHelper = require('../helpers/mongo-helpers/check-list-helper');
const mongoose = require('mongoose');

var cheerio = require('cheerio');
module.exports = {
    loadCheckListDetails: async (req, res, next) => {
        const body = req.body;
        const userId = req.body.userId;
        const campaignId = req.body.campaignId;
        let checkList;
        const campaign = await CampaignModel.findOne({campaignId: campaignId}).catch(error => {
            return error
        });
        checkList = await CheckListModel.findOne({ campaignId: campaignId }).catch(error => { return error });
        const campaignSettings = await checkListHelper.getOfferAndDisplayUrls(body).catch(error => { return error });
        if(checkList === null) {
            await checkListHelper.createChecklist(body).then(cRes =>{
                checkList = cRes;
            });
        }

        const response = {
            payload: {
                campaign,
                checkList,
                campaignSettings
            },
            status: 200
        };
        res.status(200).send(response);

    },
    addChecklistProgress: async (req, res, next) => {
        const body = req.body;
        await checkListHelper.createChecklist(body).then(hRes => {
            const response = {
                payload: {

                },
                status: 200
            };
            res.status(200).send(response);
        }).catch((err) => {
            res.status(500).send({message: 'something went Wrong'});
        });
    },
    updateChecklistCampaign: async (req, res, next) => {
        const body = req.body;
        console.log('request body', req.body);

        await checkListHelper.updateChecklist(body).then(hRes => {
            const response = {
                payload: {
                    checkList: hRes
                },
                status: 200
            };
            res.status(200).send({message: 'Check list Updated'});
        }).catch((err) => {
            console.log('error in update', err);
            res.status(500).send({message: 'something went wrong'});
        });
    },
    checkIntegrationPresence: async (req, res, next) => {
        const body = req.body;
        console.log('body integration id', body);
         await IntegrationModel.find({userId: body.userId, integrationName: body.integrationName}).then(hRes => {
            const response = {
                payload: {
                    integration: hRes
                },
                status: 200
            };
            res.status(200).send(response);
        }).catch((err) => {
            console.log('error in update', err);
            res.status(500).send({message: 'something went wrong'});
        });
    },



};
