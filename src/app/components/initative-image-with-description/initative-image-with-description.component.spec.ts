import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JssModule } from '@sitecore-jss/sitecore-jss-angular';
import { InitativeImageWithDescriptionComponent } from './initative-image-with-description.component';

describe('InitativeImageWithDescriptionComponent', () => {
  let component: InitativeImageWithDescriptionComponent;
  let fixture: ComponentFixture<InitativeImageWithDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ JssModule.forRoot() ],
      declarations: [ InitativeImageWithDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitativeImageWithDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
