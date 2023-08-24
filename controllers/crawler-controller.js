const StatusModel = require('../models/statuses-model');
const RegisteredToolsModel = require('../models/registered-tools-model');
const mongoDb = require('../helpers/mongo-helpers/mongo-helpers');
const campaignHelper = require('../helpers/mongo-helpers/campaign-helper');
const checkListHelper = require('../helpers/mongo-helpers/check-list-helper');
const mongoose = require('mongoose');
const osmosis = require('osmosis');
var request = require('request-promise');
var cheerio = require('cheerio');
module.exports = {
    crawlWebOld: async (req, res, next) => {
        const data = req.body;
        console.log('url Array', data.urls);
        // res.status(200).send({visitorCount : visitors});
        // osmosis
        //     .get('hammadakbar.com')
        //     .find('head + script')
        //     .set({
        //         'script':'cavako'
        //     })
        //     .data(function(data) {
        //         console.log("->",data);   // returns empty
        //     })
        //     .log("log",console.log)
        //     .error("error",console.log)
        //     .debug("debug",console.log);
        url = 'https://' + data.urls[0];
        console.log("url", url);
        let flag = false;
        await request(url, function (error, response, html) {

            // First we'll check to make sure no errors occurred when making the request

            if (!error) {
                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

                var $ = cheerio.load(html);
                console.log("yes")
                // Finally, we'll define the variables we're going to capture
                $('script').filter(function () {
                    var data = $(this);
                    //console.log("data",data[0].attribs.id)
                    // console.log("data",data)
                    if (data && data[0] && data[0].attribs && data[0].attribs.id && data[0].attribs.id == "cavako-cdn") {
                        flag = true;
                        return;
                    }

                })
            }
            else {
                return;
            }
        });
        // log
        //         await status.save().then(fres=>{
        //             res.status(200).send({message : 'Status added successfully'});
        //         }).catch(err=> {
        //             console.log('res error', err);
        //             res.status(500).send({message : `error while adding Status `});
        //         });
        console.log("function end ", flag)
        res.status(200).send({ visitorCount: flag ? 1 : 0 });

        // res.status(200).send({message : 'Status added successfully'});

    },
    /*addNewTool: async (req, res, next) => {
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

    }*/
    crawlWeb: async (req, res, next)=>{
        const body = req.body;
        checkListHelper.checkListDetectPixelByUrl(body).then(response => {
            res.status(200).send({ visitorCount: response ? 1 : 0 });
        }).catch(err=>{
            console.log('error in pixel detection', err);
            res.status(500).send({message: 'Something went wrong'});
        })
    }


};
