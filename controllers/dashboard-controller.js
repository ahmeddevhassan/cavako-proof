const CampaignModel = require('../models/campaign-model');
const GoalModel = require('../models/goal-model');
const IntegrationModel = require('../models/integration-model');
const mongoDb = require('../helpers/mongo-helpers/mongo-helpers');
const campaignHelper = require('../helpers/mongo-helpers/campaign-helper');
const funnelToolSetting = require('../models/funnel-setting-model');
const funnelSetupModel = require('../models/funnel-setup-model');
const gifObj = require('../models/gif-funnel-model');
//funnelSetupModel
module.exports = {
    dashboard_Stats: async (req, res, next) => {
        const data = {
            userId: req.body.userId
        };
        campaignHelper.getDashboardStats(data, 'week1').then(cRes => {
            console.log('response from helper', cRes);
            campaignHelper.getDashboardStats(data, 'week2').then(wRes => {
                const payload = {
                    weekOne: cRes,
                    weekTwo: wRes,
                };
                res.status(200).send({payload, status: 200});
            });
        });
    }
}
