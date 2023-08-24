const GoalModel = require('../models/goal-model');
const CampaignModel = require('../models/campaign-model');
const Sdk_Settings_Model = require('../models/settings-sdk-test');
const sdk_mongo_helper = require('../helpers/mongo-helpers/sdk-helper');
const visitorHelper = require('../helpers/mongo-helpers/proof-visitors-helper');
const COMMON_MODULE = require('../helpers/common');
const { forEach } = require('p-iteration');


module.exports = {
    loadSdkCredentials: async (req, res, next) => {
        /*const data = req.body;
        const settings = await Sdk_Settings_Model.findOne({pixelId : data.pixelId});*/
        res.status(200).send({ message: 'sdk settings loaded successfully', payload: '', });
    },
    socketTest: async (data) => {
        console.log('socket test data', data)
    },

    // load data against setting
    loadData: async (req, res, next) => {
        const data = req.body;
        const fetchArray = req.body.array;
        data['visitorId'] = req.fingerprint.hash;
        let campaignId;
        let variantId;
        const response = {
            payload: {
                recent_activity_data: [],
                reviews_data: [],
                conversion_count_data: 0,
                real_time_visitors_data: 0,
                campaignId: data.campaignId,
                variantId: data.variantId
            },
            code: 200
        };

        await forEach(fetchArray, async (notification, index) => {
            if (notification['recent_activity']) {
                await sdk_mongo_helper.load_data_recent(notification['recent_activity'], data).then(resRecent => {
                    response.payload.recent_activity_data = resRecent;
                });
            }
            if (notification['conversion_counts']) {
                await sdk_mongo_helper.load_count(notification['conversion_counts'], data).then(resCount => {
                    response.payload.conversion_count_data = resCount;
                });
            }
            if (notification['real_time_visitors']) {
                await sdk_mongo_helper.real_time_visitors_data_count(data).then(resRealCount => {
                    response.payload.real_time_visitors_data = resRealCount;
                });
            }
            if (notification['reviews']) {
                await sdk_mongo_helper.load_reviews_helper(notification['reviews'], data).then(resRecent => {
                    response.payload.reviews_data = resRecent;
                });
            }
        }).then(resProm => {
            console.log('while sending response', response);
            res.status(200).send(response);
        });
    },
    storeDataSocket: async (dataSocket) => {
        let country = dataSocket.geolocation ? dataSocket.geolocation.country : '';
        if (country) {
            country = COMMON_MODULE.Country_Array.find(array => array.code === dataSocket.geolocation.country);
        }
        dataSocket.notificationData.location = country.name || 'somewhere';
        dataSocket.notificationData['countryCode'] = country.code || '';
        await sdk_mongo_helper.store_data_DB(dataSocket).then(storeRes => {
            console.log('check socket data', storeRes)
        });
    },
    storeData: async (req, res, next) => {
        const data = req.body;
        const fingerPrint = req.fingerprint;
        let country;
        if (fingerPrint.components.geoip.country) {
            const country1 = COMMON_MODULE.Country_Array.find(array => array.code === fingerPrint.components.geoip.country);
            country = country1.name;
        }
        data.notificationData.location = country || 'somewhere';
        data.notificationData['countryCode'] = fingerPrint.components.geoip.country;
        data.visitorId = fingerPrint.hash;
        await sdk_mongo_helper.store_data_DB(data).then(storeRes => {
            res.status(200).send({ message: 'sdk data store successfully' });
        });
    },

    storeClicks: async (req, res, next) => {
        const data = req.body;
        data['visitorId'] = req.fingerprint.hash;
        await sdk_mongo_helper.store_clicks_DB(data).then(storeRes => {
            res.status(200).send({ message: 'click stored successfully' });
        });
    },
    storeClicksSockets: async (data) => {
        await sdk_mongo_helper.store_clicks_DB(data).then(storeRes => {
            /*console.log('click socket response', storeRes);*/
        });
    },
    storeGoalCompletion: async (req, res, next) => {
        const data = req.body;
        data['visitorId'] = req.fingerprint.hash;
        await sdk_mongo_helper.store_goalCompletions_DB(data).then(storeRes => {
            /*res.status(200).send({message : 'goal stored successfully'});*/
        });
    },
    storeGoalCompletionSocket: async (data) => {
        await sdk_mongo_helper.store_goalCompletions_DB(data).then(storeRes => {
            /*console.log('storeGoalCompletionSocket socket response', storeRes);*/
        });
    },
    storeImpressions: async (data) => {
        await sdk_mongo_helper.store_impressions_DB(data).then(storeRes => {
            /*console.log('store socket ');*/
        });
    },
    createSDKSettings: async (req, res, next) => {
        const data = req.body;
        const settings = new Sdk_Settings_Model(data);
        await settings.save().then(fres => {
            res.status(200).send({ message: 'Sdk Settings added successfully' });
        }).catch(err => {
            console.log('res error', err);
            res.status(500).send({ message: `error while adding Sdk settings ` });
        });
    },
    testServer: (req, res) => {
        res.status(200).send({ message: 'server campaign is working!' });
    },
    // load settings by display url
    loadOverAllSettings: async (req, res) => {
        // params for fingerPrint  are hash, components.useragent,
        console.log(req.query);
        const dataBody = req.body;
        const domainOrigin = dataBody.domainOrigin;
        const domainRef = dataBody.domainRef;
        const userId = dataBody.pixelId;
        dataBody['tool'] = 'social_proof';
        const displayCampaignSettings = [];
        const displayVariantSettings = [];
        const displayNotificationSettings = [];
        const captureCampaignSettings = [];
        const captureVariantSettings = [];
        const captureNotificationSettings = [];
        const campaignCaptureGoals = [];
        const campaignDisplayGoals = [];
        const captureSettings = await CampaignModel.find({
            campaignCaptureUrls: { $regex: '.*' + domainOrigin + '.*' },
            "userProfile.userId": userId,
            campaignStatus: 'ACTIVE'
        }).populate('variants').sort({ createdDateTime: -1 });
        const displaySettings = await CampaignModel.find({
            campaignDisplayUrls: { $regex: '.*' + domainOrigin + '.*' },
            "userProfile.userId": userId,
            campaignStatus: 'ACTIVE'
        }).populate('variants').sort({ createdDateTime: -1 });
        // set visitors according to campaign and variant and domain
        dataBody['campaignId'] = displaySettings[0] ? displaySettings[0].campaignId : undefined;
        if (displaySettings[0]) {
            await visitorHelper.check_add_new_visitor(req.fingerprint, dataBody).then(res => {
                // in case visitor details are required
            });
        }

        captureSettings.forEach((campaign, index) => {
            if (index === 1) {
                return;
            }
            campaign.variants.forEach((variant, index) => {
                variant.toolsSelected.forEach((notification, index) => {
                    if (notification.selected === false) {
                        return;
                    }
                    const notificationSet = {
                        variantId: variant.variantId,
                        campaignId: variant.campaignId,
                        notificationType: notification.notificationType,
                        notificationSettings: notification.notificationSettings,
                        notificationImage: notification.notificationImage,
                        selected: notification.selected
                    };
                    captureNotificationSettings.push(notificationSet);

                });
                const variantSet = {
                    variantId: variant.variantId,
                    campaignId: variant.campaignId,
                    variantDisplayConfigs: variant.variantDisplayConfigs,
                };
                captureVariantSettings.push(variantSet);
            });
            const camp = {
                campaignId: campaign.campaignId,
                campaignCaptureUrls: campaign.campaignCaptureUrls,
                campaignDisplayUrls: campaign.campaignDisplayUrls,
                campaignDisplayAdvanceUrls: campaign.campaignDisplayAdvanceUrls,
                campaignCaptureAdvanceUrls: campaign.campaignCaptureAdvanceUrls
            };
            captureCampaignSettings.push(camp)
        });
        displaySettings.forEach((campaign, index) => {
            if (index === 1) {
                return;
            }
            campaign.variants.forEach((variant, index) => {
                variant.toolsSelected.forEach((notification, index) => {
                    if (notification.selected === false) {
                        return;
                    }
                    const notificationSet = {
                        variantId: variant.variantId,
                        campaignId: variant.campaignId,
                        notificationType: notification.notificationType,
                        notificationSettings: notification.notificationSettings,
                        notificationImage: notification.notificationImage,
                        selected: notification.selected
                    };
                    displayNotificationSettings.push(notificationSet);

                });
                const variantSet = {
                    variantId: variant.variantId,
                    campaignId: variant.campaignId,
                    variantDisplayConfigs: variant.variantDisplayConfigs,
                };
                displayVariantSettings.push(variantSet);
            });

            const camp = {
                campaignId: campaign.campaignId,
                campaignCaptureUrls: campaign.campaignCaptureUrls,
                campaignDisplayUrls: campaign.campaignDisplayUrls,
                campaignDisplayAdvanceUrls: campaign.campaignDisplayAdvanceUrls,
                campaignCaptureAdvanceUrls: campaign.campaignCaptureAdvanceUrls
            };
            displayCampaignSettings.push(camp)
        });

        const displayGoalsLoop = displaySettings[0] ? displaySettings[0].goalsAttached.secondaryGoals : [];
        displayGoalsLoop.push(displaySettings[0] ? displaySettings[0].goalsAttached.primaryGoal : '');
        if (displaySettings.length > 0) {
            await forEach(displayGoalsLoop, async (goalId) => {
                await GoalModel.findOne({ goalId: goalId }).then(gRes => {
                    campaignDisplayGoals.push({ goalId, goalCompletionUrl: gRes ? gRes.goalCompletionUrl : '' })
                })
            }).then(resFor => {
                displayCampaignSettings.push({ campaignGoals: campaignDisplayGoals });
            });

        }
        const captureGoalsLoop = captureSettings[0] ? captureSettings[0].goalsAttached.secondaryGoals : [];
        captureGoalsLoop.push(captureSettings[0] ? captureSettings[0].goalsAttached.primaryGoal : '');
        if (captureSettings.length > 0) {
            await forEach(captureGoalsLoop, async (goalId) => {
                await GoalModel.findOne({ goalId: goalId }).then(gRes => {
                    campaignCaptureGoals.push({ goalId, goalCompletionUrl: gRes ? gRes.goalCompletionUrl : '' })
                })
            }).then(resFor => {
                captureCampaignSettings.push({ campaignGoals: campaignCaptureGoals });
            });

        }
        const response = {
            payload: {
                captureSettings: {
                    captureCampaignSettings,
                    captureVariantSettings,
                    captureNotificationSettings
                },
                displaySettings: {
                    displayCampaignSettings,
                    displayVariantSettings,
                    displayNotificationSettings
                },
                visitor_Id: req.fingerprint.hash
            },
            status: 200
        };
        res.status(200).send(response);
    },
};
