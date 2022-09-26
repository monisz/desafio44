const { ClientMongoDb } = require('../../dataBase/clientMongoDb');
const { productSchema } = require('../../dataBase/productSchema');
const { Product } = require('./product');
const { Database } = require('../../dataBase/connectionDatabase');

const connect = Database.getConnection(); 

class ProductDaoMongoDb {
    constructor() {
        this.clientMongoDb = new ClientMongoDb(productSchema, connect);
    }

    async saveProduct(product) {
        const dto = await product.toDTO();
        return this.clientMongoDb.save(dto);
    }

    async updateById(id, product) {
        const dto = await product.toDTO();
        return this.clientMongoDb.replaceById(id, dto);
    }

    async getProductById(id) {
        const dto = await this.clientMongoDb.getById(id);
        if (!dto) return dto
        else return Product.fromDTO(dto[0]);
    }

    async getProducts() {
        const products = await this.clientMongoDb.getAll();
        return products.map(prodDto => Product.fromDTO(prodDto));
    }

    async deleteProductById(id) {
        return await this.clientMongoDb.deleteById(id); 
    }
}

module.exports = { ProductDaoMongoDb };