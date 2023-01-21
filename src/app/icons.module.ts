import { NgModule } from '@angular/core';

import { TablerIconsModule } from 'angular-tabler-icons';
import { IconArrowBarToLeft } from 'angular-tabler-icons/icons';

// Select some icons (use an object, not an array)
const icons = {
  IconArrowBarToLeft
};

@NgModule({
  imports: [ TablerIconsModule.pick(icons) ],
  exports: [ TablerIconsModule ]
})
export class IconsModule { }