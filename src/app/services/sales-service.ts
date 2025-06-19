import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { ProductService } from './product-service';
import { ApiService } from './api-service';
import { AuthService } from './auth-service';
import { Sale } from '../models/sales-model';
import { SessionService } from './session-service';
import { STORAGE_CONSTANTS } from '../constants/storage-constants';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

    constructor(
    private apiService: ApiService,
    private itemService: ProductService,
    private session: SessionService
  ) {}

  async getSales(){
    return await this.apiService.getData<Sale[]>(STORAGE_CONSTANTS.SALE);
  }

  async createSale(itemId: string, quantity: number) {
    const currentUser = this.session.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const item = await this.itemService.getItemById(itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    // Check if enough quantity available
    if (item.stock < quantity) {
      throw new Error('Not enough items in stock');
    }

    // Create sale record
    const sale: Sale = new Sale(
        crypto.randomUUID(),
        itemId,
        quantity,
        item.price * quantity,
        currentUser.id,
        new Date()
    )

    // Update inventory
    await this.itemService.sellItem(itemId, quantity);
    // Save sale record
    const sales = await this.getSales();
    if (!sales) {
      await this.apiService.setData(STORAGE_CONSTANTS.SALE, JSON.stringify([sale]));
      return sale;
    }
    const updatedSales = [...sales, sale];
    await this.apiService.setData(STORAGE_CONSTANTS.SALE, JSON.stringify(updatedSales));
    return sale;
  }
  // Dashboard methods
  async getTotalSales() {
    const sales = await this.getSales();
    if (!sales) {
      return 0;
    }
    return sales.reduce((total, sale) => total + sale.totalPrice, 0);
  }
    

  async getTodaySales() {
    const sales = await this.getSales();
    if (!sales) {
      return 0;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return sales
      .filter(sale => new Date(sale.date) >= today)
      .reduce((total, sale) => total + sale.totalPrice, 0);
  }

  async getTodaySalesCount() {
    const sales = await this.getSales();
    if (!sales) {
      return 0;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sales.filter(sale => new Date(sale.date) >= today).length;
}
   

  async getMostPopularItem() {
    // Get sales and items in parallel
    const [sales, items] = await Promise.all([
      this.getSales(),
        this.itemService.getItems()]);

    if (!sales || !items) {
        return null;
    }

    // Count sales per item
    const itemSales = sales.reduce<any>((acc, sale) => {
      acc[sale.itemId] = (acc[sale.itemId] || 0) + sale.quantity;
      return acc;
    }, {});

    // Find item with most sales
    let mostPopularItemId: any = null;
    let highestSales = 0;
    Object.keys(itemSales).forEach(itemId => {
      if (itemSales[itemId] > highestSales) {
        highestSales = itemSales[itemId];
        mostPopularItemId = itemId;
      }
    });

    if (!mostPopularItemId) {
      return null;
    }

    const item = items.find(i => i.id === mostPopularItemId);
    return {
      item,
      totalSold: highestSales
    };
    }
}
