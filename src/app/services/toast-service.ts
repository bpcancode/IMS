import { signal } from '@angular/core';

export type ToastType = 'success' | 'error';

export interface Toast {
  message: string;
  type: ToastType;
  id: number;
}

export class ToastService {
  static toasts = signal<Toast[]>([]);
  private static idCounter = 0;

  static show(message: string, type: ToastType = 'success', duration = 3000) {
    const id = ++this.idCounter;
    const toast: Toast = { message, type, id };
    this.toasts.update((prev) => [...prev, toast]);
    setTimeout(() => this.remove(id), duration);
  }

  static error(message: string, duration = 4000) {
    this.show(message, 'error', duration);
  }

  static success(message: string, duration = 4000) {
    this.show(message, 'success', duration);
  }

  private static remove(id: number) {
    this.toasts.update((prev) => prev.filter(t => t.id !== id));
  }
}
