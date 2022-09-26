const router = require('express').Router();
const { getCartById, addProductToCart, deleteCartById, deleteProductFromCart, checkout } = require('./controllersCart');

//Para listar todos los productos de un carrito según su id
router.get('/:id/productos', getCartById);

//Para agregar un producto al carrito por id del producto
//el id del carrito es el de la session
router.post('/:id/productos', addProductToCart);

//Para borrar un carrito según su id
router.delete('/:id', deleteCartById);

//Para eliminar del carrito(id) el producto (id_prod)
router.delete('/:id/productos/:id_prod', deleteProductFromCart);

//Al finalizar la compra 
router.post('/compra', checkout);

module.exports = router;