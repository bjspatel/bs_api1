// var config  = require("./config/development");
//
// var knex = require("knex")({
//    client: 'mysql',
//    connection: {
// 	   host: 		config.dburl,  // your host
// 	   user: 		config.dbusername, // your database user
// 	   password: 	config.dbpassword, // your database password
// 	   database: 	config.dbdatabasename
//    },
//    debug: true
// });
//
// var bookshelf 	= require('bookshelf')(knex);
//
// var User = bookshelf.Model.extend({
// 	tableName: 'user',
// 	idAttribute: 'user_id'
// });
// var Address = bookshelf.Model.extend({
// 	tableName: 'address',
// 	idAttribute: 'address_id',
//     broker: function() {
//         return this.belongsTo(Broker);
//     },
//     company: function() {
//         return this.belongsTo(Company, 'address_id');
//     }
// });
//
// var Company = bookshelf.Model.extend({
// 	tableName: 'company',
//     idAttribute: 'company_id',
// 	address: function() {
// 		return this.hasOne(Address, 'address_id');
// 	}
// });
// var Broker = bookshelf.Model.extend({
//     tableName: 'broker',
//     //idAttribute: ['broker_id', 'company_id', 'billing_address_id'],
//     company: function() {
//         return this.belongsTo(Company, 'company_id');
//     },
//     billingAddress: function() {
//         return this.hasOne(Address, 'address_id');
//     }
// });
//
// var Model = {
//    User: User,
//    Company: Company,
//    Address: Address,
//    Broker: Broker
// };

var Model       = require("./app/models/db-model"),	//Load bookshelf model
    util        = require("./app/controllers/db/db-util"),
    database 	= require('./app/database/db'),
    Promise     = require("bluebird"),
    bookshelf 	= database.bookshelf,
    request     = {
        body: {
            address: "My New Address",
            city: "My New City",
            zipCode: "My New ZipCode",
            country: "My New Country",
            stateProv: "My New StateProv",
            email: "myEmail@email.com",
            firstName: "MyFirstName",
            lastName: "MyLastName",
            companyName: "MyAnotherCompany",
            type: 1,
            password: "MyPassword",
            userId: 36
        }
    };

var Address = function(request) {
    var req = request;

    this.addAddress = function(t) {
        return new Promise(function(resolve, reject) {

            var newAddress = {},
                propertyNameMap = require("./app/controllers/rest/property-map/address.json");

            util.prepareDBObject(newAddress, req, propertyNameMap);

            new Model.Address(newAddress)
            .save(null, {transacting: t})
            .then(function(savedAddress) {
                var refObjects = {},
                    params = !!t ? [refObjects, t] : refObjects;
                refObjects.address = savedAddress;

                resolve(params);
            })
            .catch(function(error) {
                throw new Error("Error while saving company: " + JSON.stringify(error));
            });
        })
    };

    this.updateAddress = function(t) {
        return new Promise(function(resolve, reject) {

            if(req.body.addressId === 1) {
                return this.addAddress(t);
            }

            console.log("FILETER: " + JSON.stringify({id: req.body.addressId}, null, 4));

            new Model.Address({id: req.body.addressId})
            .fetch()
            .then(function(fetchedAddress) {
                console.log("##1");
                var propertyNameMap = require("./app/controllers/rest/property-map/address.json");
                console.log("##2");
                util.prepareDBObject(fetchedAddress, req, propertyNameMap);
                console.log("##3");
                return fetchedAddress.save(null, {transacting: t});
            })
            .then(function(updatedAddress) {
                var refObjects = {},
                    params = !!t ? [refObjects, t] : refObjects;
                refObjects.address = updatedAddress;
                resolve(params);
            })
            .catch(function(error) {
                throw new Error("Error while saving company: " + JSON.stringify(error));
            });
        })
    };
}

