import { TestBed } from '@angular/core/testing';
import { sampleSize } from 'lodash';
import { Scene } from '../Models/Scene';
import { getFakeScene } from '../Utils/test-utils';
import { OpenspaceService, RenderableType, SceneGraphNode } from './openspace.service';

import { SceneExecutorService } from './scene-executor.service';

describe('SceneExecutorService', () => {
  let fakeScene: Scene
  let service: SceneExecutorService

  let fakeOpenSpaceService: jasmine.SpyObj<OpenspaceService>

  beforeEach(async () => {

    fakeOpenSpaceService = jasmine.createSpyObj('OpenSpaceService', 
    ['flyToGeo', 'flyTo', 'getCurrentPosition', 'disableAllNodeTrails', 'isConnected', 
    'enableAllNodeTrails', 'setTrailVisibility', 'setNavigationState', 'getRenderableType', 'nodeCanHaveGeo'])

    fakeScene = getFakeScene(1)

    TestBed.configureTestingModule({
      providers: [
        {provide: OpenspaceService, useValue: fakeOpenSpaceService}
      ]
    })

    service = TestBed.inject(SceneExecutorService);
    
    fakeOpenSpaceService.getRenderableType.and.resolveTo(RenderableType.RENDERABLEGLOBE)
  });

  it('should be created', () => {
    expect(service).toBeTruthy()
  });

  it('#execute() with a RenderableGlobe should call flyToGeo', async () => {
    fakeOpenSpaceService.getRenderableType.and.resolveTo(RenderableType.RENDERABLEGLOBE)

    await service.execute(fakeScene)

    expect(fakeOpenSpaceService.flyToGeo).toHaveBeenCalled()
  })

  it('#execute() with a RENDERABLEMODEL should call flyToGeo', async () => {
    fakeOpenSpaceService.getRenderableType.and.resolveTo(RenderableType.RENDERABLEMODEL)

    await service.execute(fakeScene)

    expect(fakeOpenSpaceService.flyTo).toHaveBeenCalled()
  })

  it('#execute() should call enableAllNodeTrails when all trails are enabled', async () => {
      
      fakeScene.options.enabledTrails = Object.values(SceneGraphNode)
      
      await service.execute(fakeScene)

      expect(fakeOpenSpaceService.enableAllNodeTrails).toHaveBeenCalled()
  })

  it('#execute() should call disableNodeTrails when options are provided', async () => {   
      
    await service.execute(fakeScene)
    expect(fakeOpenSpaceService.disableAllNodeTrails).toHaveBeenCalled()
  })

  it('#execute() should call setTrailVisibility when some trails are enabled', async () => {
      fakeScene.options.enabledTrails = sampleSize(Object.values(SceneGraphNode), 10)

      await service.execute(fakeScene)
      expect(fakeOpenSpaceService.setTrailVisibility).toHaveBeenCalled()
  })
});
