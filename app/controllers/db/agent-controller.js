var Model       = require("../../models/db-model"),	//Load bookshelf model
    dbWorker    = require("./db-worker");

module.exports = function(request, entityName) {

    var self        = this;
    this.req        = request;
    this.name       = entityName;
    this.Model      = Model.Agent;
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
            self.req.body.agentCompanyId = (!!refObjects["company"]) ? refObjects["company"].get("id") : undefined;
            self.req.body.agentCreditCardId = (!!refObjects["creditcard"]) ? refObjects["creditcard"].get("id") : undefined;
            if(!!self.req.body.agentUseCompanyAddress) {
                self.req.body.agentAddressId = (!!refObjects["company"]) ? refObjects["company"].related("address").get("id") : undefined;
            } else {
                self.req.body.agentAddressId = (!!refObjects["agent.address"]) ? refObjects["agent.address"].get("id") : undefined;
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
    self.getAgent = function (refObjects, t) {
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
    self.addAgent = function (refObjects, t) {
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
    self.updateAgent = function(refObjects, t) {
        self.setReferenceIds(refObjects);
        return dbWorker.updateEntity(self, refObjects, t);
    };

    /**
     * @function
     * @name sendAgentData
     * @description Sends agent information to the response object.
     *              The data can be of a single agent, if specified, otherwise of all agents
     *
     * @param {Object - Request} req: Express request object
     * @param {Object - Response} res: Express response object
     * @param {Function} next: Next function to be invoked in the middleware queue
     *
     * @return undefined
     */
    self.sendAgentData = function(req, res, next) {

        var whereObject     = (req.url.indexOf("/company/") >= 0)
                ? {company_id: req.params.id}
                : {agent_id: req.params.id},
            restController  = this,
            agent           = new Model.Agent().query({where: whereObject});

        agent = (whereObject.company_id)
            ? agent.fetchAll()
            : agent.fetch();

        agent.then(function(fetchedAgents) {
            var responseData = util.getResponseData(fetchedAgents, "Agent");
            res.status(responseData.code).json(responseData.content);
        })
        .catch(function(error) {
            res.status(500)
            .json({
                message: "Error while fetching agents."
            });
            console.trace(JSON.stringify(error));
        });
    };

    /**
     * @function
     * @name inviteAgent
     * @description Invites agent by signing up them.
     *
     * @param {Object - Request} req: Express request object
     * @param {Object - Response} res: Express response object
     * @param {Function} next: Next function to be invoked in the middleware queue
     *
     * @return undefined
     */
    self.inviteAgent = function(req, res, next) {

        var newAgent = {
            email: req.body.email,
            company_id: req.body.companyId,
            start_date: req.body.startDate,
            office_location: req.body.officeLocation,
            address_id: 1,
            credit_card_id: 1,
            bank_account_id: 1,
            onboarding_plan_id: 1,
            status: 1
        };

        new Model.Agent(newAgent)
        .save()
        .then(function(savedAgent) {
            res.status(200).json({message: "Agent '" + savedAgent.get("email") + "' invited successfullly."});
        })
        .catch(function(error) {
            res.status(500).json({message: "Error while saving agent."});
            console.trace(JSON.stringify(error));
        });
    };
};
