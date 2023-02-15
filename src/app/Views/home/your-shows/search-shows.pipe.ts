import { Pipe, PipeTransform } from '@angular/core';
import { Show } from 'src/app/Models/Show';

@Pipe({
  name: 'searchShows'
})
export class SearchShowsPipe implements PipeTransform {

  transform(shows: Show[], query: string): Show[] {
    query = query.toLowerCase()

    return shows.filter(s => {
      return s.title.toLowerCase().includes(query)
    })
  }

}
