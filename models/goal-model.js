const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const goalSchema = new Schema({
    goalId: {
        type: Schema.Types.ObjectId,
        default: this._id
    },
    userId: {
        type: String,
        required: true
    },
    goalName: {
       type: String
    },
    goalCategory: {
        type: String
    },
    goalCompletionUrl: {
       type: String
    },
    goalCompletionAdvanceUrl: {
        type: Array
    },
    goalDescription: {
        type: String,
        default: ''
    },
    goalConversionValue:{
        type: Number,
        default: 10
    },
    selected:{
        type: Boolean,
        default: false
    },
    updatedDateTime: {
        type: Date,
        default: () => { return Date.now() }
    },
    createdDateTime: {
        type: Date,
        default:  () => { return Date.now() }
    }


});
goalSchema.pre('save', async function( next) {
    this.goalId  = this._id;
});
// Create a model
const goalModel = mongoose.model('goal', goalSchema);
// Export the model
module.exports = goalModel;
