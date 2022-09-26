class Product {
    constructor(title, description, code, thumbnail, price, stock, timestamp) {
        this.title = title,
        this.description = description,
        this.code = code,
        this.thumbnail = thumbnail,
        this.price = price,
        this.stock = stock,
        this.timestamp = timestamp
    }

    static fromDTO(dto) {
        const prod = new Product();
        prod.title = dto.title;
        prod.description = dto.description;
        prod.code = dto.code;
        prod.thumbnail = dto.thumbnail;
        prod.price = dto.price;
        prod.stock = dto.stock;
        prod.timestamp = dto.timestamp;
        prod.id = dto.id;
        return prod;
    }

    toDTO() {
        const { title, description, code, thumbnail, price, stock, timestamp, id } = this;
        return {
            title, 
            description, 
            code, 
            thumbnail, 
            price, 
            stock, 
            timestamp, 
            id
        }
    }
}

module.exports = { Product };