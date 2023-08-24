const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const campaignCheckListSchema = new Schema({
    checkListId: {
        type: Schema.Types.ObjectId
    },
    campaignId: {
        type: Schema.Types.ObjectId
    },
    userId: {
        type: Schema.Types.ObjectId
    },
    pixelTracking: {
        status: {type: Boolean, default: false},
        clickedUrls: [],
        displayUrls: [],
    },
    checkListIntegration: {

    },
    emailTemplates: [],
    updatedDateTime: {
        type: Date,
        default: () => { return Date.now() }
    },
    createdDateTime: {
        type: Date,
        default: () => { return Date.now() }
    },



});
campaignCheckListSchema.pre('save', async function (next) {
    this.checkListId = this._id;
});
// Create a model
const campaignCheckListModel = mongoose.model('campaign-check-list', campaignCheckListSchema);
// Export the model
module.exports = campaignCheckListModel;
