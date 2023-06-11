import { style, transition, trigger, animate } from '@angular/animations'

export const SlideInOut = trigger('slideInOut', [
	transition(':enter', [
		style({ transform: 'translateX(100%)' }),
		animate('0.3s ease-out', style({ transform: 'translateX(0%)' }))
	]),
	transition(':leave', [
		style({ transform: 'translateX(0%)' }),
		animate('0.2s ease-in', style({ transform: 'translateX(100%)' }))
	])
])

export const ScaleInOut = trigger('scaleInOut', [
	transition(':enter', [
		style({ transform: 'scale(0.3)' }),
		animate('0.3s ease-out', style({ transform: 'scale(1)' }))
	]),
	transition(':leave', [style({ transform: 'scale(1)' }), animate('0.2s ease-in', style({ transform: 'scale(0.3)' }))])
])
