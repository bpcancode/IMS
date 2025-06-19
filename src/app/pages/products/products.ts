import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product-model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ConfirmService } from '../../services/confirm-service';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-products',
  imports: [ReactiveFormsModule, DatePipe, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  productService = inject(ProductService);

  addProuductForm = new FormGroup({
    name : new FormControl('', [Validators.required, Validators.minLength(3)]),
    price : new FormControl(0, [Validators.required, Validators.min(0)]),
    stock : new FormControl(0, [Validators.required, Validators.min(0)]),
  })

  editProductForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl(0, [Validators.required]),
    stock: new FormControl(0, [Validators.required]),
  });

  products = signal<Product[]>([]);
  searchTerm = signal<string>('');


  filteredProducts = computed(() => {
    const searchValue = this.searchTerm().toLowerCase();
    return this.products().filter(product =>
      product.name.toLowerCase().includes(searchValue)
    );
  });

  
  async ngOnInit() {
    await this.getProducts();
  }


  async getProducts() {
    const products = await this.productService.getItems();
    
    this.products.set(products || []);
  }

  async addProduct() {
    if (this.addProuductForm.invalid) {
      ToastService.error('Please fill out the form correctly.');
      return;
    }
    try {
      const formValue = this.addProuductForm.value;
      const product = new Product(
        crypto.randomUUID(),
        formValue.name!,
        formValue.price!,
        formValue.stock!
      );
      this.addProuductForm.reset();
      await this.productService.createItem(product);
      await this.getProducts();
      ToastService.success('Product added successfully!');
    } catch (e) {
      ToastService.error('Failed to add product.');
    }
  }

  editProductClicked(product: Product) {
    this.editProductForm.patchValue(product);
  }

  async updateProduct() {
    if (this.editProductForm.invalid) {
      ToastService.error('Please fill out the form correctly.');
      return;
    }
    const formValue = this.editProductForm.value;
    const product = new Product(
      formValue.id!,
      formValue.name!,
      formValue.price!,
      formValue.stock!
    );
    await this.productService.updateItem(product);
    this.editProductForm.reset();
    await this.getProducts();
    ToastService.success('Product updated successfully!');
  }

  async deleteProduct(productId: string) {
    const confirmed = await ConfirmService.request({
      message: 'Are you sure you want to delete this product?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });
    if (!confirmed) return;
    try {
      await this.productService.deleteItem(productId);
      await this.getProducts();
      ToastService.success('Product deleted successfully!');
    } catch (e) {
      ToastService.error('Failed to delete product.');
    }
  }

}
