var Model       = require("../../models/db-model"),	//Load bookshelf model
    dbWorker    = require("./db-worker");

module.exports = function(request, entityName) {

    var self        = this;
    this.req        = request;
    this.name       = entityName;
    this.Model      = Model.Company;
    this.relations  = ["address"];

    /**
     * @function
     * @name setReferenceIds
     * @description Sets id values of the reference entities which are related to company.
     *
     * @param {Object} carrier: All the processes/retrieved rows which are uncommitted
     *
     * @return {Object - Promise}
     */
    self.setReferenceIds = function(refObjects) {
        if(!!refObjects) {
            self.req.body.addressId = (!!refObjects["company.address"]) ? refObjects["company.address"].get("id") : undefined;
        }
    };

    /**
     * @function
     * @name getCompany
     * @description Gets company from the database.
     *
     * @param {Object} carrier: All the processes/retrieved rows which are uncommitted
     * @param {Object - Transaction} t: Transaction to use
     *
     * @return {Object - Promise}
     */
    self.getCompany = function (refObjects, t) {
        return dbWorker.getEntity(self, refObjects, t);
    };
    /**

     * @function
     * @name addCompany
     * @description Adds company to the database.
     *
     * @param {Object} carrier: All the processes/retrieved rows which are uncommitted
     * @param {Object - Transaction} t: Transaction to use
     *
     * @return {Object - Promise}
     */
    self.addCompany = function (refObjects, t) {
        self.setReferenceIds(refObjects);
        return dbWorker.addEntity(self, refObjects, t);
    };

    /**
     * @function
     * @name updateCompany
     * @description Updates company to the database.
     *
     * @param {Object} carrier: All the processes/retrieved rows which are uncommitted
     * @param {Object - Transaction} t: Transaction to use
     *
     * @return {Object - Promise}
     */
    self.updateCompany = function (refObjects, t) {
        self.setReferenceIds(refObjects);
        return dbWorker.updateEntity(self, refObjects, t);
    };

    /**
     * @function
     * @name sendCompanyData
     * @description Sends company information to the response object.
     *              The data can be of a single company, if specified, otherwise of all companies
     *
     * @param {Object - Request} req: Express request object
     * @param {Object - Response} res: Express response object
     * @param {Function} next: Next function to be invoked in the middleware queue
     *
     * @return undefined
     */
    self.sendCompanyData = function(req, res, next) {
        var company = new Model.Company();

        company = (req.params.id)
            ? company.query({where: {company_id: req.params.id}}).fetch()
            : company.fetchAll();

        company.then(function(fetchedCompanies) {
            var responseData = util.getResponseData(fetchedCompanies, "Company");
            res.status(responseData.code).json(responseData.content);
        })
        .catch(function(error) {
            res.status(500)
            .json({
                message: "Error while fetching companies."
            });
            console.trace(JSON.stringify(error));
        });
    };

    /**
     * @function
     * @name updateCompanyData
     * @description Updates company information in the database.
     *
     * @param {Object - Request} req: Express request object
     * @param {Object - Response} res: Express response object
     * @param {Function} next: Next function to be invoked in the middleware queue
     *
     * @return undefined
     */
    self.updateCompanyData = function(req, res, next) {

        new Model.Company()
        .query({where: {company_id: req.params.id}})
    	.fetch()
    	.then(function(fetchedCompany) {

            if(fetchedCompany) {
                if (fetchedCompany.address_id === 1) {
                    address.addAddress(req, fetchedCompany);
                } else {
                    address.updateAddress(req, fetchedCompany);
                }
                var propertyNameMap = require("../rest/property-map/company.json");
                var allFieldsPassed = util.prepareDBObject(fetchedCompany, req, propertyNameMap);
                if(!allFieldsPassed) {
                    res.status(400).json({message: "All required parameters not passed."});
                    next();
                } else {
                    fetchedCompany
                    .save()
                    .then(function(savedCompany) {
                        res.status(200).json({message: "Company '" + req.params.id + "' updated successfully."});
                    });
                }
            } else {
                res.status(404).json({message: "Company '" + req.params.id + "' not found."});
            }
    	})
    	.catch(function(error) {
            res.status(500).json({message: "Error while updating company."});
    		console.trace(JSON.stringify(error));
    	});
    };

};
