const ReviewsModel = require("../models/reviews-model");
const mongoDb = require("../helpers/mongo-helpers/mongo-helpers");
const ReviewHelper = require("../helpers/mongo-helpers/reviews-helper");
const https = require("https");

const mongoose = require("mongoose");

module.exports = {
  createReview: async (req, res, next) => {
    const body = req.body;
    if (body.reviewType === "GOOGLE") {
      await ReviewHelper.getReviewsGoogle(req, res, body);
    } else if(body.reviewType === "FACEBOOK") {
      await ReviewHelper.getReviewsFacebook(req, res, body);
    } else {
      res.status(500).send({ message: "please try google reviews" });
      return;
    }
  },
  getReview: async (req, res, next) => {
    const data = req.query;
    await ReviewHelper.get_review(data)
      .then(result => {
        const response = {
          payload: result,
          status: 200
        };
        res.status(200).send(response);
        return;
      })
      .catch(() => {
        res.status(404).send({ message: "data not found" });
        return;
      });
  },
  updateReview: async (req, res, next) => {
    const data = req.body;
    await mongoDb
      .updateReview(data)
      .then(fres => {
        const response = {
          payload: fres,
          message: "Review Updated Successfully",
          status: 200
        };
        res.status(200).send(response);
        return;
      })
      .catch(err => {
        res.status(500).send({ message: `error while updating review` });
        return;
      });
  },
  deleteReview: async (req, res, next) => {
    const data = req.body;
    await ReviewHelper.delete_review(data)
      .then(result => {
        const response = {
          payload: result,
          message: "Review deleted successfully",
          status: 200
        };
        res.status(200).send(response);
      })
      .catch(err => console.log(err));
  }
};
