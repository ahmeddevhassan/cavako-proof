const mongoose = require('mongoose');
const sConditionTypeEnum = require('../enums/enums').SConditionTypeEnum;


const segmentConditionSchema = mongoose.Schema({
    segmentConditionId: {
        type: mongoose.Schema.ObjectId
    },
    operator: {
        type: String,
        enum: ['and', 'or'],
        default: 'and'
    },
    conditionType: {
        type: sConditionTypeEnum,
        default: sConditionTypeEnum.Everywhere
    },
    condition: {
        type: String,
        default: ''
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    segmentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'segment'
    },
    title: {
        type: String,
        default: ''
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
segmentConditionSchema.pre('save', async function (next) {
    this.segmentConditionId = this._id;
});
// Create a model
const segmentConditionModel = mongoose.model('segment-condition', segmentConditionSchema);
// Export the model
module.exports = segmentConditionModel;
