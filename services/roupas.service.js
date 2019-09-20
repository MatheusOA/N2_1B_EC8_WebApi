var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('roupas');

var service = {};

service.getById = getById;
service.create = create;
//service.update = update;
//service.delete = _delete;

module.exports = service;

function getById(_id) {
    var deferred = Q.defer();

    db.roupas.findById(_id, function (err, roupa) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (roupa) {
            // return roupa
            deferred.resolve(roupa);
        } else {
            // roupa not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(roupaParam) {
    var deferred = Q.defer();

    // validation
    db.roupas.findOne(
        { codigoItem: roupaParam.codigoItem },
        function (err, roupa) {
            if (roupa.codigoItem) {
                // Code already exists
                deferred.reject('The code "' + roupaParam.codigoItem + '" is already taken');
            } else {
                createRoupa(roupaParam);
            }
        });

    function createRoupa(roupaParam) {
        // set user object to userParam without the cleartext password
        var roupa = roupaParam;

        db.roupas.insert(
            roupa,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}
/*
function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}*/