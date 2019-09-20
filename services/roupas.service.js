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
service.getAll = getAll;
service.create = create;
service.update = update;
service.delete = _delete;

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

function getAll() {
    var deferred = Q.defer();
    var teste = db.roupas.find();
    console.log(teste);

    db.roupas.find(function (err, roupa) {
        
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

function update(_id, roupaParam) {
    var deferred = Q.defer();

    // validation
    db.roupas.findById(_id, function (err, roupa) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        else updateRoupa();        
    });
    console.log(roupaParam);

    function updateRoupa() {
        // fields to update
        var set = {
            tipo: roupaParam.tipo,
            marca: roupaParam.marca,
            caracteristicas: roupaParam.caracteristicas,
            tamanho: roupaParam.tamanho,
            cor: roupaParam.cor,
            valorEtiquetaCompra: roupaParam.valorEtiquetaCompra,
            valorPagoCompra: roupaParam.valorPagoCompra,
            valorMargem: roupaParam.valorMargem,
            preçoSugerido: roupaParam.preçoSugerido
        };

        db.roupas.update(
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

    db.roupas.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}