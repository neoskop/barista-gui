import { TestBed, async, inject } from '@angular/core/testing';

import { SetupCheckGuard } from './setup-check.guard';

describe('SetupCheckGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SetupCheckGuard]
    });
  });

  it('should ...', inject([SetupCheckGuard], (guard: SetupCheckGuard) => {
    expect(guard).toBeTruthy();
  }));
});
