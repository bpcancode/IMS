import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product-model';
import { CurrencyPipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalesService } from '../../services/sales-service';
import { Sale } from '../../models/sales-model';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-sales',
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './sales.html',
  styleUrl: './sales.css'
})
export class Sales {

  productService = inject(ProductService);
  salesService = inject(SalesService);


  products = signal<Product[]>([]);
  sales = signal<Sale[]>([]);

  salesForm = new FormGroup({
    productId: new FormControl('', [Validators.required]),
    quantity: new FormControl(1, [Validators.required, Validators.min(1)])
  })

  restockForm = new FormGroup({
    productId: new FormControl('', [Validators.required]),
    quantity: new FormControl(1, [Validators.required, Validators.min(1)])
  });

  selectedProduct = signal<Product | null>(null);

  async ngOnInit() {
    await this.initialize();
  }

  async initialize() {
    await Promise.all([this.getProducts(), this.getSales()]);
  }

  async sellProduct() {
    if (this.salesForm.invalid) {
      ToastService.error('Please fill out the form correctly.');
      return;
    }
    const {productId, quantity} = this.salesForm.value;
    if (!productId || !quantity) return;
    try {
      await this.salesService.createSale(productId, quantity);
      await this.initialize();
      ToastService.success('Product sold successfully!');
    } catch (error) {
      ToastService.error(error + '');
    }
  }

  async getProducts() {
    const prod = await this.productService.getItems();
    this.products.set(prod || []);
  }

  selectProduct(event: any) {
    const product = this.products().find(p => p.id === event.target.value) || null;
    this.selectedProduct.set(product);
  }

  async getSales() {
    const sales = await this.salesService.getSales();
    this.sales.set(sales || []);
  }

  getProductName(productId: string): string {
    const product = this.products().find(p => p.id === productId);
    return product ? product.name : 'N/A';
  }

  async restockProduct() {
    if (this.restockForm.invalid) {
      ToastService.error('Please fill out the restock form correctly.');
      return;
    }
    const { productId, quantity } = this.restockForm.value;
    if (!productId || !quantity) return;
    try {
      await this.productService.restockItem(productId, quantity);
      await this.getProducts();
      ToastService.success('Product restocked successfully!');
      this.restockForm.reset();
    } catch (error) {
      ToastService.error(error + '');
    }
  }

}
