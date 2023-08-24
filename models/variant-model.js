const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const variantSchema = new Schema({
    variantId: Schema.Types.ObjectId,
    campaignId: {
        type: String,
        required: true
    },
    variantName: {
        type: String
    },
    // It should be tools selected. With tool type and it's id as an array of objects
    toolsSelected: [{}],
    trafficPercentage: {
        type: Number
    },
    variantDisplayConfigs: {
        clickThroughUrl: {
            type: String,
            default: ''
        },
        poweredByName: {
            type: String,
            default: ''
        },
        poweredByUrl: {
            type: String,
            default: ''
        },
        openInNewWindow: {
            type: Boolean,
            default: false
        },
        hideNotificationOnMobile: {
            type: Boolean,
            default: false
        },
        topPageOnMobile: {
            type: Boolean,
            default: false
        },
        showNotificationOnRight: {
            type: Boolean,
            default: false
        },
        notificationDarkTheme: {
            type: Boolean,
            default: false
        },
        firstNotificationDelay: {
            type: Number,
            default: 2
        },
        eachNotificationDisplay: {
            type: Number,
            default: 5
        },
        spaceEachNotification: {
            type: Number,
            default: 2
        },
        endDate: {
            type: String,
            default: ''
        }
    },
    updatedDateTime: {
        type: Date,
        default: () => { return Date.now() }
    },
    createdDateTime: {
        type: Date,
        default: () => { return Date.now() }
    },
    settingId: [{
        type: mongoose.Schema.ObjectId,
        ref: "funnelToolSettings"
    }],
});
variantSchema.pre('save', async function (next) {
    this.variantId = this._id;
});
// Create a model
const variantModel = mongoose.model('variant', variantSchema, 'variants');
// Export the model
module.exports = variantModel;
