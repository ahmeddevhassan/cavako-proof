const GoalModel = require('../../models/goal-model');
const CampaignModel = require('../../models/campaign-model');
const VisitorModel = require('../../models/visitor-model');
const mongoose = require('mongoose');

module.exports = {
    check_add_new_visitor: async(fingerprint, data) => {
        const visitorCheck = await VisitorModel.findOne({
            visitorId:  fingerprint.hash,
            pixelId: data.pixelId,
            domainOrigin: data.domainOrigin,
            campaignId: data.campaignId
        });
        if(visitorCheck) {
            return visitorCheck;
        }
        const body = {
            pixelId: data.pixelId,
            domainOrigin: data.domainOrigin,
            domainRef: data.domainRef,
            tool: data.tool,
            campaignId: data.campaignId || undefined,
            visitorId: fingerprint.hash,
            visitorDetails: fingerprint.components,
        };
        const visitor = new VisitorModel(body);
        return await visitor.save().then(fullfilled=> {
            return fullfilled;
        }).catch(err=>{
            return err;
        });
    },
};
