import { Component, inject, OnInit, signal } from '@angular/core';
import { SalesService } from '../../services/sales-service';
import { CurrencyPipe } from '@angular/common';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  salesService = inject(SalesService);
  todaySales = signal<number>(0);
  allTimeSales = signal<number>(0);
  popularItem = signal<{name: string, sales: number}>({name: 'No sales yet', sales: 0});

  async ngOnInit() {
    await Promise.all([ this.getTodaySales(), this.getAllTimeSales(), this.getPopularItem() ]);
  }

  async getTodaySales() {
    try {
      const todaySales = await this.salesService.getTodaySales();
      this.todaySales.set(todaySales);
    } catch (error) {
      ToastService.error("Error fetching today's sales.");
    }
  }

  async getAllTimeSales() {
    try {
      const allTimeSales = await this.salesService.getTotalSales();
      this.allTimeSales.set(allTimeSales);
    } catch (error) {
      ToastService.error('Error fetching all-time sales.');
    }
  }

  async getPopularItem() {
    try {
      const popularItem = await this.salesService.getMostPopularItem();
      this.popularItem.set({name: popularItem?.item?.name || 'No sales yet', sales: popularItem?.totalSold || 0});
    } catch (error) {
      ToastService.error('Error fetching popular item.');
    }
  }

}
