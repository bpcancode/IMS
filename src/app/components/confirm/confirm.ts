import { Component, OnInit, signal } from '@angular/core';
import { ConfirmService, ConfirmOptions } from '../../services/confirm-service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.html',
  styleUrl: './confirm.css',
})
export class Confirm implements OnInit {
  show = signal(false);
  options = signal<ConfirmOptions | null>(null);
  private resolver: ((result: boolean) => void) | null = null;

  ngOnInit() {
    ConfirmService.subscribe(this.handleConfirmRequest);
  }

  handleConfirmRequest = (options: ConfirmOptions | null, resolve?: (result: boolean) => void) => {
    if (options && resolve) {
      this.options.set(options);
      this.resolver = resolve;
      this.show.set(true);
    } else {
      this.show.set(false);
      this.options.set(null);
      this.resolver = null;
    }
  };

  confirm() {
    if (this.resolver) this.resolver(true);
    this.close();
  }

  cancel() {
    if (this.resolver) this.resolver(false);
    this.close();
  }

  close() {
    this.show.set(false);
    this.options.set(null);
    this.resolver = null;
  }

  ngOnDestroy() {
    ConfirmService.unsubscribe(this.handleConfirmRequest);
  }
}
