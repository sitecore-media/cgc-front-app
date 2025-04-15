import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JssModule } from '@sitecore-jss/sitecore-jss-angular';
import { SharedTitleAndIconsComponent } from './shared-title-and-icons.component';

describe('SharedTitleAndIconsComponent', () => {
  let component: SharedTitleAndIconsComponent;
  let fixture: ComponentFixture<SharedTitleAndIconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ JssModule.forRoot() ],
      declarations: [ SharedTitleAndIconsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTitleAndIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
