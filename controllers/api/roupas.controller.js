var config = require('config.json');
var express = require('express');
var router = express.Router();
var roupasService = require('services/roupas.service');

// routes
router.post('/createRoupa', createRoupa);
router.post('/deleteRoupa', deleteRoupa);
router.post('/updateRoupa', updateRoupa);
router.get('/getRoupa', getCurrentRoupa);
router.get('/getAllRoupas', getAllRoupas);
router.get('/teste', teste);

module.exports = router;


function createRoupa(req, res) {
    roupasService.create(req.body)
        .then(function () {
            var roupa = req.body;
            roupa.status = 'CRIADO';
            res.send(roupa);
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentRoupa(req, res) {
    
    roupasService.getById(req.query._id)
        .then(function (roupa) {
            if (roupa) {    
                res.send(roupa);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllRoupas(req, res) {
    roupasService.getAll()
        .then(function (roupa) {
            if (roupa) {    
                res.send(roupa);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateRoupa(req, res) {
    roupasService.update(req.query._id, req.body)
        .then(function () {
            var roupa = req.body;
            roupa.status = 'ATUALIZADO';
            res.send(roupa);
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteRoupa(req, res) {
    roupasService.delete(req.query._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function teste(req, res){
    console.log('Recebido com sucesso NA PORTA 9050!');
    res.send('OK');
}