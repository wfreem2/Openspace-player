import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorMenuItemComponent } from './creator-menu-item.component';

describe('CreatorMenuItemComponent', () => {
  let component: CreatorMenuItemComponent;
  let fixture: ComponentFixture<CreatorMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatorMenuItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatorMenuItemComponent);
    component = fixture.componentInstance;
    component.menuItem = { 
      name: 'name',
      isDisabled: false,
      callBack: () => { },
      hotKey: []   
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
