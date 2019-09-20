var config = require('config.json');
var express = require('express');
var router = express.Router();
var roupasService = require('services/roupas.service');

// routes
router.post('/createRoupa', createRoupa);
router.get('/getRoupa', getCurrentRoupa);
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
    console.log(req.query);
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

function teste(req, res){
    console.log('Recebido com sucesso NA PORTA 9050!');
    res.send('OK');
}