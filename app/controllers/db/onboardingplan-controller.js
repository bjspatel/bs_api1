var Model           = require("../../models/db-model"),	//Load bookshelf model
    util            = require("./db-util"),
    onboardingplan  = {};

/**
 * @function
 * @name sendOnboardingPlanData
 * @description Send onboarding plan information to the response object.
 *              The data can be of a single onboarding plan, if specified, otherwise of all onboarding plans.
 *
 * @param {Object - Request} req: Express request object
 * @param {Object - Response} res: Express response object
 * @param {Function} next: Next function to be invoked in the middleware queue
 *
 * @return undefined
 */
onboardingplan.sendOnboardingPlanData = function(req, res, next) {

    var onboardingplan = new Model.OnboardingPlan();
    if(req.params.id) {
        var whereObject = (req.url.indexOf("/company/") >= 0)
            ? {company_id: req.params.id}
            : {plan_id: req.params.id};
        onboardingplan = (whereObject.company_id)
            ? onboardingplan.query({where: whereObject}).fetchAll()
            : onboardingplan.query({where: whereObject}).fetch();
    } else {
        onboardingplan = onboardingplan.fetchAll();
    }

    onboardingplan.then(function(plans) {
        var responseData = util.getResponseData(plans, "Onboarding Plan");
        res.status(responseData.code).json(responseData.content);
    })
    .catch(function(error) {
        res.status(500)
        .json({
            message: "Error while fetching onboarding plans."
        });
        console.trace(JSON.stringify(error));
    });
};

module.exports = onboardingplan;
