import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from '@app/core';
import { RecuperacaoComponent } from './recuperacao.component';

describe('RecuperacaoComponent', () => {
  let component: RecuperacaoComponent;
  let fixture: ComponentFixture<RecuperacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot(),
        RouterTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        CoreModule
      ],
      declarations: [RecuperacaoComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
