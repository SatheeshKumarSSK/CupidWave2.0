import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { preventUnsavedChangesGuard } from './prevent-unsaved-changes.guard';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

describe('preventUnsavedChangesGuard', () => {
  const executeGuard: CanDeactivateFn<MemberEditComponent> = (...guardParameters) => 
      TestBed.runInInjectionContext(() => preventUnsavedChangesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
