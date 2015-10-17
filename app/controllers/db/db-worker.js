var util        = {},
    Promise     = require("bluebird"),
    fs          = require("fs");

util.prepareDataObject = function(dbObject, req, entityName, identifiersOnly) {

    var allFieldsPassed = true,
        entityMetadata  = require("../metadata/" + entityName + ".json");

    for(var uiName in entityMetadata) {
        if(identifiersOnly && !entityMetadata[uiName].isIdentifier) {
            continue;
        }
        if(req.body[uiName]) {
            var value = req.body[uiName];
            switch(entityMetadata[uiName]["type"]) {
                case "date":
                    //convert string to date here
                case "integer":
                    //convert string to integer here
                case "file":
                    //not decied yet  9687028979
            }
            var dbName = entityMetadata[uiName]["dbName"];
            if(dbObject.set) {
                dbObject.set(dbName, value);
            } else {
                dbObject[dbName] = value;
            }
        } else {
            if(entityMetadata[uiName].isRequired === true) {
                allFieldsPassed = false;
            }
        }
    }

    return allFieldsPassed;
};

util.addEntity = function (entity, refObjects, t) {
    return new Promise(function(resolve, reject) {
        var newEntity   = {},
            identifier  = {},
            Model       = entity.Model,
            req         = entity.req;

        //Auto-increament field should not be provided while adding a record
        var entityId = entity.name.split(".").pop() + "Id";
        req.body[entityId] = undefined;

        util.prepareDataObject(identifier, entity.req, entity.name, true);

        new Model(identifier)
        .fetch()
        .then(function(fetchedEntity) {
            if(!!fetchedEntity && Object.keys(identifier).length != 0) {
                //The entity already exists, do reject (except it is a 'company' table)
                if(entity.name !== "company") {
                    reject(new Error("Row with parameters '" + JSON.stringify(identifier) + "' already exists in table '" + entity.name + "'"));
                } else {
                    if(!refObjects) refObjects = {};
                    var params = !!t ? [refObjects, t] : refObjects;
                    refObjects[entity.name] = fetchedEntity;
                    resolve(params);
                }
            } else {
                //The entity doesn't exist, add it
                for(var refEntityName in refObjects) {
                    req.body[refEntityName + "Id"] = refObjects[refEntityName].get("id");
                }
                util.prepareDataObject(newEntity, req, entity.name);

                new Model(newEntity)
                .save(null, {transacting: t})
        		.then(function(savedEntity) {
                    if(!refObjects) refObjects = {};
                    var params = !!t ? [refObjects, t] : refObjects;
                    refObjects[entity.name] = savedEntity;
                    resolve(params);
        		})
        		.catch(function(error) {
                    console.log(error);
        			reject(new Error("Row could not be inserted in table '" + entity.name + "': " + JSON.stringify(error)));
        		});
            }
        })
    });
};

util.updateEntity = function (entity, refObjects, t) {
    return new Promise(function(resolve, reject) {

        var updateData      = {},
            entityMetadata  = require("../metadata/" + entity.name + ".json"),
            req             = entity.req;

        for(var refEntityName in refObjects) {
            req.body[refEntityName + "Id"] = refObjects[refEntityName].get("id");
        }

        util.prepareDataObject(updateData, req, entity.name);

        refObjects[entity.name]
        .save(updateData, {transacting: t})
        .then(function(updatedEntity) {
            if(!refObjects) refObjects = {};
            var params = !!t ? [refObjects, t] : refObjects;
            refObjects[entity.name] = updatedEntity;
            resolve(params);
        })
        .catch(function(error) {
            reject(new Error("Row could not be updated in table '" + entity.name + "': " + JSON.stringify(error)));
        });
    });
};

util.getEntity = function (entity, refObjects, t) {

    return new Promise(function(resolve, reject) {

        var identifier  = {},
            relations   = entity.relations,
            req         = entity.req,
            Model       = entity.Model;

        util.prepareDataObject(identifier, entity.req, entity.name, true);

        new Model(identifier)
        .fetch({withRelated: relations})
        .then(function(fetchedEntity) {
            if(!!fetchedEntity) {
                if(!refObjects) refObjects = {};
                var params = !!t ? [refObjects, t] : refObjects;
                refObjects[entity.name] = fetchedEntity;
                for(var i=0; i<relations.length; i++) {
                    var relationName = relations[i];
                    var relationParts = relationName.split(".");
                    var relatedObject = fetchedEntity;
                    for(var j=0; j<relationParts.length; j++) {
                        relatedObject = relatedObject.related(relationParts[j]);
                    }

                    var metaFilePath = "../metadata/" + entity.name + "." + relationName + ".json";
                    if(fs.existsSync(metaFilePath)) {
                        refObjects[entity.name + "." + relationName] = relatedObject;
                    } else {
                        refObjects[relationName] = relatedObject;
                    }
                }
                resolve(params);
            } else {
                reject(new Error("Row could not be retrieved from table '" + entity.name + "'"));
            }
        });
    });
};

module.exports = util;
