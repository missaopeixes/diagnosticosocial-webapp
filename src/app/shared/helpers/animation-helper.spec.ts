import { TestBed, inject } from '@angular/core/testing';

import { AnimationHelper } from '@app/shared/helpers/animation-helper';

describe('AnimationHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnimationHelper]
    });
  });

  it('should be created', inject([AnimationHelper], (service: AnimationHelper) => {
    expect(service).toBeTruthy();
  }));
});
