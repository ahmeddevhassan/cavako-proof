const GoalModel = require('../../models/goal-model');
const CampaignModel = require('../../models/campaign-model');
const VisitorModel = require('../../models/visitor-model');
const ClicksModel = require('../../models/clicks-model');
const DataRecentModel = require('../../models/data-recent-model');
const GoalCompletionModel = require('../../models/goalCompletion-model');
const impressionsModel = require('../../models/impressions-model');
const funnelImpressionsModel = require('../../models/funnel-ipmressions-model');
const funnelTriggersModel = require('../../models/campaign-trigger-count-model');
const {forEach} = require('p-iteration');
const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');
var Crisp = require("node-crisp-api");
var CrispClient = new Crisp();
let identifier = "cbc17944-6245-4985-9928-c3a7a4d02160";
let key = "d6c484ba4b38f734e6d09cac079f35310ba7688f0477566d339f6415f694b79c";
let websiteId = "905714fe-0f0d-48fc-a985-9c08fbf97c96";
CrispClient.authenticate(identifier, key);


module.exports = {
    getCampaignStats: async (data) => {
        const query = {
            createdDateTime: { $gte: new Date(new Date().setDate(new Date().getDate() - `${data.fromDays}`)) },
            pixelId: mongoose.Types.ObjectId(data.userId),
            campaignId: mongoose.Types.ObjectId(data.campaignId)
        };
        const goalsQuery = {
            createdDateTime: { $gte: new Date(new Date().setDate(new Date().getDate() - `${data.fromDays}`)) },
            pixelId: mongoose.Types.ObjectId(data.userId),
            campaignId: mongoose.Types.ObjectId(data.campaignId),
            goalId: mongoose.Types.ObjectId(data.goal.goalId)
        };
        const goalsData = await GoalCompletionModel.aggregate([
            { $match: data.goal ? goalsQuery : query },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdDateTime" } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },

        ]);
        const clicksData = await ClicksModel.aggregate([
            { $match: query },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdDateTime" } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },

        ]);
        const impressionsData = await impressionsModel.aggregate([
            { $match: query },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdDateTime" } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },

        ]);
        const visitorsData = await VisitorModel.aggregate([
            { $match: query },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdDateTime" } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]);
        const conversionsData = await DataRecentModel.aggregate([
            { $match: query },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdDateTime" } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]);
        const array = [];
        let j = data.fromDays;
        for (let i = 0; i <= data.fromDays; i++) {
            const date = new Date(new Date().setDate(new Date().getDate() - `${j}`));
            array.push({ _id: moment(date).format('YYYY-MM-DD'), count: 0 });
            j--;
        }
        // merge array using reduce by key _id;
        const goals = Object.values(
            [].concat(array, goalsData)
                .reduce((r, c) => (r[c._id] = Object.assign((r[c._id] || {}), c), r), {})
        );
        const clicks = Object.values(
            [].concat(array, clicksData)
                .reduce((r, c) => (r[c._id] = Object.assign((r[c._id] || {}), c), r), {})
        );
        const impressions = Object.values(
            [].concat(array, impressionsData)
                .reduce((r, c) => (r[c._id] = Object.assign((r[c._id] || {}), c), r), {})
        );

        const visitors = Object.values(
            [].concat(array, visitorsData)
                .reduce((r, c) => (r[c._id] = Object.assign((r[c._id] || {}), c), r), {})
        );
        const conversions = Object.values(
            [].concat(array, conversionsData)
                .reduce((r, c) => (r[c._id] = Object.assign((r[c._id] || {}), c), r), {})
        );
        const conversionsPercent = goals.map(function (n, i) {
            let count = Math.round((n.count / visitors[i].count) * 100);
            if (n.count > visitors[i].count || n.count === 0) {
                count = 0;
            }
            return { _id: n._id, count }
        });
        const clickThroughPercent = clicks.map(function (n, i) {
            let count = Math.round((n.count / impressions[i].count) * 100);
            if (impressions[i].count === 0) {
                count = 0;
            }
            return { _id: n._id, count }
        });
        return { clicks, visitors, conversions, goals, conversionsPercent, impressions, clickThroughPercent }

    },
    detectProgress: async (data) => {
        const query = { "userProfile.userId": data.userId, campaignStatus: 'ACTIVE' };
        const campaignCountFunnel = await CampaignModel.countDocuments({"userProfile.userId": data.userId, campaignStatus: 'ACTIVE' , campaignType: 'FUNNEL'});
        const campaignCountSocial = await CampaignModel.countDocuments({"userProfile.userId": data.userId, campaignStatus: 'ACTIVE' , campaignType: 'PROOF'});
        const pixelDataCount = await VisitorModel.countDocuments({ pixelId: data.userId });
        const captureDataCount = await DataRecentModel.countDocuments({ pixelId: data.userId });
        let peopleId = data.email;
        if (pixelDataCount > 0) {
            // user event PixelInstalled
            let data = {
                text: "PixelInstalled",
                data: {
                    SignUpInComplete: false,
                    SignUpComplete: true,
                    PixelInstalled: true,
                }
            };
            let flag = 1;
            let response = await CrispClient.websitePeople.listPeopleEvent(websiteId, peopleId, 1).catch(error => { return error });
            if (response && response.length > 0) {
                response.map(key => {
                    if (key.text == "PixelInstalled") {
                        flag = 0;
                        return;
                    }
                })
                console.log("flag", flag);
            }
            if (flag) {
                let add = await CrispClient.websitePeople.addPeopleEvent(websiteId, peopleId, data).catch(error => { return error });
            }
            // console.log("response", response);
        }
        return {
            campaignCountFunnel,
            campaignCountSocial,
            pixelDataCount,
            captureDataCount
        };
    },
    getCampaignContacts: async (data) => {
        const recentData = await DataRecentModel.find({ pixelId: data.userId, campaignId: data.campaignId });

        const contactsArray = [];
        recentData.forEach((recent, index) => {
            contactsArray.push(recent.notificationData);
        });
        return _.uniqBy(contactsArray, 'email');
    },
    getVisitorsOnly: async (data) => {
        return await VisitorModel.countDocuments({ pixelId: data.userId });
    },
    getDashboardStats: async (data, type) => {
        let query;
        if(type === 'week2') {
             query = {
                 createdDateTime: { $gte: new Date(new Date().setDate(new Date().getDate() - 127)), $lt: new Date(new Date().setDate(new Date().getDate() - 120)) },
                 pixelId: mongoose.Types.ObjectId(data.userId),
            };
        }else {
             query = {
                 createdDateTime: { $gte: new Date(new Date().setDate(new Date().getDate() - 120)) },
                 pixelId: mongoose.Types.ObjectId(data.userId),
            };
        }
        let funnelClicks = 0;
        let funnelVisits = 0;
        let socialClicks = 0;
        let socialVisits = 0;
        let socialGoalCompletions = 0;
        let funnelGoalCompletions = 0;


       const visitorsCampaigns =  await VisitorModel.find(query);
        const clicksCampaigns =  await ClicksModel.find(query);
        const goalCompletionsCampaigns =  await GoalCompletionModel.find(query);
        await forEach(goalCompletionsCampaigns, async (elem) => {
            if(elem.campaignId === null ) {
                return;
            }
            const campaign =  await CampaignModel.findOne({campaignId: mongoose.Types.ObjectId(elem.campaignId)});
            if(campaign && campaign.campaignType === 'FUNNEL') {
                funnelGoalCompletions = funnelGoalCompletions + 1
            } else {
                socialGoalCompletions = socialGoalCompletions + 1
            }
        }).then(resProm => {
            console.log('while sending response 1', {funnelVisits, funnelClicks, socialVisits, socialClicks, socialGoalCompletions, funnelGoalCompletions});
        });
       await forEach(visitorsCampaigns, async (elem) => {
           if(elem.campaignId === null ) {
               return;
           }
           const campaign =  await CampaignModel.findOne({campaignId: mongoose.Types.ObjectId(elem.campaignId)});
           if( campaign && campaign.campaignType === 'FUNNEL') {
               funnelVisits = funnelVisits + 1
           } else {
               socialVisits = socialVisits + 1
           }
       }).then(resProm => {
           console.log('while sending response 1', {funnelVisits, funnelClicks, socialVisits, socialClicks, socialGoalCompletions, funnelGoalCompletions});
       });
       return await forEach(clicksCampaigns, async (elem) => {
            if(elem.campaignId === null ) {
                return;
            }
            const campaign =  await CampaignModel.findOne({campaignId: mongoose.Types.ObjectId(elem.campaignId)});
            if(campaign && campaign.campaignType === 'FUNNEL') {
                funnelClicks += funnelClicks
            } else {
                socialClicks += socialClicks
            }
        }).then(async (resProm) => {
            const socialImpressions = await impressionsModel.countDocuments(query);
            const funnelImpressions = await funnelImpressionsModel.countDocuments(query);
            const funnelTriggers = await funnelTriggersModel.countDocuments(query);
            console.log('while sending response 2', {funnelVisits, funnelClicks, socialVisits, socialClicks, socialImpressions, funnelImpressions, funnelTriggers, socialGoalCompletions, funnelGoalCompletions});
           return {funnelVisits, funnelClicks, socialVisits, socialClicks, socialImpressions, funnelImpressions, funnelTriggers, socialGoalCompletions, funnelGoalCompletions};
        });
    },
    getCampaignCardsStateSocial: async (data) => {
        const query= {pixelId: mongoose.Types.ObjectId(data.userId),
            campaignId: mongoose.Types.ObjectId(data.campaignId)};
        const conversions=  await GoalCompletionModel.countDocuments(query);
        const visits=  await VisitorModel.countDocuments(query);
        return {conversions, visits}
    },
    getCampaignCardsStateFunnel: async (data) => {
        const query= {pixelId: mongoose.Types.ObjectId(data.userId),
            campaignId: mongoose.Types.ObjectId(data.campaignId)};
        const conversions=  await GoalCompletionModel.countDocuments(query);
        const visits=  await funnelTriggersModel.countDocuments(query);
        return {conversions, visits}
    },

};