var Company = function(request) {
    var req = request;

    this.addCompany = function (t) {
        return new Promise(function(resolve, reject) {

            var companyObject = {
    			name: req.body.companyName
    		};

    		new Model.Company(companyObject)
    		.fetch({withRelated: ["address"]})
    		.then(function(fetchedCompany) {
    			if(!fetchedCompany) {
    				companyObject.address_id = 1;
    				new Model.Company(companyObject)
    				.save(null, {transacting: t})
    				.then(function(savedCompany) {
                        var refObjects = {},
                            params = !!t ? [refObjects, t] : refObjects;
                        refObjects.company = savedCompany;

                        resolve(params);
    				})
    				.catch(function(error) {
    					throw new Error("Error while saving company: " + JSON.stringify(error));
    				});
    			} else {

                    var relatedAddress = fetchedCompany.related("address");

                    var modelAddress = new Model.Address({address: "Model Address"});
                    console.log("MODEL");
                    console.log(modelAddress);
                    modelAddress.save()
                    .then(function(savedAddress) {
                        console.log("AFTER SAVE");
                        console.log(savedAddress);
                    });


                    new Model.Address({id: 31})
            		.fetch()
            		.then(function(fetchedAddress) {

                        relatedAddress.set("address", "UpdatedNewAgain");
                        console.log("RELATED");
                        console.log(relatedAddress);
                        relatedAddress.save();

                        fetchedAddress.set("address", "UpdatedNewAgain");
                        console.log("FETCHED");
                        console.log(fetchedAddress);
                        fetchedAddress.save();
                    });

                    // var refObjects = {},
                    //     params = !!t ? [refObjects, t] : refObjects;
                    // refObjects.company = fetchedCompany;
                    // resolve(params);
    			}
    		});
        });
    };

    this.getCompany = function(refObjects, t) {
        return new Promise(function(resolve, reject) {

        });
    };

    this.updateCompany = function (refObjects, t) {
        return new Promise(function(resolve, reject) {

            var updateData = {},
                propertyNameMap = require("./app/controllers/rest/property-map/company.json");

            req.body.addressId = refObjects.address.get("id");
            util.prepareDBObject(updateData, req, propertyNameMap);

    		new Model.Company({id: updateData.id})
    		.fetch()
            .save(updateData, {transacting: t})
    		.then(function(updatedCompany) {
                if(!refObjects) refObjects = {};
                var params = !!t ? [refObjects, t] : refObjects;
                refObjects.company = updatedCompany;
                resolve(params);
    		})
            .catch(function(error) {
                reject(new Error("Company did not update successfully."));
            });
        });
    };
};

Broker = function(request) {
    var req = request;

    this.addBroker = function (refObjects, t) {
        return new Promise(function(resolve, reject) {
            var newBroker = {},
                propertyNameMap = require("./app/controllers/rest/property-map/broker.json");

            req.body.companyId = refObjects.company.get("id");
            util.prepareDBObject(newBroker, req, propertyNameMap);

            new Model.Broker(newBroker)
    		.save(null, {transacting: t})
    		.then(function(savedBroker) {
                if(!refObjects) refObjects = {};
                var params = !!t ? [refObjects, t] : refObjects;
                refObjects.broker = savedBroker;
                resolve(params);
    		})
    		.catch(function(error) {
    			reject(new Error("Error while saving broker: " + JSON.stringify(error)));
    		});
        });
    };

    this.updateBroker = function(refObjects, t) {

        var updateBroker = {},
            propertyNameMap = require("./app/controllers/rest/property-map/broker.json");

        req.body.companyId = refObjects.company ? refObjects.company.get("id") : undefined;
        req.body.addressId = refObjects.address ? refObjects.address.get("id") : undefined;
        req.body.creditCardId = refObjects.creditCard ? refObjects.creditCard.get("id") : undefined;
        util.prepareDBObject(updateBroker, req, propertyNameMap)

        new Model.Broker(newBroker)
        .fetch()
        .save(updateBroker, {transacting: t})
        .then(function(savedBroker) {
            if(!refObjects) refObjects = {};
            var params = !!t ? [refObjects, t] : refObjects;
            refObjects.broker = updatedBroker;
            resolve(params);
        })
        .catch(function(error) {
            reject(new Error("Error while saving broker: " + JSON.stringify(error)));
        });
    }
}

