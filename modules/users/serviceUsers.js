const { Container, colUser } = require('../../dataBase/containerMongoDb');
const sendMail = require('../../utils/mailer');

const defineUser = (dataUser) => {
    return {
        username: dataUser[0].username,
        name: dataUser[0].name,
        address: dataUser[0].address,
        age: dataUser[0].age,
        phone: dataUser[0].phone
    }
};

//Para buscar un usuario
const findUser = async (username) => {
    let user = await colUser.getUserById(username);
    return user;
};

//Para agregar un nuevo usuario
const saveUser = async (newUser) => {
    await colUser.saveUser(newUser);

};

//Envío de los avisos de compra por mail y whatsapp
const sendRegistrationNotices = (user) => {
    sendMail(user);
};

module.exports = { defineUser, findUser, saveUser, sendRegistrationNotices };