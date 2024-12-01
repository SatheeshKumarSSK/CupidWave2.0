import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[] = [];
  accountService = inject(AccountService);
  viewContainerRef = inject(ViewContainerRef);
  templateRef = inject(TemplateRef);

  ngOnInit(): void {
    if (this.accountService.roles().some((role: string) => this.appHasRole.includes(role))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
    else {
      this.viewContainerRef.clear();
    }
  }

}
