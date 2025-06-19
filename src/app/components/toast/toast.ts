import { Component, computed } from '@angular/core';
import { ToastService } from '../../services/toast-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrl: './toast.css',
  imports: [CommonModule]
})
export class ToastComponent {
  toasts = computed(() => ToastService.toasts());
}
