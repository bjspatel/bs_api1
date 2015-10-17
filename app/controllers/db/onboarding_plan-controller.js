var Model       = require("../../models/db-model"),	//Load bookshelf model
    dbWorker    = require("./db-worker");

module.exports = function(request, entityName) {

    var self    = this;
    this.req    = request;
    this.name   = entityName;
    this.Model  = Model.OnBoardingPlan;
    this.relations  = [];

    /**
     * @function
     * @name addOnboardingPlan
     * @description Adds onboarding plan to the database.
     *
     * @param {Object} carrier: All the processes/retrieved rows which are uncommitted
     * @param {Object - Transaction} t: Transaction to use
     *
     * @return {Object - Promise}
     */
    self.addOnboardingPlan = function(carrier, t) {
        return dbWorker.addEntity(self, carrier, t);
    };

    /**
     * @function
     * @name updateOnboardingPlan
     * @description Updates onboarding plan in the database.
     *
     * @param {Object} carrier: All the processes/retrieved rows which are uncommitted
     * @param {Object - Transaction} t: Transaction to use
     *
     * @return {Object - Promise}
     */
    self.updateOnboardingPlan = function(refObjects, t) {
        if(refObjects[self.name] && refObjects[self.name].get("id")) {
            if(refObjects[self.name].get("id") === 1 || refObjects[self.name].get("id") === 0) {
                return self.addOnboardingPlan(refObjects, t);
            }
            return dbWorker.updateEntity(self, refObjects, t);
        } else {
            return self.addOnboardingPlan(refObjects, t);
        }
    };
};
