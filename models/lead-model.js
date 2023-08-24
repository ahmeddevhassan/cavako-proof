const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const leadSchema = new Schema({
    leadId: Schema.Types.ObjectId,
    pixelId: Schema.Types.ObjectId,
    campaignId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    conversionCount: {
        type: Number
    },
    location: {
        type: String
    },
    domain: {
        type: String
    },
    createdDateTime: {
        type: String,
        default: Math.floor(Date.now() / 1000)
    }

});
leadSchema.pre('save', async function( next) {
    this.leadId  = this._id;
});
// Create a model
const userPixelModel = mongoose.model('lead', leadSchema);
// Export the model
module.exports = userPixelModel;
