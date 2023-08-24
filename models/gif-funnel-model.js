const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const gifSchema = new Schema({
    gifId: Schema.Types.ObjectId,
    campaignId: Schema.Types.ObjectId,
    backgroundColor: {
        type: String,
        default: "#000000",
    },
    textColor: {
        type: String,
        default: "#ffffff",
    },
    bottom: {
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
    daysHeading: {
        type: String,
        default: 'D',
    },
    hourHeading: {
        type: String,
        default: 'H',
    },
    minuteHeading: {
        type: String,
        default: 'M',
    },
    secondHeading: {
        type: String,
        default: 'S',
    },
    expireText: {
        type: String,
        default: 'Offer is no longer available',
    },
    createdDateTime: {
        type: Date,
        default: () => { return Date.now() }
    },
    updatedDateTime: {
        type: Date,
        default: () => { return Date.now() }
    }
});
gifSchema.pre('save', async function (next) {
    this.gifId = this._id;
});
// Create a model
const gifSchemasModel = mongoose.model('gifModel', gifSchema);
// Export the model
module.exports = gifSchemasModel;
