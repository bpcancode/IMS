
export class Sale {
    id: string;
    itemId: string;
    quantity: number;
    totalPrice: number;
    userId: string;
    date: Date;

    constructor(
        id: string,
        itemId: string,
        quantity: number,
        totalPrice: number,
        userId: string,
        date: Date
    ) {
        this.id = id;
        this.itemId = itemId;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.userId = userId;
        this.date = date;
    }

}
