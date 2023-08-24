const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema
const linkVisitsSchema = new Schema({
    linkVisitId: Schema.Types.ObjectId,
    campaignId: Schema.Types.ObjectId,
    pixelId: Schema.Types.ObjectId,
    linkReferral: {
        default: 'email',
        type: String
    },
    visitorDetails: {},
    clickThrough: String,
    updatedDateTime: {
        type: Date,
        default: () => { return Date.now() }
    },
    createdDateTime: {
        type: Date,
        default: () => { return Date.now() }
    }
});
linkVisitsSchema.pre('save', async function (next) {
    this.linkVisitId = this._id;
});
// Create a model
const linkVisitModel = mongoose.model('link-visit', linkVisitsSchema);
// Export the model
module.exports = linkVisitModel;
