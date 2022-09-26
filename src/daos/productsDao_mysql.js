const express = require('express');
const router = express.Router();
const tableProducts = require('../containers/productContainer_mysql');
const logger = require('../../utils/loggers/winston');

const admin = true;
const isAdmin = (req, res, next) => {
    if (admin === true ) next();
    else {
        logger.error('método no autorizado');
        res.status(403).send("método no autorizado");
    }
    };

//Vista de todos los productos
router.get('/', (req, res) => {
    const getProducts = (async () => {
        const products = await tableProducts.getAll();
        const username = req.session.username;
        res.render('main-products', {products, username});
    }) ();
});

//Para obtener un producto según su id
router.get('/:id', (req, res) => {
    const getProduct = (async () => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            logger.error(`${id} el parámetro no es un número`);
            return res.status(400).send({error: "el parámetro no es un número"});
        }
        const productFinded = await tableProducts.getById(id);
        if (productFinded.length == 0) {
            logger.error(`producto con id ${id} no encontrado`);
            return res.status(400).send({error: `producto con id ${id} no encontrado`});
        } else {
            const products = productFinded;
            res.render('main-products-esp', {products});
        }    
    }) ();
});

//Recibe y actualiza un producto por id
router.put('/:id', isAdmin, (req, res) => {
    const updateProduct = (async () => {
        const id = parseInt(req.params.id);
        const result = await tableProducts.replaceById(id, req.body);
            if (result == 0) {
                logger.error(`producto con id ${id} no encontrado`);
                res.status(404).send({error: "producto no encontrado"});
            } else res.send('producto modificado');
        }) ();
});

//Para borrar un producto según el id
router.delete('/:id', isAdmin, (req, res) => {
    const deleteProduct = (async () => {
        const id = parseInt(req.params.id);
        const result = await tableProducts.deleteById(id);
        if (result.deletedCount == 0) {
            logger.error(`producto con id ${id} no encontrado`);
            res.status(404).send({error: "producto no encontrado"});
        } else res.send("producto eliminado");
    }) ();
});


module.exports = router;

