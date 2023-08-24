const SegmentModel = require('../models/segment-model');
const SegmentConditionModel = require('../models/segment-Condition-model');
const mongoDb = require('../helpers/mongo-helpers/mongo-helpers');


createSegment = async (req, res) => {

    var data = req.body;
    // idhr userid acnad segmentName pass krna hai 
    if (!data.segmentName || !data.userId)
        return res.status(400).json({ message: 'Bad request' });

    await mongoDb.createSegment(data).then(savedSegment => {
        return res.status(201).json({
            payload: savedSegment,
            message: 'Segment added succesfuly',
            status: 201
        });
    }).catch(err => {
        console.error(err);
        return res.status(500).json({
            message: 'error occurred while creating segment.'
        });
    });
}

updateSegment = async (req, res) => {

    var data = req.body;

    if (!data.segmentName || !data.userId)
        return res.status(400).json({ message: 'Bad request' });

    return await mongoDb.updateSegment(data).then(savedSegment => {
        if (!savedSegment)
            return res.status(404).json({ message: 'Segment not found' });
        else
            return res.status(201).json({
                payload: savedSegment,
                message: 'Segment added succesfuly',
                status: 201
            });
    }).catch(err => {
        console.error(err);
        return res.status(500).json({
            message: 'Some error occurred'
        });
    });
}

getAllSegment = async (req, res) => {
    var {
        pageNo, pageSize, userId
    } = req.query;

    if (!userId)
        return res.status(400).json({ message: 'Bad request' });

    pageNo = parseInt(pageNo);
    pageSize = parseInt(pageSize);
    if (pageNo < 1) pageNo = 1;
    if (pageSize < 10) pageNo = 10;

    return await mongoDb.getSegments(userId, pageNo, pageSize).then(async (segments) => {
        console.log("segments", segments);
        let segmentsAll = [];
        //await Promise.all(
        if (segments && segments.length > 0) {
            for (let i = 0; i < segments.length; i++) {
                let segmentCondition = await SegmentConditionModel.find({ segmentId: segments[i].segmentId })
                let segmentArr = segments[i];
                segmentArr['condition'] = segmentCondition
                segmentsAll.push(segmentArr)
            }

        }

        return res.status(200).send(await Promise.all(segmentsAll).then(res => {
            const response = {
                payload: {
                    payload: segmentsAll || [],
                    message: 'ok',
                    noToast: true,
                    status: 200
                },
                status: 200
            }
            return response

        })
        )
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ message: 'Some error occured.' });
    });

}

segmentDetail = async (req, res) => {

    var { id } = req.params;

    if (!id)
        return res.status(400).json({ message: 'Bad request' });

    return await SegmentModel
        .findOne({ _id: id })
        .populate('or and')
        .lean().exec().then(segment => {
            if (!segment)
                return res.status(404).json({
                    message: 'Segment not found'
                });
            else
                return res.status(200).json({
                    payload: segment,
                    message: 'Ok',
                    status: 200
                })
        }).catch(err => {
            console.error(err);
            return res.status(500).json({
                message: 'Some error occured'
            })
        });
}

deleteSegment = async (req, res) => {

    var data = req.body;

    if (!data.userId || !data.segmentId)
        return res.status(400).json({ message: 'Bad request' });

    return await mongoDb.deleteSegment(data).then(response => {
        return res.status(response.status).json(response);
    }).catch(err => {
        console.error(err);
        return res.status(500).json({
            message: 'Some error occurred'
        });
    });
}

segmentCondition = async (req, res) => {

    var data = req.body;

    if (!data.segmentId || !data.userId)
        return res.status(400).json({ message: 'Bad request' });

    await mongoDb.createSegmentCondition(data).then(response => {
        return res.status(response.status).json(response);
    }).catch(err => {
        console.error(err);
        return res.status(500).json({
            message: 'Some error occurred, please try again.'
        });
    });
}

removeSegmentCondition = async (req, res) => {

    var data = req.body;

    if (!data.segmentConditionId || !data.userId)
        return res.status(400).json({ message: 'Bad request' });

    await mongoDb.removeSegmentCondition(data).then(response => {
        return res.status(response.status).json(response);
    }).catch(err => {
        console.error(err);
        return res.status(500).json({
            message: 'Some error occurred, please try again.'
        });
    });
}

bindSegmentToCampaign = async (req, res) => {

    var data = req.body;
    if (!data.segmentId || !data.userId || !data.campaignId)
        return res.status(400).json({ message: 'Bad request' });

    await mongoDb.bindSegmentToCampaign(data).then(response => {
        return res.status(response.status).json(response);
    }).catch(err => {
        console.error(err);
        return res.status(500).json({
            message: 'Some error occurred, please try again.'
        });
    });
}

module.exports = {
    createSegment,
    updateSegment,
    getAllSegment,
    segmentDetail,
    deleteSegment,
    segmentCondition,
    removeSegmentCondition,
    bindSegmentToCampaign
}