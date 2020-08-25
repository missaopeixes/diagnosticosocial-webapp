import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionarioListagemComponent } from './questionario-listagem.component';

describe('QuestionarioListagemComponent', () => {
  let component: QuestionarioListagemComponent;
  let fixture: ComponentFixture<QuestionarioListagemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionarioListagemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionarioListagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
