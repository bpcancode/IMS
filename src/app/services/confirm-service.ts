// src/app/services/confirm-service.ts
export interface ConfirmOptions {
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export class ConfirmService {
  private static listeners: Array<(options: ConfirmOptions | null, resolve?: (result: boolean) => void) => void> = [];

  static request(options: ConfirmOptions): Promise<boolean> {
    return new Promise(resolve => {
      this.listeners.forEach(listener => listener(options, resolve));
    });
  }

  static subscribe(listener: (options: ConfirmOptions | null, resolve?: (result: boolean) => void) => void) {
    this.listeners.push(listener);
  }

  static unsubscribe(listener: (options: ConfirmOptions | null, resolve?: (result: boolean) => void) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
}
