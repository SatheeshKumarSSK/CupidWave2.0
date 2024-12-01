import { Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-modal',
  standalone: true,
  imports: [],
  templateUrl: './roles-modal.component.html',
  styleUrl: './roles-modal.component.css'
})
export class RolesModalComponent {
  bsModalRef = inject(BsModalRef);
  title = "";
  username = "";
  selectedRoles: string[] = [];
  availableRoles: string[] = [];
  rolesUpdated = false;

  updateChecked(checkedRole: string) {
    if (this.selectedRoles.includes(checkedRole)) {
      this.selectedRoles = this.selectedRoles.filter(r => r != checkedRole);
    }
    else {
      this.selectedRoles.push(checkedRole);
    }
  }

  onSelectRoles() {
    this.rolesUpdated = true;
    this.bsModalRef.hide();
  }
}
