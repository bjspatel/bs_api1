var Model       = require("../../models/db-model"),	//Load bookshelf model
    dbWorker    = require("./db-worker");

module.exports = function(request, entityName) {

    var self        = this;
    this.req        = request;
    this.name       = entityName;
    this.Model      = Model.User;
    this.relations  = [];

    /**
     * @function
     * @name getUser
     * @description Gets user from the database.
     *
     * @param {Object} carrier: All the processes/retrieved rows which are uncommitted
     * @param {Object - Transaction} t: Transaction to use
     *
     * @return {Object - Promise}
     */
    self.getUser = function (refObjects, t) {
        return dbWorker.getEntity(self, refObjects, t);
    };

    /**
     * @function
     * @name addUser
     * @description Adds user to the database.
     *
     * @param {Object} carrier: All the processes/retrieved rows which are uncommitted
     * @param {Object - Transaction} t: Transaction to use
     *
     * @return {Object - Promise}
     */
    self.addUser = function(refObjects, t) {
        return dbWorker.addEntity(self, refObjects, t);
    };

    /**
     * @function
     * @name updateUser
     * @description Updates user to the database.
     *
     * @param {Object} carrier: All the processes/retrieved rows which are uncommitted
     * @param {Object - Transaction} t: Transaction to use
     *
     * @return {Object - Promise}
     */
    self.updateUser = function(refObjects, t) {
        return dbWorker.updateEntity(self, refObjects, t);
    };

    /**
     * @function
     * @name sendUserData
     * @description Sends user information to the response object.
     *              The data can be of a single user, if specified, otherwise of all users.
     *
     * @param {Object - Request} req: Express request object
     * @param {Object - Response} res: Express response object
     * @param {Function} next: Next function to be invoked in the middleware queue
     *
     * @return undefined
     */
    self.sendUserData = function(req, res, next) {
        var model = new Model.User();

        model = (req.params.id)
            ? model.query({where: {user_id: req.params.id}}).fetch()
            : model.fetchAll();

        model.then(function(users) {
            var responseData = util.getResponseData(users, "User");
            if(responseData.content.password) {
                responseData.content.password = undefined;
            } else {
                for(var i=0; i<responseData.content.length; i++) {
                    responseData.content[i].password = undefined;
                }
            }
            res.status(responseData.code).json(responseData.content);
        })
        .catch(function(error) {
            res.status(500)
            .json({
                message: "Error while fetching users."
            });
            console.trace(JSON.stringify(error));
        });
    };

    /**
     * @function
     * @name updateUserData
     * @description Updates user information in the database.
     *
     * @param {Object - Request} req: Express request object
     * @param {Object - Response} res: Express response object
     * @param {Function} next: Next function to be invoked in the middleware queue
     *
     * @return undefined
     */
    self.updateUserData = function(req, res, next) {
    	new Model.User()
        .query({where: {user_id: req.params.id}})
    	.fetch()
    	.then(function(fetchedUser) {
            this.getResponseData(fetchedUser, "User", "update");
            if(fetchedUser) {
                if(req.body.password) {
                    fetchedUser.set("password", bcrypt.hashSync(req.body.password));
                }
                fetchedUser.save()
                .then(function(savedUser) {
                    res.status(200).json({message: "User '" + req.params.id + "' updated successfully."});
                });
            } else {
                res.status(404).json({message: "User '" + req.params.id + "' not found"});
            }
    	})
    	.catch(function(error) {
            res.status(500).json({message: "Error while updating user."});
    		console.trace(JSON.stringify(error));
    	});
    };

};
