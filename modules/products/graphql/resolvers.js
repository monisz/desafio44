const { ProductService } = require("../serviceProducts");

const productService = new ProductService();

const getAllProducts = () => {
  return productService.getListProducts();
}

const getProductById = ({ id }) => {
  return productService.getProduct(id);
}

const addProduct = async ({args}) => {
    const { title, description, code, thumbnail, price, stock } = args;
    const newProduct = await productService.addProductToList({ title, description, code, thumbnail, price, stock });
    return newProduct;
}

const updateProduct = async ({id, args}) => {
    const { title, description, code, thumbnail, price, stock, timestamp } = args;
    const updatedProduct = await productService.replaceProduct(id, { title, description, code, thumbnail, price, stock, timestamp });
    return updatedProduct;
}

const deleteProductById = async ({id}) => {
  const result = await productService.deleteProduct(id);
  return result;
}

module.exports = {
    getAllProducts, getProductById, addProduct, updateProduct, deleteProductById
}