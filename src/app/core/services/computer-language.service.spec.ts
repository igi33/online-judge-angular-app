import { TestBed } from '@angular/core/testing';

import { ComputerLanguageService } from './computer-language.service';

describe('ComputerLanguageService', () => {
  let service: ComputerLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComputerLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
