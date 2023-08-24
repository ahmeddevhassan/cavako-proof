const CampaignModel = require('../models/campaign-model');
const GoalModel = require('../models/goal-model');
const SegmentModel = require('../models/segment-model');
const CheckListModel = require('../models/campaign-check-list');
const IntegrationModel = require('../models/integration-model');
const mongoDb = require('../helpers/mongo-helpers/mongo-helpers');
const campaignHelper = require('../helpers/mongo-helpers/campaign-helper');
const funnelToolSetting = require('../models/funnel-setting-model');
const funnelSetupModel = require('../models/funnel-setup-model');
const gifObj = require('../models/gif-funnel-model');
const { forEach } = require('p-iteration');
const _ = require('lodash');
//funnelSetupModel
module.exports = {
    loadCampaigns: async (req, res, next) => {
        const userId = req.body.userId;
        let type = req.body.toolType ? "FUNNEL" : "PROOF";//proof
        const query = { "userProfile.userId": userId, "campaignType": type };// query to fetch all campaign by one user.
        const campaign = await CampaignModel.find(query).populate('variants').sort('createdDateTime');
        const goals = await GoalModel.find({ userId });
        const response = {
            payload: {
                campaign,
                goals
            },
            status: 200
        };
        res.status(200).send(response);
    },
    loadCampaign: async (req, res, next) => {

        const userId = req.body.userId;
        const campaignId = req.body.campaignId;
        const campaign = await CampaignModel.findOne({ campaignId: campaignId }).populate([
            {
                path: 'variants',
                populate: [{
                    path: 'settingId',
                    model: 'funnelToolSetting',
                }, {
                    path: 'setUp',
                    model: 'funnelSetupModel',
                }, {
                    path: 'gifObj',
                    model: 'gifModel',

                }],


            }]).catch(error => { return error });
        console.log("campaign", campaign);

        const goals = await GoalModel.find({ userId: userId });
        const Segment = await SegmentModel.find({ userId: userId });
        const checkList = await CheckListModel.findOne({ campaignId: campaignId });
        const response = {
            payload: {
                campaign,
                goals,
                Segment,
                checkList
            },
            status: 200
        };
        res.status(200).send(response);

    },
    loadCampaignContacts: async (req, res, next) => {
        const data = {
            userId: req.body.userId,
            campaignId: req.body.campaignId
        };
        campaignHelper.getCampaignContacts(data).then(cRes => {
            const response = {
                payload: {
                    contacts: cRes
                },
                status: 200
            };
            res.status(200).send(response);
        });
    },

    loadCampaignStats: async (req, res, next) => {
        const data = {
            userId: req.body.userId,
            campaignId: req.body.campaignId,
            statType: req.body.statType,
            fromDays: req.body.fromDays,
            goal: req.body.goalId
        };
        campaignHelper.getCampaignStats(data).then(cRes => {
            const response = {
                payload: {
                    clicks: cRes.clicks,
                    visitors: cRes.visitors,
                    impressions: cRes.impressions,
                    conversions: cRes.conversions,
                    goals: cRes.goals,
                    clickThroughPercent: cRes.clickThroughPercent,
                    conversionsPercentage: cRes.conversionsPercent
                },
                status: 200
            };
            res.status(200).send(response);
        });
    },

    detectProofProgress: async (req, res, next) => {
        const data = {
            userId: req.body.userId,
            email: req.body.email,
        };
        campaignHelper.detectProgress(data).then(cRes => {
            const response = {
                payload: {
                    progress: cRes
                },
                status: 200
            };
            res.status(200).send(response);
        }).catch((err) => {
            res.status(500).send({ err });
        });
    },

    createCampaign: async (req, res, next) => {
        let campaignName = req.body.campaignName;
        const userId = req.body.userId;
        const bluePrintFlag = req.body.bluePrintFlag ? req.body.bluePrintFlag : 0;
        const campaignType = req.body.campaignType == 'FUNNEL' ? 'FUNNEL' : 'PROOF';
        console.log("campaignType", campaignType);

        let CampaignFlag = null;
        if (campaignName == "New Campaign") {
            const CampaignFlagCount = await CampaignModel.countDocuments({ campaignName: "New Campaign", campaignType: campaignType, "userProfile.userId": userId });
            console.log("CampaignFlagCount funnel ", CampaignFlagCount);
            campaignName = campaignName + (CampaignFlagCount + 1);
        }
        else if (campaignName == "New Campaign") {
            const CampaignFlagCount = await CampaignModel.countDocuments({ campaignName: "New Campaign", campaignType: campaignType, "userProfile.userId": userId });
            console.log("CampaignFlagCount proof", CampaignFlagCount);
            campaignName = campaignName + (CampaignFlagCount + 1);
        }
        else {
            CampaignFlag = await CampaignModel.find({ campaignName: campaignName, campaignType: campaignType, "userProfile.userId": userId, });
            console.log("CampaignFlag->", CampaignFlag);
        }
        if (CampaignFlag && CampaignFlag.length > 0 && !bluePrintFlag) {
            const response = {
                payload: {
                    message: 'Campaign name already exist',
                    status: 400,
                },
                message: 'Campaign name already exist',
                status: 400,
            };
            res.status(400).send(response);
        }
        else {
            const campaign = new CampaignModel({
                userProfile: { userId: userId }, campaignName, campaignType, bluePrintFlag: bluePrintFlag, campaignStatus: 'DRAFT'
            });
            const goals = await GoalModel.find({ userId });
            await campaign.save().then(fullfilled => {
                const response = {
                    payload: {
                        campaign: fullfilled,
                        goals
                    },
                };
                res.status(200).send(response);
            }).catch(err => {
                console.log('Error in campaign Model', err);
            });
        }
    },

    updateCampaign: async (req, res, next) => {
        const data = req.body;
        await mongoDb.updateCampaign_db(data).then(fres => {
            res.status(200).send({ message: 'campaign updated successfully' });
        }).catch(err => {
            console.log('res error', err);
            res.status(500).send({ message: `error while updating Campaign ` });
        });

    },
    updateCampaignFunnel: async (req, res, next) => {
        const data = req.body;
        await mongoDb.updateCampaign_db(data).then(fres => {
            res.status(200).send({ message: 'campaign updated successfully' });
        }).catch(err => {
            console.log('res error', err);
            res.status(500).send({ message: `error while updating Campaign ` });
        });

    },
    deleteGeneric: async (req, res, next) => {
        const data = req.body;
        await mongoDb.deleteGeneric(data).then(fres => {
            res.status(200).send({ message: fres.message ? fres.message : ` ${data.title} deleted successfully` });
        }).catch(err => {
            console.log('error in delete', err);
            res.status(500).send({ message: err.message ? err.message : `error while deleting ${data.title} ` });
        });

    },
    loadCampaignsWithStats: async (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        const userId = req.body.userId;
        let type = req.body.toolType ? "FUNNEL" : "PROOF";//proof
        const query = { "userProfile.userId": userId, "campaignType": type };// query to fetch all campaign by one user.
        let campaigns = await CampaignModel.find(query).populate('variants').sort({ 'createdDateTime': -1 });
        const goals = await GoalModel.find({ userId });
        let CampaignWithStats = [];
        await forEach(campaigns, async (elem, index) => {
            if (elem.campaignType === 'PROOF') {
                const stats = await campaignHelper.getCampaignCardsStateSocial({ userId, campaignId: elem.campaignId });
                const object3 = { ...elem._doc, ...stats };
                CampaignWithStats.push(object3);
            } else if (elem.campaignType === 'FUNNEL') {
                const stats = await campaignHelper.getCampaignCardsStateFunnel({ userId, campaignId: elem.campaignId });
                const object3 = { ...elem._doc, ...stats };
                CampaignWithStats.push(object3);
            }
        }).then(resProm => {
            const response = {
                payload: {
                    CampaignWithStats: _.orderBy(CampaignWithStats, ['createdDateTime'], ['desc']),
                    goals
                },
                status: 200
            };
            res.status(200).send(response)
        });

    },

};
