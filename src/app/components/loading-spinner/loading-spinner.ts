import { Component, computed } from '@angular/core';
import { LoadingService } from '../../services/loading-service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.css',
})
export class LoadingSpinner {
  isLoading = computed(() => LoadingService.isLoading());
}
