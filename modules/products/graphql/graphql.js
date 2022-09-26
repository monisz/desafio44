const fs = require('fs');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const path = require('path');
const { getAllProducts, getProductById, addProduct, updateProduct, deleteProductById } = require('./resolvers');

const schemaContent = fs.readFileSync(path.join(__dirname,'./products.graphql')).toString();
const schema = buildSchema(schemaContent);

const graphMiddle = graphqlHTTP({
  schema,
  rootValue: {
    getAllProducts: getAllProducts,
    getProductById: getProductById,
    addProduct: addProduct,
    updateProduct: updateProduct,
    deleteProductById: deleteProductById
  },
  graphiql: true,
});

module.exports = { graphMiddle };