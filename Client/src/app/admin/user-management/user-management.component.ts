import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { User } from '../../_models/user';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  private modalService = inject(BsModalService);
  users: User[] = [];
  bsModalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();

  ngOnInit(): void {
    this.adminService.getUserWithRoles().subscribe({
      next: (users) => this.users = users
    })
  }

  openRolesModal(user: User) {
    const config = {
      class: 'modal-lg',
      initialState: {
        title: 'User Roles',
        username: user.username,
        selectedRoles: [...user.roles],
        availableRoles: ['Admin', 'Moderator', 'Member'],
        users: user,
        rolesUpdated: false
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);

    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef.content && this.bsModalRef.content.rolesUpdated) {
          const selectedRoles = this.bsModalRef.content.selectedRoles;
          this.adminService.updateUserRoles(user.username, selectedRoles).subscribe({
            next: (roles) => user.roles = roles
          })
        }
      }
    })
  }
}
