import { Pipe, PipeTransform } from '@angular/core';
import { Scene } from 'src/app/Interfaces/Scene';

@Pipe({
  name: 'searchScenes'
})
export class SearchScenesPipe implements PipeTransform {

  transform(scenes: Scene[], query: string): Scene[] {
    query = query.toLocaleLowerCase()
    return scenes.filter(s => s.title.toLowerCase().includes(query))
  }

}