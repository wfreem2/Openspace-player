import { NgModule } from '@angular/core'

import { TablerIconsModule } from 'angular-tabler-icons'
import {
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
	IconCircleX,
	IconFileUpload,
	IconExclamationCircle,
	IconMap2,
	IconEaseInOutControlPoints,
	IconClipboardText,
	IconAdjustmentsHorizontal,
	IconPlanet,
	IconTrophy
} from 'angular-tabler-icons/icons'

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
	IconCircleX,
	IconFileUpload,
	IconExclamationCircle,
	IconMap2,
	IconEaseInOutControlPoints,
	IconClipboardText,
	IconAdjustmentsHorizontal,
	IconPlanet,
	IconTrophy
}

@NgModule({
	imports: [TablerIconsModule.pick(icons)],
	exports: [TablerIconsModule]
})
export class IconsModule {}
