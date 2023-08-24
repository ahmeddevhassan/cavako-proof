
const router = require('express-promise-router')();
const campaignsController = require('../controllers/campaign-controller');
const checkListController = require('../controllers/check-list-controller');
const goalController = require('./../controllers/goal-controller');
const adminController = require('./../controllers/admin-controller');
const variantController = require('./../controllers/variant-controller');
const sdkController = require('./../controllers/sdk-controller');
const integrationController = require('../controllers/integration-controller-campaign');
const requestHelper = require('./../helpers/middle-wares/sdk-authenticate');
const crawlerController = require('./../controllers/crawler-controller');
const ReviewController = require('./../controllers/reviews-controller');
const SegmentController = require('../controllers/segment-controller');
const DashboardController = require('./../controllers/dashboard-controller');



// campaign routes
router.route('/load-campaign')
    .post(tokenAuthMiddleWare, campaignsController.loadCampaign);
router.route('/all-campaigns')
    .post(tokenAuthMiddleWare, campaignsController.loadCampaigns);
router.route('/create-campaign')
    .post(tokenAuthMiddleWare, campaignsController.createCampaign);
router.route('/update-campaign')
    .post(tokenAuthMiddleWare, campaignsController.updateCampaign);
router.route('/load-campaign-stats')
    .post(tokenAuthMiddleWare, campaignsController.loadCampaignStats);
router.route('/load-dashboard-stats')
    .post(tokenAuthMiddleWare, DashboardController.dashboard_Stats);
router.route('/detect-progress')
    .post(tokenAuthMiddleWare, campaignsController.detectProofProgress);
router.route('/crawl-web')
    .post(tokenAuthMiddleWare, crawlerController.crawlWeb);
router.route('/load-campaign-contacts')
    .post(tokenAuthMiddleWare, campaignsController.loadCampaignContacts);

// check-list routes
router.route('/load-campaign-check-list')
    .post(tokenAuthMiddleWare, checkListController.loadCheckListDetails);
router.route('/create-check-list')
    .post(tokenAuthMiddleWare, checkListController.addChecklistProgress);
router.route('/update-check-list')
    .post(tokenAuthMiddleWare, checkListController.updateChecklistCampaign);
/*router.route('/check-integration-present')
    .post(tokenAuthMiddleWare, checkListController.checkIntegrationPresence);*/

// goal routes
router.route('/create-goal')
    .post(tokenAuthMiddleWare, goalController.createGoal);
router.route('/update-goal')
    .post(tokenAuthMiddleWare, goalController.updateGoal);
router.route('/add-goal')
    .post(tokenAuthMiddleWare, goalController.addGoalInCampaign);
router.route('/load-goals')
    .post(tokenAuthMiddleWare, goalController.loadGoals);

// generic routes
router.route('/social-delete')
    .post(tokenAuthMiddleWare, campaignsController.deleteGeneric);

router.route('/load-campaign-with-stats')
    .post(tokenAuthMiddleWare, campaignsController.loadCampaignsWithStats);
// variant routes

router.route('/create-variant')
    .post(tokenAuthMiddleWare, variantController.createVariant);
router.route('/update-variant')
    .post(tokenAuthMiddleWare, variantController.updateVariant);
// campaign level integration
router.route('/create-customField')
    .post(integrationController.createCustomField);
router.route('/create-webHook')
    .post(integrationController.createWebHook);

// integration routes
router.route('/integration-campaign-load')
    .get(tokenAuthMiddleWare, integrationController.loadUserCampaigns);
/*router.route('/trigger-webHook')
    .post(tokenAuthMiddleWare, integrationController.triggerWebHook);*/

//admin routes
router.route('/add-status')
    .post(adminController.addStatus);
router.route('/add-tool')
    .post(adminController.addNewTool);

// sdk routes
router.route('/sdk-load')
    .post(sdkController.loadSdkCredentials);
router.route('/load-all-settings')
    .post(sdkController.loadOverAllSettings);
router.route('/create-sdk-settings')
    .post(sdkController.createSDKSettings);
router.route('/load-data')
    .post(sdkController.loadData);
router.route('/store-data')
    .post(sdkController.storeData);
router.route('/store-clicks')
    .post(sdkController.storeClicks);
router.route('/store-goalCompletion')
    .post(sdkController.storeGoalCompletion);
router.route('/server-test')
    .get(tokenAuthMiddleWare, sdkController.testServer);
//reviews routes
router.route('/reviews-add').post(ReviewController.createReview);
router.route('/reviews-get').get(ReviewController.getReview);
router.route('/reviews-update').post(ReviewController.updateReview);
router.route('/reviews-delete').post(ReviewController.deleteReview);


//segment routes
router.route('/new-segment').post(SegmentController.createSegment);
router.route('/update-segment').post(SegmentController.updateSegment);
router.route('/segment').get(SegmentController.getAllSegment);
router.route('/segment/:id').get(SegmentController.segmentDetail);
router.route('/remove-segment').post(SegmentController.deleteSegment);
router.route('/segment-condition').post(SegmentController.segmentCondition);
router.route('/del-segment-condition').post(SegmentController.removeSegmentCondition);
router.route('/bind-segment-to-campaign').post(SegmentController.bindSegmentToCampaign);
module.exports = router;

// middle wares for this routes
function tokenAuthMiddleWare(req, res, next) {
    const userId = req.body.userId;
    const url = `${global.config.userServiceUrl}/user/validate_token`;
    requestHelper.getRequest(url, req.headers.authorization).then(result => {
        console.log("result".result);

        if (result.isValid === true) {

            next();
        }
        if (result.isAxiosError) {
            res.status(401).send({ message: 'Unauthenticated User' });
        }
    }).catch(err => {
        console.log(err);
        res.status(401).send({ message: 'Invalid User' });
    })
}
function permissionsMiddleWare(req, res, next) {
    const userId = req.body.userId;
    const url = `http://localhost:3000/user/get-Permissions?userId=${userId}`;
    requestHelper.getRequest(url, req.headers.authorization).then(perm => {
        if (perm.permissions) {
            req.permissions = perm.permissions;
            next();
        }
        if (perm.isAxiosError) {
            res.status(401).send({ message: perm.response.data.message });
        }

    }).catch(err => {
        console.log(err);
        res.status(401).send({ message: 'You Do not have permissions to access this feature' });
    })
}
// local functions




