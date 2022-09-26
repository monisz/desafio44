const logger = require('../../../utils/loggers/winston');

//Variable para manejo de autorización
const admin = process.env.ADMIN;

const isAdmin = (req, res, next) => {
    if (admin === "true") next();
    else res.status(403).send("método no autorizado");
};

logger.info(`admin: ${admin}`);

module.exports = isAdmin;