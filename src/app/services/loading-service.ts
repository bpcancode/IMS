import { signal } from '@angular/core';

export class LoadingService {
    private static loadingCount = 0;
    static isLoading = signal<boolean>(false);

    static show() {
        this.loadingCount++;
        this.isLoading.set(true);
    }

    static hide() {
        if (this.loadingCount > 0) {
            this.loadingCount--;
        }
        if (this.loadingCount === 0) {
            this.isLoading.set(false);
        }
    }
}
