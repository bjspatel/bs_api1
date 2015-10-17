var Model       = require("../../models/db-model"),	//Load bookshelf model
    dbWorker    = require("./db-worker");

module.exports = function(request, entityName) {

    var self    = this;
    this.req    = request;
    this.name   = entityName;
    this.Model  = Model.Address;
    this.relations  = [];

    /**
     * @function
     * @name addAddress
     * @description Adds address to the database.
     *
     * @param {Object} carrier: All the processes/retrieved rows which are uncommitted
     * @param {Object - Transaction} t: Transaction to use
     *
     * @return {Object - Promise}
     */
    self.addAddress = function(carrier, t) {
        return dbWorker.addEntity(self, carrier, t);
    };

    /**
     * @function
     * @name updateAddress
     * @description Updates address in the database.
     *
     * @param {Object} carrier: All the processes/retrieved rows which are uncommitted
     * @param {Object - Transaction} t: Transaction to use
     *
     * @return {Object - Promise}
     */
    self.updateAddress = function(refObjects, t) {
        if(refObjects[self.name] && refObjects[self.name].get("id")) {
            if(refObjects[self.name].get("id") === 1 || refObjects[self.name].get("id") === 0) {
                return self.addAddress(refObjects, t);
            }
            return dbWorker.updateEntity(self, refObjects, t);
        } else {
            return self.addAddress(refObjects, t);
        }
    };
};
