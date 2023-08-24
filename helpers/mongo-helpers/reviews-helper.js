const ReviewsModel = require("../../models/reviews-model");
const MongoHelper = require("./mongo-helpers");
const mongoose = require("mongoose");
const CronJob = require("cron").CronJob;
const axios = require("axios");
const { googleMapApi } = require("../../configuration/config");
let timeToHit = `00 00 * * *`;

ReviewHelper = {
  add_new_review: async data => {
    const isAvailable = await ReviewsModel.findOne({
      userId: data.userId,
      reviewType: data.reviewType,
      campaignId: data.campaignId
    });
    if (isAvailable) {
      MongoHelper.updateReview(data);
    } else {
      const reviews = new ReviewsModel(data);
      return await reviews
        .save()
        .then(fullfilled => {
          return fullfilled;
        })
        .catch(err => {
          console.log("error add review", err);
          return err;
        });
    }
  },
  get_review: async data => {
    return await ReviewsModel.find({ userId: data.userId, campaignId: data.campaignId })
      .then(fullfilled => {
        console.log(fullfilled);
        return fullfilled;
      })
      .catch(err => {
        return err;
      });
  },
  update_review: async data => {
    const reviews = new ReviewsModel(data);
    return await reviews
      .save()
      .then(fullfilled => {
        return fullfilled;
      })
      .catch(err => {
        return err;
      });
  },
  delete_review: async data => {
    return await ReviewsModel.deleteOne({
      reviewType: data.reviewType,
      userId: data.userId,
      campaignId: data.campaignId
    })
      .then(fullfilled => {
        return fullfilled;
      })
      .catch(err => {
        return err;
      });
  },
  getReviewsGoogle: async (req, res, body) => {
    const placeId = body.credentials.placeId;
    await axios
      .get(
        `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${googleMapApi}`
      )
      .then(async function(resp) {
        let data = resp.data;
        if (data.status !== "OK") {
          res.status(500).send({ message: "Invalid place id" });
          return;
        } else if (data.result.reviews) {
          let reviews = [];
          const json = data.result.reviews;
          for (let i = 0; i < json.length; i++) {
            if (json[i].rating > 3.9) {
              reviews.push({
                author: json[i].author_name,
                photo_url: json[i].profile_photo_url,
                lang: json[i].language,
                review_text: json[i].text,
                time_stamp: json[i].time,
                rating: json[i].rating
              });
            }
          }
          if (reviews.length > 0) {
           reviews.forEach((elem, index) => {
             reviews[index]['reviewType'] = 'Google';
           });
            const newData = { ...body, reviewData:  reviews  };
            console.log('new Data', newData);
            return await ReviewHelper.add_new_review(newData)
              .then(fres => {
                const response = {
                  payload: fres,
                  message: "Review Added Successfully",
                  status: 200
                };
                res.status(200).send(response);
                // ReviewHelper.jobCron.start();
                return;
              })
              .catch(err => {
                res.status(500).send({ message: `error while adding review` });
                return;
              });
          } else {
            res.status(404).send({ message: "no positive reviews found" });
            return;
          }
        } else {
          res.status(404).send({ message: "No review found" });
          return;
        }
      })
      .catch("error", err => {
        res.status(500).send({ message: err.message });
        return;
      });
  },
  jobCron: new CronJob(
    timeToHit,
    function() {
      let d = new Date();
      console.log("You will see this message every 3 seconds", d);
      ReviewHelper.getDailyFromGoogle();
    },
    null,
    true,
    "Asia/Karachi"
  ),
  getDailyFromGoogle: async () => {
    await ReviewsModel.find({ reviewType: "GOOGLE" })
      .then(async fullfilled => {
        console.log(fullfilled);
        for (let index = 0; index < fullfilled.length; index++) {
          const element = fullfilled[index];
          await axios
            .get(
              `https://maps.googleapis.com/maps/api/place/details/json?placeid=${element.credentials.placeId}&key=${googleMapApi}`
            )
            .then(result => {
              console.log(result);
            })
            .catch(err => {
              console.log(err.message);
            });
        }

        return fullfilled;
      })
      .catch(err => {
        return err;
      });
  },
  getReviewsFacebook: async (req, res, body) => {
    console.log(body);
    await axios
      .get(
        `https://graph.facebook.com/v6.0/me/ratings?access_token=${body.credentials.access_token}`
      )
      .then(async resp => {
        let data = resp.data;
        console.log("data => ",data);
        if (data.data) {
          let reviews = [];
          const json = data.data;
          for (let i = 0; i < json.length; i++) {
            if (json[i].recommendation_type === 'positive') {
              reviews.push({
                author: json[i].author_name || 'John Doe',
                photo_url: json[i].profile_photo_url || '',
                lang: json[i].language || "en",
                review_text: json[i].review_text,
                time_stamp: json[i].created_time,
                rating: json[i].rating || 5
              });
            }
          }
          if (reviews.length > 0) {
            const newData = { ...body, reviewData: { reviews } };
            return await ReviewHelper.add_new_review(newData)
              .then(fres => {
                const response = {
                  payload: fres,
                  message: "Review Added Successfully",
                  status: 200
                };
                res.status(200).send(response);
                // ReviewHelper.jobCron.start();
                return;
              })
              .catch(err => {
                res.status(500).send({ message: "error while adding review" });
                return;
              });
          } else {
            res.status(404).send({ message: "no positive reviews found" });
            return;
          }
        } else {
          res.status(404).send({ message: "No review found" });
          return;
        }})
      .catch(err => {
        console.error(err.message);
        res.status(400).send({ message: err.message });
      });
  }
};

module.exports = ReviewHelper;
