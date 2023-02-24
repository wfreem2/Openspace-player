import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablerIconComponent, TablerIconsModule } from 'angular-tabler-icons';
import { IconsModule } from 'src/app/icons.module';

import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalComponent, TablerIconComponent ],
      imports: [IconsModule, TablerIconsModule]

    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
