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
    var teste = db.collection("roupas").find({}).toArray(function(err,result){
        if (err) throw err;
        console.log(result);        
    });
    console.log(teste);

    db.collection("roupas").find({}).toArray(function (err, roupa) {
        
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
    roupaParam.valorMargem = roupaParam.valorPagoCompra*2;
    roupaParam.valorMargem = roupaParam.valorMargem.toString();
    db.roupas.findOne(
        { codigoItem: roupaParam.codigoItem },
        function (err, roupa) {
            if (roupa) {
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
    
    roupaParam.valorMargem = roupaParam.valorPagoCompra*2;
    roupaParam.valorMargem = roupaParam.valorMargem.toString();

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
            precoSugerido: roupaParam.precoSugerido
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