User = function(request) {
    var req = request;

    this.addUser = function(refObjects, t) {
        return new Promise(function(resolve, reject) {

            var newUser = {},
                propertyNameMap = require("./app/controllers/rest/property-map/user.json");

            req.body.referenceId = (!!refObjects.broker)
                                    ? refObjects.broker.get("id")
                                    : ((!!refObjects.agent) ? refObjects.agent.get("id") : undefined);
            util.prepareDBObject(newUser, req, propertyNameMap)

            new Model.User(newUser)
    		.save(null, {transacting: t})
    		.then(function(savedUser) {
                if(!refObjects) refObjects = {};
                var params = !!t ? [refObjects, t] : refObjects;
                refObjects.user = savedUser;
                resolve(params);
    		})
    		.catch(function(error) {
    			reject(new Error("Error while saving user: " + JSON.stringify(error, null, 4)));
    		});
        });
    };

    this.updateUser = function(refObjects, t) {
        return new Promise(function(resolve, reject) {

            var updateData = {},
                propertyNameMap = require("./app/controllers/rest/property-map/user.json");

            new Model.User({id: req.body.userId})
            .fetch()
            .then(function(fetchedUser) {
                util.prepareDBObject(fetchedUser, req, propertyNameMap)
                fetchedUser.save()
                .then(function(updatedUser) {
                    if(!refObjects) refObjects = {};
                    var params = !!t ? [refObjects, t] : refObjects;
                    refObjects.user = updatedUser;
                    resolve(params);
                });
            })
            .catch(function(error) {
                reject(new Error("Error while updating user: " + JSON.stringify(error, null, 4)));
            });
        })
    }
};

var restUtil = require("./app/controllers/rest/rest-util");

address = new Address(request);
company = new Company(request);
broker  = new Broker(request);
user    = new User(request);

//signup - [DONE]
// bookshelf.transaction(function(t) {
//     company.addCompany(t)
//     .spread(broker.addBroker)
//     .spread(user.addUser)
//     .then(t.commit)
// });

//put user
// request.body.password = "Updated password";
// user.updateUser();

//put Company
bookshelf.transaction(function(t) {
    company.addCompany(t);
});

//put Company
// bookshelf.transaction(function(t) {
//     company.getCompany(t)
//     .spread(address.updateAddress)
//     .tap(console.log)
//     .spread(company.updateCompany)
//     .tap(console.log)
//     .then(t.commit)
// });

// var response = restUtil.getResponseData(savedCompany, "Company", "add");
// restUtil.sendResponse(response.code, response.content);






// var Parent = bookshelf.Model.extend({
// 	tableName: 'parent',
// 	child: function() {
// 		return this.hasOne(Child);
// 	}
// });
//
// var Child = bookshelf.Model.extend({
// 	tableName: 'child',
// 	//this has an attribute parent_id
// 	parent: function() {
// 		return this.belongsTo(Parent);
// 	}
// });
//
// var parent, child;
// require("colors");
//
// Parent.forge({name: "Parent"}).save()
// .then(function (_parent) {
// 	parent = _parent;
// 	return Child.forge({name: "Child"}).save();
// })
// .then(function (_child) {
// 	child = _child;
// 	child.related('parent').set(parent);
// 	return child.save();
// })
// .then(function(saved) {
//     console.log((JSON.stringify(saved, null, 4)).green);
//
//     Parent.forge({name: "Parent"})
//     .fetch({withRelated: "child"})
//     .then(function(fetchedParent) {
//         console.log((JSON.stringify(fetchedParent, null, 4)).yellow);
//     })
//     .catch(function(error) {
//         console.log((JSON.stringify(error, null, 4)).red);
//     });
//
//
// });

function test() {


    // new Company()
    // .where({company_id: 12})
    // .fetch({withRelated: ["address"]})
    // .then(function(model) {
    //     console.log(model.toJSON());
    // });

    // new Address({id: 1})
    // .fetch({withRelated: ["company"]})
    // .then(function(model) {
    //     console.log(model.toJSON());
    // });


    // Broker
    // .where({broker_id: 23})
    // .fetch({withRelated: ["billingAddress"]})
    // .then(function(model) {
    //     console.log(model.toJSON());
    // })
}
//test();
