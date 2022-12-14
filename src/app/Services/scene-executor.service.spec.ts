import { TestBed } from '@angular/core/testing';
import { sampleSize } from 'lodash';
import { Scene } from '../Interfaces/Scene';
import { getFakeScene } from '../Utils/test-utils';
import { OpenspaceService, SceneGraphNode } from './openspace.service';

import { SceneExecutorService } from './scene-executor.service';

describe('SceneExecutorService', () => {
  let fakeScene: Scene
  let service: SceneExecutorService

  let fakeOpenSpaceService: any

  beforeEach(async () => {

    fakeOpenSpaceService = jasmine.createSpyObj('OpenSpaceService', 
    ['flyToGeo', 'getCurrentPosition', 'disableAllNodeTrails', 'isConnected', 
    'enableAllNodeTrails', 'setTrailVisibility', 'setNavigationState'])

    fakeScene = getFakeScene(1)

    TestBed.configureTestingModule({
      providers: [
        {provide: OpenspaceService, useValue: fakeOpenSpaceService}
      ]
    })

    service = TestBed.inject(SceneExecutorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy()
  });

  it('#execute() should setNavigationState with keepCameraPosition true and navState not undefined', () => {

    
    fakeScene.options.keepCameraPosition = true

    fakeScene.navState = {
        Anchor: sampleSize(Object.values(SceneGraphNode), 1)[0],
        Pitch: Math.random(),
        Position: [Math.random(), Math.random(), Math.random()],
        Up: [Math.random(), Math.random(), Math.random()],
        Yaw: Math.random()
    }
    
    service.execute(fakeScene)

    expect(fakeOpenSpaceService.setNavigationState).toHaveBeenCalled()
  })

  it('#execute() should call flyToGeo', () => {
    service.execute(fakeScene)
    expect(fakeOpenSpaceService.flyToGeo).toHaveBeenCalled()
  })

  it('#execute() should call enableAllNodeTrails when all trails are enabled', () => {
      
      fakeScene.options.enabledTrails = Object.values(SceneGraphNode)
      service.execute(fakeScene)

      expect(fakeOpenSpaceService.enableAllNodeTrails).toHaveBeenCalled()
  })

  it('#execute() should call disableNodeTrails when options are provided', () => {   
      
    service.execute(fakeScene)
    expect(fakeOpenSpaceService.disableAllNodeTrails).toHaveBeenCalled()
  })

  it('#execute() should call setTrailVisibility when some trails are enabled', () => {
      fakeScene.options.enabledTrails = sampleSize(Object.values(SceneGraphNode), 10)

      service.execute(fakeScene)
      expect(fakeOpenSpaceService.setTrailVisibility).toHaveBeenCalled()
  })
});
