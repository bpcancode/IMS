export class Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    updatedAt?: Date;
    constructor(id: string, name: string, price: number, stock: number, updatedAt?: Date) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.updatedAt = updatedAt ? new Date(updatedAt) : new Date();
    }
    
}