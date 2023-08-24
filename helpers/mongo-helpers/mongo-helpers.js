const GoalModel = require('../../models/goal-model');
const CampaignModel = require('../../models/campaign-model');
const VariantModel = require('../../models/variant-model');
const funnelVariantModel = require('../../models/finnel-varients-model');
const funnelToolSetting = require('../../models/funnel-setting-model');
const ReviewsModel = require('../../models/reviews-model');
const SegmentModel = require('../../models/segment-model');
const SegmentConditionModel = require('../../models/segment-Condition-model');
const Q = require('q');

const mongoose = require('mongoose');
module.exports = {
    // GOALS Section
    addGoal_db: async (data) => {
        const goal = new GoalModel(data);
        return await goal.save().then(fullfilled => {
            return fullfilled;
        }).catch(err => {
            return err;
        });
    },
    updateGoal_db: async (data) => {
        const goal = await GoalModel.findOne({ goalId: data.goalId });
        goal.goalName = data.goalName || goal.goalName;
        goal.campaignId = data.campaignId || goal.campaignId;
        goal.goalCompletionUrl = data.goalCompletionUrl || goal.goalCompletionUrl;
        goal.goalCompletionAdvanceUrl = data.goalCompletionAdvanceUrl || goal.goalCompletionAdvanceUrl;
        goal.goalDescription = data.goalDescription || goal.goalCompletionUrl;
        goal.goalCategory = data.goalCategory || goal.goalCategory;
        goal.goalConversionValue = data.goalConversionValue || goal.goalConversionValue;
        goal.updatedDateTime = Math.floor(Date.now() / 1000);

        const newGoal = new GoalModel(goal);
        return await newGoal.save().then(fullfilled => {
            return fullfilled;
        }).catch(err => {
            return err;
        });
    },
    addGoalInCampaign_db: async (data) => {
        const type = data.goalType;
        const campaign = await CampaignModel.findOne({ campaignId: data.campaignId });
        switch (type) {
            case 'primary':
                campaign.goalsAttached.primaryGoal = data.goalsId;
                break;

            case 'secondary':
                campaign.goalsAttached.secondaryGoals = data.goalsId;
                break;
        }

        const newCampaign = new CampaignModel(campaign);
        await newCampaign.save().then(fullfilled => {
            return true;
        }).catch(err => {
            return err;
        });
    },


    //CAMPAIGNS Section

    updateCampaign_db: async (data) => {
        const campaign = await CampaignModel.findOne({ campaignId: data.campaignId });
        console.log("campaign", campaign);
        console.log("data", data);
        campaign.goalsAttached.primaryGoal = data.goalsAttached ? data.goalsAttached.primaryGoal : campaign.goalsAttached.primaryGoal;
        campaign.goalsAttached.secondaryGoals = data.goalsAttached ? data.goalsAttached.secondaryGoals : campaign.goalsAttached.secondaryGoals;
        campaign.campaignName = data.campaignName || campaign.campaignName;
        campaign.variants = data.variants || campaign.variants;
        campaign.campaignStatus = data.campaignStatus || campaign.campaignStatus;
        campaign.campaignDomains = data.campaignDomains || campaign.campaignDomains;
        campaign.campaignDisplayUrls = data.campaignDisplayUrls || campaign.campaignDisplayUrls;
        campaign.campaignDisplayAdvanceUrls = data.campaignDisplayAdvanceUrls || campaign.campaignDisplayAdvanceUrls;
        campaign.campaignCaptureAdvanceUrls = data.campaignCaptureAdvanceUrls || campaign.campaignCaptureAdvanceUrls;
        campaign.campaignCountries = data.campaignCountries || campaign.campaignCountries;
        campaign.campaignCaptureUrls = data.campaignCaptureUrls || campaign.campaignCaptureUrls;
        campaign.campaignExpireUrl = data.campaignExpireUrl || campaign.campaignExpireUrl;
        campaign.pixelStatus = data.pixelStatus || campaign.pixelStatus;
        campaign.campaignType = data.campaignType || campaign.campaignType;
        campaign.segments = data.segments || campaign.segments;
        campaign.bluePrintFlag = data.bluePrintFlag || campaign.bluePrintFlag;
        campaign.showExpireUrl = data.showExpireUrl || campaign.showExpireUrl;
        campaign.updatedDateTime = Date.now();
        const newCampaign = new CampaignModel(campaign);
        return await newCampaign.save().then(fullfilled => {
            return fullfilled;
        }).catch(err => {
            return err;
        });
    },
    deleteGeneric: async (data) => {
        const goalAttached = await CampaignModel.find({ $or: [{ "goalsAttached.secondaryGoals": data.id }, { "goalsAttached.primaryGoal": data.id }] });
        if (goalAttached.length > 0 && data.type === 'goals') {
            throw Error('This Goal is attached to a campaign Cannot Delete this!')
        }
        if (data.type === 'campaign') {
            const campaign = await CampaignModel.findOne({ campaignId: data.id }).populate([{
                path: 'variants',
                populate: [{
                    path: 'settingId',
                    model: 'funnelToolSetting',
                }, {
                    path: 'setUp',
                    model: 'funnelSetupModel',
                }]
            }]).catch(error => { return error });
            // console.log("campaign", campaign);
            if (campaign.variants.length > 0) {
                let settingId = campaign.variants[0].settingId;
                console.log("triggerstriggers", campaign.variants[0].triggers);


                // console.log("settingId", settingId.settingId);

                const variant = await funnelVariantModel.find({ _id: campaign.variants[0]._id }).then(async (vres) => {
                    // console.log('varinat  Existed', vres);
                    if (settingId) {
                        // console.log('settingId Existed +index', settingId);
                        // console.log("settingId[0]", settingId);
                        await funnelToolSetting.deleteMany({ _id: { $in: settingId } }).then(vres => {
                            console.log('setting deleted');
                        });
                    }
                    else {
                        console.log(" nooo");
                    }
                });
                await VariantModel.deleteOne({ _id: campaign.variants[0]._id }).then(vres => {
                });
            }
        }
        let Model;
        switch (data.type) {
            case 'goals':
                Model = GoalModel;
                break;

            case 'campaign':
                Model = CampaignModel;
                break;
        }
        return await Model.deleteOne({ _id: data.id }).then(fullfilled => {
            return fullfilled;
        }).catch(err => {
            return err;
        });
    },

    // Variant Section
    addVariant_db: async (data) => {
        const variant = new VariantModel(data);
        return await variant.save().then(fullfilled => {
            return fullfilled;
        }).catch(err => {
            return err;
        });
    },
    updateVariant_db: async (data) => {
        const variant = await VariantModel.findOne({ variantId: data.variantId });
        variant.variantName = data.variantName || variant.variantName;
        variant.toolsSelected = data.toolsSelected || variant.toolsSelected;
        variant.trafficPercentage = data.trafficPercentage || variant.trafficPercentage;
        variant.variantDisplayConfigs = data.variantDisplayConfigs || variant.variantDisplayConfigs;
        variant.updatedDateTime = Date.now();
        const newVariant = new VariantModel(variant);
        return await newVariant.save().then(fullfilled => {
            return fullfilled;
        }).catch(err => {
            return err;
        });
    },
    updateFunnelVariant_db: async (data) => {
        const variant = await VariantFunnelModel.findOne({ _id: data.varaintId });
        //compainId

        const campaign = await CampaignModel.findOneAndUpdate({ campaignId: data.compainId }, {
            "campaignExpireUrl": data.campaignExpireUrl,
            "campaignClickedUrl": data.campaignClickedUrl,
            "campaignType": 1,
        }, { new: true, useFindAndModify: false }).catch(error => { return "error finding hash" });
        variant.varaintName = data.notificationTypeName || variant.varaintName;
        variant.hasEndDate = data.hasEndDate || variant.hasEndDate;
        variant.endDate = data.endDate || variant.endDate;
        variant.deadLineDays = data.dealineLength || variant.deadLineDays;
        variant.deadLineType = data.deadlineType || variant.deadLineType;
        variant.deadLineEndTime = data.endTime || variant.deadLineEndTime;
        variant.hybridType = data.hybridType || variant.hybridType;
        variant.hybridDay = data.hybridDay || variant.hybridDay;
        variant.hybridDateTime = data.hybridDateTime || variant.hybridDateTime;
        variant.hybridEndTime = data.hybridEndTime || variant.hybridEndTime;
        variant.trackSaleEndTime = data.trackSaleEndTime || variant.trackSaleEndTime;
        variant.trackSaleStartTime = data.trackSaleStartTime || variant.trackSaleStartTime;
        variant.startingQuantity = data.startingQuantity || variant.startingQuantity;
        variant.fixedEndDate = data.fixedEndDate || variant.fixedEndDate;
        variant.isFixed = data.isFixed
        variant.hasHybridType = data.hasHybridType
        variant.hasOneDeadline = data.hasOneDeadline
        variant.hasSpecialOffer = data.hasSpecialOffer
        variant.triggers = data.triggers || variant.triggers;
        variant.setUp = data.setUp || variant.setUp;

        variant.updatedDateTime = Math.floor(Date.now() / 1000);


        const newVariant = new VariantFunnelModel(variant);
        return await newVariant.save().then(fullfilled => {
            console.log(" update success ");

            return fullfilled;
        }).catch(err => {
            console.log(" update error ");

            return err;
        });
    },
    updateReview: async (data) => {
        const reviewFromDb = await ReviewsModel.findOne({ userId: data.userId, reviewType: data.reviewType });
        reviewFromDb.userId = reviewFromDb.userId;
        reviewFromDb.reviewType = reviewFromDb.reviewType;
        reviewFromDb.reviewData = data.reviewData || reviewFromDb.reviewData;
        reviewFromDb.updatedDateTime = Date.now();
        const newReview = new ReviewsModel(reviewFromDb);
        return await newReview.save().then(fullfilled => {
            return fullfilled;
        }).catch(err => {
            return err;
        });
    },

    createSegment: async (data) => {
        const segmentToSave = new SegmentModel(data);
        return await segmentToSave.save().then(savedSegment => {
            return savedSegment;
        }).catch(err => {
            return err;
        });
    },

    updateSegment: async (data) => {
        return await SegmentModel.findOneAndUpdate(
            { _id: data._id, userId: data.userId },
            { $set: { segmentName: data.segmentName } },
            { new: true }
        ).lean().exec().then(updatedSegment => {
            return updatedSegment;
        }).catch(err => { return err; })
    },

    getSegments: async (userId, pageNo, pageSize) => {
        var skip = (pageNo - 1) * pageSize;
        return await SegmentModel.find(
            { userId: userId }
        ).sort({ segmentName: 1 }).skip(skip).limit(pageSize).lean().exec().then(segments => {
            return segments;
        }).catch(err => {
            throw err;
        })
    },

    deleteSegment: async (data) => {
        return Q.Promise((resolve, reject) => {
            SegmentModel
                .findOne({ _id: data.segmentId, userId: data.userId })
                .lean().exec().then(segmentToDel => {
                    if (!segmentToDel) {
                        return resolve({
                            message: 'Segment not found',
                            status: 404
                        });
                    }

                    var sConditionsToDel = segmentToDel.or.concat(segmentToDel.and) || [];
                    Q.all([
                        SegmentModel.remove({ _id: segmentToDel._id.toString() }),
                        SegmentConditionModel.deleteMany({ _id: { $in: sConditionsToDel } }).exec()
                    ]).then(([removedSegment, removedSCondition]) => {
                        return resolve({
                            message: 'Segment delete succussfully',
                            status: 200
                        })
                    }).catch(err => {
                        return reject(err);
                    });
                }).catch(err => { return reject(err) });
        });
    },

    createSegmentCondition: (data) => {

        return Q.Promise((resolve, reject) => {
            SegmentModel.findOne({
                _id: data.segmentId
            }).lean().exec().then(segmentToUpdate => {
                if (!segmentToUpdate) {
                    return resolve({
                        message: 'Segment not found',
                        status: 404
                    });
                }

                var sConditionToSave = new SegmentConditionModel(data);
                var updateQuery = { $addToSet: {} };
                updateQuery.$addToSet[sConditionToSave.operator] = sConditionToSave._id;
                Q.all([
                    sConditionToSave.save(),
                    SegmentModel.findOneAndUpdate({ _id: segmentToUpdate._id.toString() }, updateQuery, { new: true, useFindAndModify: false }).lean().exec()
                ]).then(([savedSCondition, updatedSegment]) => {
                    return resolve({
                        payload: savedSCondition,
                        message: 'condition created successfully',
                        status: 201
                    })

                }).catch(err => {
                    return reject(err);
                })
            })
        });
    },

    removeSegmentCondition: (data) => {

        return Q.Promise((resolve, reject) => {
            SegmentConditionModel.findOne({
                _id: data.segmentConditionId, userId: data.userId
            }).lean().exec().then(sConditionToDel => {
                if (!sConditionToDel) {
                    return resolve({
                        message: 'Condition not found',
                        status: 404
                    });
                }

                var updateQuery = { $pull: {} };
                updateQuery.$pull[sConditionToDel.operator] = sConditionToDel._id;

                Q.all([
                    SegmentConditionModel.remove({ _id: sConditionToDel._id.toString() }),
                    SegmentModel.findOneAndUpdate({ _id: sConditionToDel.segmentId.toString() }, updateQuery, { new: true, useFindAndModify: false }).lean().exec()
                ]).then(([removedSCondition, updatedSegment]) => {
                    return resolve({
                        message: 'Removed successfully',
                        status: 200
                    })

                }).catch(err => {
                    return reject(err);
                })
            })
        });
    },

    bindSegmentToCampaign: (data) => {

        return Q.Promise((resolve, reject) => {

            Q.all([
                SegmentModel.findOne({ _id: data.segmentId, userId: data.userId }).lean().exec(),
                CampaignModel.findOne({ _id: data.campaignId, 'userProfile.userId': data.userId }).exec()
            ]).then(([segment, campaign]) => {
                if (!segment) resolve({
                    message: 'Segment not found',
                    status: 404
                });
                else if (!campaign) resolve({
                    message: 'Campaign not found',
                    status: 404
                });

                campaign.segment = segment._id;
                campaign.save().then(savedCampaign => {
                    return resolve({
                        message: 'Campaign updated successfully',
                        status: 200
                    })
                }).catch(err => {
                    return reject(err);
                })
            });
        });
    },
};
