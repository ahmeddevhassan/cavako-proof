const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const reviewsModel = new Schema({
    reviewId: {
        type: Schema.Types.ObjectId
    },
    reviewData: {
        type: Schema.Types.Object
    },
    userId: {
        type: Schema.Types.String
    },
    reviewType: {
        type: Schema.Types.String
    },
    credentials: {
        type: Schema.Types.Object
    },
    campaignId: { type: Schema.Types.String }

});
reviewsModel.pre('save', async function (next) {
    this.reviewId = this._id;
});
// Create a model
const ReviewsModel = mongoose.model('reviews', reviewsModel);
// Export the model
module.exports = ReviewsModel;
