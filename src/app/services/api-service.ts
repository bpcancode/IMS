import { Injectable } from '@angular/core';
import { LoadingService } from './loading-service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }


  async getData<T>(key: string) {
    LoadingService.show();
    try {
      await delay();
      const data = localStorage.getItem(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } finally {
      LoadingService.hide();
    }
  }

  async setData(key: string, value: string) {
    LoadingService.show();
    try {
      await delay();
      localStorage.setItem(key, value);
    } finally {
      LoadingService.hide();
    }
  }


}

async function delay() {
  return new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
}
