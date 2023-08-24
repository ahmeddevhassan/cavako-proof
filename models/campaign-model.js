const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const campaignSchema = new Schema({
    campaignId: {
        type: Schema.Types.ObjectId
    },
    campaignName: {
        type: String,
        required: true,
    },
    userProfile: {
        userId: {
            type: String,
            default: ''
        },
        userFullName: {
            type: String,
            default: ''
        },
        profilePicture: {
            type: String,
            default: ''
        }
    },
    goalsAttached: {
        primaryGoal: {
            type: mongoose.Schema.ObjectId,
            ref: "goals"
        },
        secondaryGoals: [{
            type: mongoose.Schema.ObjectId,
            ref: "goals"
        }]
    },
    // Create variants like this so that you can load the variants in queries
    // And if there are any other references you can add them like this. It is just like you are creating a foreign key reference in SQL
    // variants: [{
    //type: mongoose.Schema.ObjectId,
    //ref: "variant"
    //}],
    variants: [{
        type: mongoose.Schema.ObjectId,
        ref: "variant"
    }],
    segments: [{
        type: mongoose.Schema.ObjectId,
        ref: "segment"
    }],
    campaignCaptureUrls: [],
    campaignDisplayUrls: [],
    campaignDisplayAdvanceUrls: [],
    campaignCaptureAdvanceUrls: [],
    campaignCountries: [{
        countryCode: {
            type: String,
            default: ''
        },
        countryName: {
            type: String,
            default: ''
        }
    }
    ],
    campaignDomains: [],
    campaignDetails: {
        type: String,
        default: ''
    },
    campaignType: {
        type: String,
        default: ''
    },
    campaignStatus: {
        type: String,
        default: 'DRAFT'
    },
    pixelStatus: {
        type: Boolean,
        default: false
    },
    updatedDateTime: {
        type: Date,
        default: () => { return Date.now() }
    },
    stepTrack: {
        type: Number,
        default: 0
    },
    createdDateTime: {
        type: Date,
        default: () => { return Date.now() }
    },
    bluePrintFlag: {
        type: Number,
        default: 0
    }
    ,
    showExpireUrl: {
        type: String,
        default: "0"
    },
    emailTemplates: [],
});
campaignSchema.pre('save', async function (next) {
    this.campaignId = this._id;
});
// Create a model
const CampaignModel = mongoose.model('campaign', campaignSchema);
// Export the model
module.exports = CampaignModel;
