import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  private spinnerService = inject(NgxSpinnerService);
  busyRequestCount = 0;

  busy() {
    this.busyRequestCount++;
    this.spinnerService.show(undefined, {
      type: 'ball-fussion',
      bdColor: 'rgba(255,255,255,0)',
      color: '#f68f6f'
    })
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
