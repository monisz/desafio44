const { defineUser, sendRegistrationNotices } = require(`./serviceUsers`);
const { createCart } = require('../cart/serviceCart');
const logger = require('../../utils/loggers/winston');

const register = (req, res) => {
    res.render('register');
};

const registerUser = (req, res) => {
    const registerSuccess = 'Registrado exitosamente. Ir a Login para ingresar';
    sendRegistrationNotices(req.body);
    res.render('register', {registerSuccess});
};

const failRegister = (req, res) => {
    res.render('failregister');
};

const login = (req, res) => {
    if (!req.session.user) 
        res.render('login');
    else {
        const user = req.session.user;
        res.render('home',  {user});
    }
};

const loginUser = async (req, res) => {
    const user = defineUser(req.user);
    req.session.user = user;
    const idCart = await createCart();
    req.session.cart = idCart;
    logger.info(`carrito agregado id: ${idCart}`);
    res.render('home',  {user, idCart});
};

const faillogin = (req, res) => {
    res.render('faillogin');
};

const logout = (req, res) => {
    const username = req.session.user.username;
    req.session.destroy((err) => {
    logger.error(err);
    res.render('logout', {username})
    });
};


module.exports = { register, registerUser, failRegister, login, loginUser, faillogin, logout };