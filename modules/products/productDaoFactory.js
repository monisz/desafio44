const { ProductDaoMongoDb } = require('./productDaoMongoDb');

class ProductDaoFactory {
    create(persistenceType) {
        if(persistenceType === "mongoDb") return new ProductDaoMongoDb();
        if(persistenceType === "memory") return new ProductDaoMemory;
        if(persistenceType === "file") return new ProductDaoFile;
        if(persistenceType === "firebase") return new ProductDaoFirebase;
    }
}

module.exports = { ProductDaoFactory };