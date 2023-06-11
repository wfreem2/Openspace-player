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

  it('menu item should not be disabled by default', () => {
    expect(component.isDisabled).toBeFalse()
  })

  it('#onClick() should not emit and should not execute callback if the menu is disabled', () => {
    component.isDisabled = true
    fixture.detectChanges()
    
    const emitSpy = spyOn(component.itemClicked, 'emit')
    const callBackSpy = spyOn(component.menuItem, 'callBack')
    
    component.onClick()

    expect(emitSpy).not.toHaveBeenCalled()
    expect(callBackSpy).not.toHaveBeenCalled()
  })

  it('#onClick() should emit and should execute callback if the menu is not disabled', () => {
    
    const emitSpy = spyOn(component.itemClicked, 'emit')
    const callBackSpy = spyOn(component.menuItem, 'callBack')

    component.onClick()

    expect(emitSpy).toHaveBeenCalled()
    expect(callBackSpy).toHaveBeenCalled()
  })
});
