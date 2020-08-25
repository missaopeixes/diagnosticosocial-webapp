import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerguntaEspecificaComponent } from './pergunta-especifica.component';

describe('PerguntaEspecificaComponent', () => {
  let component: PerguntaEspecificaComponent;
  let fixture: ComponentFixture<PerguntaEspecificaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerguntaEspecificaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerguntaEspecificaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
