const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const funnelToolSetting = new Schema({
    Id: {
        type: Schema.Types.ObjectId,
        default: this._id
    },
    settingId: {
        type: String,
    },
    variantType: {
        type: String,
        default: 'floatingBar'
    },
    leftButtonFlag: {
        type: String,
        default: 'true'
    },
    leftButtonText: {
        type: String,
        default: 'Try Now'
    },
    leftButtonTextColor: {
        type: String,
        default: 'true'
    },
    leftButtonBackgroundColor: {
        type: String,
        default: '#4EB7F5'
    },
    leftButtonBorderColor: {
        type: String,
        default: '#fff'
    },
    timerSubheadingFlag: {
        type: String,
        default: 'true'
    },
    timerSubheadingFontColor: {
        type: String,
        default: '#fff'
    },
    timerFontColor: {
        type: String,
        default: '#fff'
    },
    timeFontSize: {
        type: String,
        default: '35'
    },
    headingTextColor: {
        type: String,
        default: '#fff'
    },
    headingTextFlag: {
        type: String,
        default: 'true',
    },
    headingText: {
        type: String,
        default: 'Hurry! This special offer is available until '
    },
    containerBorderRadius: {
        type: Number,
        default: 0
    },
    containerBackgroundColor: {
        type: String,
        default: '#162D3D'
    },
    minuteTextColour: {
        type: String,
        default: '#fff'
    }, secondTextColour: {
        type: String,
        default: '#fff'
    }, hourTextColour: {
        type: String,
        default: '#fff'
    },
    subHeadingFontSize: {
        type: String,
        default: '10'
    },
    GradiantTopColor: {
        type: String,
        default: '#000'
    },
    GradiantBottomColor: {
        type: String,
        default: 'red'
    },
    timeFontColour: {
        type: String,
        default: '#fff'
    },
    headingFontSize: {
        type: Number,
        default: 16
    },
    updatedDateTime: {
        type: Date,
        default: () => { return Date.now() }
    },
    createdDateTime: {
        type: Date,
        default: () => { return Date.now() }
    }, bottom: {
        type: String,
        default: 'true',
    },
    top: {
        type: String,
        default: 'false',
    },
    right: {
        type: String,
        default: 'false',
    },


});
funnelToolSetting.pre('save', async function (next) {
    this.settingId = this._id;
});
// Create a model
const FunnelToolSetting = mongoose.model('funnelToolSetting', funnelToolSetting);
// Export the model
module.exports = FunnelToolSetting;
