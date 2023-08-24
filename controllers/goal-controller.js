const GoalModel = require('../models/goal-model');
const mongoDb = require('../helpers/mongo-helpers/mongo-helpers');
const mongoose = require('mongoose');
module.exports = {
    createGoal: async (req, res, next) => {
        const data = req.body;
        await mongoDb.addGoal_db(data).then(fres=>{
            const response = {
                payload: fres,
                message: 'Goal Added Successfully',
                status: 200
            };
            res.status(200).send(response);
        }).catch(err=> {
            console.log('res error', err);
            res.status(500).send({message : `error while adding goal `});
        });

    },
    loadGoals: async (req, res, next) => {
        const data = req.body;
        const goals = await GoalModel.find({userId: data.userId});
        const response = {
            payload: goals,
            status: 200
        };
        res.status(200).send(response);

    },
    updateGoal: async (req, res, next) => {
        const data = req.body;
        await mongoDb.updateGoal_db(data).then(fres=>{
            const response = {
                payload: fres,
                message: 'Goal Updated Successfully',
                status: 200
            };
            res.status(200).send(response);
        }).catch(err=> {
            console.log('res error', err);
            res.status(500).send({message : `error while updating goal `});
        });

    },
    addGoalInCampaign: async (req, res, next) => {
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

    }

};
