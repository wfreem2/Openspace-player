import { Pipe, PipeTransform } from '@angular/core'
import { Show } from 'src/app/Models/Show'
import { ShowPipe } from './your-shows.component'

@Pipe({
	name: 'filterSortShow',
	pure: false
})
export class FilterSortShowPipe implements PipeTransform {
	transform(show: Show[], args: ShowPipe): Show[] {
		return args.transform([...show])
	}
}
