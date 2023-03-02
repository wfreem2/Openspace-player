import { NgModule } from '@angular/core';

import { TablerIconsModule } from 'angular-tabler-icons';
import { IconArrowBarToLeft, IconSearch, IconX, IconFilter,
         IconTrash, IconArrowRight, IconEdit, IconDotsVertical,
         IconCopy, IconCheck, IconChevronDown, IconCircleCheck,
        IconCircleX } from 'angular-tabler-icons/icons';

// Select some icons (use an object, not an array)
const icons = {
  IconArrowBarToLeft,
  IconSearch,
  IconX,
  IconFilter,
  IconTrash, 
  IconArrowRight,
  IconEdit,
  IconDotsVertical, 
  IconCopy,
  IconCheck,
  IconChevronDown,
  IconCircleCheck,
  IconCircleX
};

@NgModule({
  imports: [ TablerIconsModule.pick(icons) ],
  exports: [ TablerIconsModule ]
})
export class IconsModule { }