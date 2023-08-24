const mongoose = require('mongoose');
const segmentCondition = require('./segment-Condition-model');


const segmentSchema = mongoose.Schema({
    segmentId: {
        type: mongoose.Schema.ObjectId
    },
    segmentName: {
        type: String,
        required: true
    },
    and: [{
        type: mongoose.Schema.ObjectId,
        ref: segmentCondition
    }],
    or: [{
        type: mongoose.Schema.ObjectId,
        ref: segmentCondition
    }],
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    updatedDateTime: {
        type: Date,
        default: () => { return Date.now() }
    },
    createdDateTime: {
        type: Date,
        default: () => { return Date.now() }
    }


});
segmentSchema.pre('save', async function (next) {
    this.segmentId = this._id;
});

segmentSchema.index({ segmentName: 1, userId: 1 }, { background: true });
const segmentModel = mongoose.model('segment', segmentSchema);
// Export the model
module.exports = segmentModel;
