const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const settingSchema = new Schema({
    settingsId: Schema.Types.ObjectId,
    pixelId: {
        type: String
    },
    campaignId: {
        type: String,
        required: true
    },
    domainNames: [],
    // It should be tools selected. With tool type and it's id as an array of objects
    domainRestrictionUrls: [],
    percentageTraffic: {
        type: Number,
        default: 15
    },
    variantDisplayConfigs: {
        clickThroughUrl: {
            type: String,
            default: ''
        },
        openInNewWindow: {
            type: Boolean,
            default: true
        },
        notificationPosition: {
            type: String,
            default: 'left'
        },
        notificationTheme: {
            type: String,
            default: 'light'
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
        notificationBorderRadius: {
            type: String,
            default: '2px'
        },
    },
    updatedDateTime: {
        type: String,
        default:''
    },
    createdDateTime: {
        type: String,
        default: Math.floor(Date.now() / 1000)
    }
});
settingSchema.pre('save', async function( next) {
    this.settings  = this._id;
});
// Create a model
const settingsModel = mongoose.model('setting', settingSchema);
// Export the model
module.exports = settingsModel;
