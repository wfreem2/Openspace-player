import { Injectable } from '@angular/core';
import { Scene } from '../Interfaces/Scene';
import { OpenspaceService, SceneGraphNode } from './openspace.service';

@Injectable({
  providedIn: 'root'
})
export class SceneExecutorService {

  constructor(private openSpaceService: OpenspaceService) { }


  public execute(scene: Scene): void{
  
    const { navState, options, duration } = scene
    const { lat, long, alt, nodeName } = scene.geoPos

    this.openSpaceService.flyToGeo(lat, long, alt, nodeName, duration)

    if(options){
      const { enabledTrails, keepCameraPosition } = options
      
      if(keepCameraPosition && navState){ this.openSpaceService.setNavigationState(navState) }
      
      this.openSpaceService.disableAllNodeTrails()

      switch(enabledTrails.length){
        case Object.keys(SceneGraphNode).length: //All trails enabled
          this.openSpaceService.enableAllNodeTrails()
          break

        default: //Some trails enabled
          enabledTrails.forEach(trial => this.openSpaceService.setTrailVisibility(trial, true))
          break
      }
    }
  }

}
