import { Injectable } from '@angular/core';
import { Scene } from '../Models/Scene';
import { OpenspaceService, RenderableType, SceneGraphNode } from './openspace.service';

@Injectable({
  providedIn: 'root'
})
export class SceneExecutorService {

  constructor(private openSpaceService: OpenspaceService) { }


  public execute(scene: Scene): void{
  
    const { navState, options, duration } = scene
    const { node } = scene.geoPos


    
    this.openSpaceService.getRenderableType(node)
    .then( renderableType => {
      if(renderableType === RenderableType.RENDERABLEGLOBE){
        this.openSpaceService.flyToGeo(scene.geoPos, duration)
        return
      }

      this.openSpaceService.flyTo(node)
    })
    .catch(err => { throw err })
    

    if(!options){ return }

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
