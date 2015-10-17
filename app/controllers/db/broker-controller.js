var Model       = require("../../models/db-model"),	//Load bookshelf model
    dbWorker    = require("./db-worker");

module.exports = function(request, entityName) {

    var self        = this;
    this.req        = request;
    this.name       = entityName;
    this.Model      = Model.Broker;
    this.relations  = ["company", "company.address", "address"];

    /**
     * @function
     * @name setReferenceIds
     * @description Sets id values of the reference entities which are related to broker.
     *
     * @param {Object} carrier: All the processes/retrieved rows which are uncommitted
     *
     * @return {Object - Promise}
     */
    self.setReferenceIds = function(refObjects) {
        if(!!refObjects) {
            self.req.body.brokerCompanyId = (!!refObjects["company"]) ? refObjects["company"].get("id") : undefined;
            self.req.body.brokerCreditCardId = (!!refObjects["creditcard"]) ? refObjects["creditcard"].get("id") : undefined;
            if(!!self.req.body.brokerUseCompanyAddress) {
                self.req.body.brokerAddressId = (!!refObjects["company"]) ? refObjects["company"].related("address").get("id") : undefined;
            } else {
                self.req.body.brokerAddressId = (!!refObjects["broker.address"]) ? refObjects["broker.address"].get("id") : undefined;
            }
        }
    };

    /**
     * @function
     * @name getBroker
     * @description Gets broker from the database.
     *
     * @param {Object} carrier: All the processes/retrieved rows which are uncommitted
     * @param {Object - Transaction} t: Transaction to use
     *
     * @return {Object - Promise}
     */
    self.getBroker = function (refObjects, t) {
        return dbWorker.getEntity(self, refObjects, t);
    };

    /**
     * @function
     * @name addBroker
     * @description Adds broker to the database.
     *
     * @param {Object} carrier: All the processes/retrieved rows which are uncommitted
     * @param {Object - Transaction} t: Transaction to use
     *
     * @return {Object - Promise}
     */
    self.addBroker = function (refObjects, t) {
        self.setReferenceIds(refObjects);
        return dbWorker.addEntity(self, refObjects, t);
    };

    /**
     * @function
     * @name updateBroker
     * @description Updates broker to the database.
     *
     * @param {Object} carrier: All the processes/retrieved rows which are uncommitted
     * @param {Object - Transaction} t: Transaction to use
     *
     * @return {Object - Promise}
     */
    self.updateBroker = function(refObjects, t) {
        self.setReferenceIds(refObjects);
        return dbWorker.updateEntity(self, refObjects, t);
    };

    /**

     * @function
     * @name sendBrokerData
     * @description Sends broker information to the response object.
     *              The data can be of a single broker, if specified, otherwise of all brokers
     *
     * @param {Object - Request} req: Express request object
     * @param {Object - Response} res: Express response object
     * @param {Function} next: Next function to be invoked in the middleware queue
     *
     * @return undefined
     */
    self.sendBrokerData = function(req, res, next) {

        var whereObject     = (req.url.indexOf("/company/") >= 0)
                ? {company_id: req.params.id}
                : {broker_id: req.params.id},
            broker          = new Model.Broker().query({where: whereObject});

        broker = (whereObject.company_id)
            ? broker.fetchAll()
            : broker.fetch();

        broker.then(function(fetchedBrokers) {
            var responseData = util.getResponseData(fetchedBrokers, "Broker");
            res.status(responseData.code).json(responseData.content);
        })
        .catch(function(error) {
            res.status(500).json({
                message: "Error while fetching brokers."
            });
            console.trace(JSON.stringify(error));
        });
    };
};
