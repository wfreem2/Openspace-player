import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowIssuesComponent } from './show-issues.component';
import { getFakeScene } from 'src/app/Utils/test-utils';

describe('ShowIssuesComponent', () => {
  let component: ShowIssuesComponent;
  let fixture: ComponentFixture<ShowIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowIssuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#goTo() should emit scene', () => {
    const expected = getFakeScene(1)
    const spy = spyOn(component.goToScene, 'emit')

    component.goTo(expected)

    expect(spy).toHaveBeenCalledWith(expected)
  })
});
