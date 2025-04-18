import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JssModule } from '@sitecore-jss/sitecore-jss-angular';
import { ConsortiumComponent } from './consortium.component';

describe('ConsortiumComponent', () => {
  let component: ConsortiumComponent;
  let fixture: ComponentFixture<ConsortiumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ JssModule.forRoot() ],
      declarations: [ ConsortiumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsortiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
