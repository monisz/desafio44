const { getCart, updateCart, deleteCart, sendPurchaseNotices } = require(`./serviceCart`);
const { ProductService } = require(`../products/serviceProducts`);

const productService = new ProductService()
const logger = require('../../utils/loggers/winston');

//Para listar todos los productos de un carrito según su id
const getCartById = async (req, res) => {
    let idCart = 0;
    if (req.params.id) idCart = parseInt(req.params.id);
    else idCart = req.session.cart;
    if (isNaN(idCart)) return res.status(400).send({error: "el parámetro no es un número"});
    const cart = await getCart(idCart);
    if (!cart) res.status(404).send({error: "carrito no encontrado"});
    else {
        logger.info(`cart en get/ ${cart}`);
        const user = req.session.user;
        const productsInCart = cart[0].products;
        res.render('cart', {productsInCart, user, idCart});
    }
};

//Para agregar un producto al carrito por id del producto (el id del carrito es el de la session)
const addProductToCart = async (req, res) => {
    const idProduct = parseInt(req.params.id);
    if (isNaN(idProduct)) return res.status(400).send({error: "el parámetro no es un número"});
    const productToAdd = await productService.getProduct(idProduct);
    if (!productToAdd) res.status(404).send({error: "producto no encontrado"});
    else {
        const idCart = req.session.cart;
        const cartFinded = await getCart(idCart);
        if (!cartFinded) res.send('error: no existe ese carrito');
        else {
            cartFinded[0].products.push(productToAdd);
            const cartModified = await updateCart(idCart, cartFinded[0]);
            const productsInCart = cartModified[0].products;
            logger.info(`producto id: ${idProduct} agregado en carrito id: ${idCart}`);
            const user = req.session.user;
            res.render('cart', {user, cartModified, productsInCart, idCart});
        }
    }
};

//Para borrar un carrito según el id
const deleteCartById = (req, res) => {
    const id = parseInt(req.params.id);
    const result = deleteCart(id);
    if (result.deletedCount == 0) res.status(404).send({error: "producto no encontrado"});
    else res.send("producto eliminado");
};

//Para eliminar del carrito(id) el producto (id_prod)
const deleteProductFromCart = (req, res) => {
    const idCart = parseInt(req.params.id);
    const idProduct = parseInt(req.params.id_prod);
    if ( isNaN(idCart) || isNaN(idProduct) ) return res.status(400).send({error: "algún parámetro no es un número"});
    else {
        const cartFinded = getCart(idCart);
        if (!cart) res.send('error: no existe ese carrito');
        else {
            const productFinded = cartFinded[0].products.find((elem) => elem.id === idProduct);
            if (!productFinded) res.send('error: no existe ese producto en el carrito');
            else {
                cartFinded[0].products = cartFinded[0].products.filter((elem) => elem.id !== idProduct);
                const cartModified = updateCart(idCart, cartFinded[0]);
                const productsInCart = cartModified[0].products;
                logger.info(`carrito modificado ${cartModified[0]}`)
            /* const user = req.session.user; */
            /* res.render('cart', {user, cartModified, cart, productsInCart, idCart}); */        
                res.send(`producto id: ${idProduct} eliminado del carrito id: ${idCart}`);
            };
        }
    }
};

//Al finalizar la compra 
const checkout = async (req, res) => {
    const idCart = req.session.cart;
    const cartFinded = await getCart(idCart);
    if (!cartFinded) res.send('error: no existe ese carrito');
    else {
        const productsInCart = cartFinded[0].products
        const user = req.session.user;
        const dataCheckout = sendPurchaseNotices(user, productsInCart);        
        logger.info(`productos comprados ${productsInCart}`);
        res.render('cart', {productsInCart, user, idCart, dataCheckout});
    }
};

module.exports = { getCartById, addProductToCart, deleteCartById, deleteProductFromCart, checkout };