const GoalModel = require('../models/goal-model');
const mongoDb = require('../helpers/mongo-helpers/mongo-helpers');
const mongoose = require('mongoose');
module.exports = {
    createVariant: async (req, res, next) => {
        const data = req.body;
        await mongoDb.addVariant_db(data).then(fres=>{
            const response = {
                payload: fres.variantId,
                status: 200
            };
            res.status(200).send(response);
        }).catch(err=> {
            console.log('res error', err);
            res.status(500).send({message : `error while s saving variant `});
        });

    },
    updateVariant: async (req, res, next) => {
        const data = req.body;
        await mongoDb.updateVariant_db(data).then(fres=>{
            res.status(200).send({message : 'variant updated successfully'});
        }).catch(err=> {
            console.log('res error', err);
            res.status(500).send({message : `error while updating variant `});
        });

    },
   /* addNotificationInVariant: async (req, res, next) => {
        // variables required
        // campaignId, userId, goalsId, goalType
        const data = req.body;
        await mongoDb.addGoalInCampaign_db(data).then(fres=>{
            console.log('res function', fres);
            res.status(200).send({message : 'goal added successfully successfully'});
        }).catch(err=> {
            console.log('res error', err);
            res.status(500).send({message : `error while adding goal `});
        });

    }*/

};
