const IntegrationModel = require("../../models/integration-model");
const mongoose = require("mongoose");

module.exports = {
  /*add_New_Integration: async data => {
    const integration = new IntegrationModel(data);
    return await integration
      .save()
      .then(fullfilled => {
        return fullfilled;
      })
      .catch(err => {
        console.log("error add integration", err);
        return err;
      });
  },
  load_Integrations: async data => {
    return await IntegrationModel.find({ userId: data.userId })
      .then(fullfilled => {
        return fullfilled;
      })
      .catch(err => {
        return err;
      });
  },
  update_Integration: async data => {
    const integration = new IntegrationModel(data);
    return await integration
      .save()
      .then(fullfilled => {
        return fullfilled;
      })
      .catch(err => {
        return err;
      });
  },
  delete_Integration: async data => {
    return await IntegrationModel.deleteOne({ integrationName: data.integrationName, userId: data.userId})
      .then(fullfilled => {
        return fullfilled;
      })
      .catch(err => {
        return err;
      });
  }*/
};
