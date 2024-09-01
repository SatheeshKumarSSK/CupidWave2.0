import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, CommonModule, BsDropdownModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  accountService = inject(AccountService);
  routes = inject(Router);
  toastr = inject(ToastrService);
  model: any = {};
  navbarOpen = false;

  login() {
    this.accountService.login(this.model).subscribe({
      next: res => {
        this.routes.navigateByUrl("/members");
        this.toggleNavbar();
      },
      error: err => this.toastr.error(err.error)
    })
  }

  logout() {
    this.accountService.logout();
    this.routes.navigateByUrl("/");
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}
