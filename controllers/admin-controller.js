const StatusModel = require('../models/statuses-model');
const RegisteredToolsModel = require('../models/registered-tools-model');
const mongoDb = require('../helpers/mongo-helpers/mongo-helpers');
const mongoose = require('mongoose');
module.exports = {
    addStatus: async (req, res, next) => {
        const data = req.body;
        const status = new StatusModel({
            statusName: data.statusName
        });
        await status.save().then(fres=>{
            res.status(200).send({message : 'Status added successfully'});
        }).catch(err=> {
            console.log('res error', err);
            res.status(500).send({message : `error while adding Status `});
        });

    },
    addNewTool: async (req, res, next) => {
        const data = req.body;

        const tool = new RegisteredToolsModel({
            toolName: data.statusName,
            toolIcon: data.toolIcon,
            toolStatus: data.toolStatus,
            toolImage: data.toolImage,
            microService: data.microService
        });
        await tool.save().then(fres=>{
            res.status(200).send({message : 'Tool added successfully'});
        }).catch(err=> {
            console.log('res error', err);
            res.status(500).send({message : `error while adding Tool `});
        });

    }


};
