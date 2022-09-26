const { Container, colCart } = require('../../dataBase/containerMongoDb');
const sendMail = require('../../utils/mailer');
const sendWhatsapp = require('../../utils/whatsapp');

//Para crear el carrtio carrito luego del logueo
const createCart = async () => {
    const newCart = {
        timestamp : Date.now(),
        products: []
    };
    return await colCart.save(newCart);
};


//Para obtener un carrito según su id
const getCart = async (id) => {
    const cartFinded = await colCart.getById(id);
    return cartFinded;
}

//Para actualizar un carrito por id
const updateCart = async (id, newData) => {
    const updatedCart = await colCart.replaceById(id, newData);
    return updatedCart;
};

//Para borrar un carrito según el id
const deleteCart = async (id) => {
    const result = await colCart.deleteById(id);
    return result;
};

//Envío de los avisos de compra por mail y whatsapp
const sendPurchaseNotices = (user, productsInCart) => {
    sendWhatsapp(user);
    const dataCheckout = {
        user: user,
        products: productsInCart   
    }
    sendMail(dataCheckout);
    return dataCheckout;
};


module.exports = { createCart, getCart, updateCart, deleteCart, sendPurchaseNotices};