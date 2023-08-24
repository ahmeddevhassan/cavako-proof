const CampaignModel = require('../../models/campaign-model');
const CheckListModel = require('../../models/campaign-check-list');
const VisitorModel = require('../../models/visitor-model');

module.exports = {
    updateChecklist: async (data) => {
        const checkList = await CheckListModel.findOne({userId: data.userId, campaignId: data.campaignId});
        checkList.pixelTracking = data.pixelTracking || checkList.pixelTracking;
        checkList.checkListIntegration = data.checkListIntegration || checkList.checkListIntegration;
        checkList.emailTemplates = data.emailTemplates || checkList.emailTemplates;
        if(data.deleteIntegration === true) {
            checkList.checkListIntegration = null;
        }
        const newCheckList = new CheckListModel(checkList);
        return await newCheckList.save().then(fullfilled => {
            return fullfilled;
        }).catch(err => {
            return err;
        });
    },
    createChecklist: async (data) => {
        const newCheckList = new CheckListModel(data);
        return await newCheckList.save().then(fullfilled => {
            return fullfilled;
        }).catch(err => {
            return err;
        });
    },
    checkListDetectPixelByUrl: async (data) => {
        let pixelDetected = false;
        const offerPageUrl  = data.urls;
       const replaceReg = /^(?:https?:\/\/)?(?:www\.)?|\/^\/|\/$/ig;
        return await VisitorModel.find({pixelId: data.userId, campaignId: data.campaignId}).then(resp => {
            resp.forEach(element => {
                const replacedUrl = element.domainRef.replace(replaceReg, '');
                if (replacedUrl === offerPageUrl[0].replace(replaceReg, '')) {
                    console.log('pixel Detected', replacedUrl, offerPageUrl[0].replace(replaceReg, ''));
                    pixelDetected = true;
                }
            });
            return pixelDetected;
        }).catch(err => {
            return err
        })
    },
    getOfferAndDisplayUrls: async (data) => {
        const campaign = await CampaignModel.findOne({ campaignId: data.campaignId }).populate([
            {
                path: 'variants',
                populate: [{
                    path: 'settingId',
                    model: 'funnelToolSetting',
                }],


            }]).catch(error => { return error });
        const displayArray = campaign.variants[0].settingId;

        return {
            settings: displayArray,
            variants: campaign.variants[0]
        }

    }

}
