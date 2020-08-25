import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionarioEspecificoComponent } from './questionario-especifico.component';

describe('QuestionarioEspecificoComponent', () => {
  let component: QuestionarioEspecificoComponent;
  let fixture: ComponentFixture<QuestionarioEspecificoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionarioEspecificoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionarioEspecificoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
