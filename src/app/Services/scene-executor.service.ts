import { Injectable } from '@angular/core';
import { Scene } from '../Models/Scene';
import { OpenspaceService, RenderableType, SceneGraphNode } from './openspace.service';

@Injectable({
  providedIn: 'root'
})
export class SceneExecutorService {

  constructor(private openSpaceService: OpenspaceService) { }


  public async execute(scene: Scene): Promise<void>{
  
    const { options, transistion } = scene
    const { node, navState } = scene.geoPos
    
    const renderableType = await this.openSpaceService.getRenderableType(node)
    
    try{
      if(navState){ this.openSpaceService.setNavigationState(navState) }
      
      if(renderableType === RenderableType.RENDERABLEGLOBE){
        this.openSpaceService.flyToGeo(scene.geoPos, transistion)
      }
      else{
        this.openSpaceService.flyTo(node)
      }
      
      if(!options){ return }
      const { enabledTrails } = options
      
      this.openSpaceService.disableAllNodeTrails()
      
      switch(enabledTrails.length){
        case Object.keys(SceneGraphNode).length: //All trails enabled
        this.openSpaceService.enableAllNodeTrails()
        break
        
        default: //Some trails enabled
          enabledTrails.forEach(trail => this.openSpaceService.setTrailVisibility(trail, true))
        break
      }
    }
    catch{
      console.log('Error executing scene')
    }
  }

}
