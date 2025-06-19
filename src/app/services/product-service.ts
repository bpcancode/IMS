import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { STORAGE_CONSTANTS } from '../constants/storage-constants';
import { Product } from '../models/product-model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiService = inject(ApiService);

  async getItems() {
    const product = await this.apiService.getData<Product[]>(STORAGE_CONSTANTS.PRODUCT)
    return product;
  }

  async getItemById(id: string) {
    const item = await this.getItems();
    return item?.find((i: any) => i.id === id) || null;
  }

  async searchItems(query: string) {

    const item = await this.getItems();
    if (!query) return item;
    const lowerQuery = query.toLowerCase();
    return item?.filter((i: any) => 
      i.name.toLowerCase().includes(lowerQuery) || 
      i.description.toLowerCase().includes(lowerQuery)
    );
  }

  async createItem(item: Product){

    const items = await this.getItems();
    if (!items) {
      this.apiService.setData(STORAGE_CONSTANTS.PRODUCT, JSON.stringify([item]));
    }
    const newItems = [...items!, item];
    await this.apiService.setData(STORAGE_CONSTANTS.PRODUCT, JSON.stringify(newItems));
    return item;
  }

  async updateItem(item: Product) {
    
    const items = await this.getItems();
    if (!items) {
      throw new Error('No items available');
    }

    const index = items.findIndex((i: any) => i.id === item.id);
    if (index === -1) {
      throw new Error('Item not found');
    }

    const updatedItems = [...items];
    updatedItems[index] = { 
      ...item, 
      updatedAt: new Date() 
    };

    await this.apiService.setData(STORAGE_CONSTANTS.PRODUCT, JSON.stringify(updatedItems));
    return updatedItems[index];
  }

  async deleteItem(id: string) {
    const items = await this.getItems();
    if (!items) return;

    const updatedItems = items.filter((i: any) => i.id !== id);
    await this.apiService.setData(STORAGE_CONSTANTS.PRODUCT, JSON.stringify(updatedItems));
    return updatedItems;
  }

  async sellItem(itemId: string, quantity: number) {
    const items = await this.getItems();
    if (!items) {
      throw new Error('No items available');
    }

    const index = items.findIndex((i: any) => i.id === itemId);
    if (index === -1) {
      throw new Error('Item not found');
    }

    const item = items[index];
    if (item.stock < quantity) {
      throw new Error('Not enough items in stock');
    }

    const updatedItems = [...items];
    updatedItems[index] = { 
      ...item, 
      stock: item.stock - quantity,
      updatedAt: new Date()
    };

    await this.apiService.setData(STORAGE_CONSTANTS.PRODUCT, JSON.stringify(updatedItems));
    return updatedItems[index];
 }

  async restockItem(itemId: string, quantity: number) {
    const items = await this.getItems();
    if (!items) {
      throw new Error('No items available');
    }

    const index = items.findIndex((i: any) => i.id === itemId);
    if (index === -1) {
      throw new Error('Item not found');
    }

    const item = items[index];
    const updatedItems = [...items];
    updatedItems[index] = { 
      ...item, 
      stock: item.stock + quantity,
      updatedAt: new Date()
    };

    await this.apiService.setData(STORAGE_CONSTANTS.PRODUCT, JSON.stringify(updatedItems));
    return updatedItems[index];
  }

}
