const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const userUniqueSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        default: this._id
    },
    campaignId: {
        type: Schema.Types.ObjectId,
    },
    varientId: {
        type: mongoose.Schema.ObjectId,
        ref: "variant"
    },
    userHash: {
        type: Array
    },
    userIp: {
        type: Array,
    },
    userLocation: [{
        type: String,
    }],
    requestArrived: {
        type: String,
        default: ''
    },
    updatedDateTime: {
        type: String,
        default: ''
    },
    createdDateTime: {
        type: String,
        default: Math.floor(Date.now() / 1000)
    }


});
userUniqueSchema.pre('save', async function (next) {
    this.userId = this._id;
});
// Create a model
const userUniqueModel = mongoose.model('uniqueuser', userUniqueSchema);
// Export the model
module.exports = userUniqueModel;
