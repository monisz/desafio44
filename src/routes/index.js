const express = require('express');
const router = express.Router();
const { isLogin } = require('../../modules/users/utils/isLogin');
const { graphMiddle } = require('../../modules/products/graphql/graphql')

const routerUsers = require('../../modules/users/routerUsers');
const routerProducts = require('../../modules/products/routerProducts');
const routerCart = require('../../modules/cart/routerCart');
const routerMessages = require('../daos/messagesDao_firebase');
const routerRandom = require('../daos/numbersRandom');

router.use('/', routerUsers);
router.use('/api/productos', isLogin, routerProducts);
router.use('/api/carrito', isLogin, routerCart);
router.use('/api/mensajes', isLogin, routerMessages);
router.use('/api/randoms', isLogin, routerRandom);
router.use('/graphql', graphMiddle);

module.exports = router;