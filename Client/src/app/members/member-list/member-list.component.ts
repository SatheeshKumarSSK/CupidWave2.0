import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { UserParams } from '../../_models/userParams';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent, PaginationModule, FormsModule, ButtonsModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  accountService = inject(AccountService);
  membersService = inject(MembersService);
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }];

  ngOnInit(): void {
    if (this.membersService.paginatedResult() == null) {
      this.membersService.userParams.set(new UserParams(this.accountService.currentUser()));
      this.loadMembers()
    };
  }

  loadMembers() {
    this.membersService.getMembers();
  }

  resetFilters() {
    this.membersService.resetUserParams();
    this.loadMembers();
  }

  pageChanged(event: any) {
    if (this.membersService.userParams().pageNumber !== event.page) {
      this.membersService.userParams().pageNumber = event.page;
      this.loadMembers();
    }
  }
}
