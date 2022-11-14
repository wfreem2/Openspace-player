import { ComponentFixture, TestBed } from "@angular/core/testing"
import { ActivatedRoute } from "@angular/router"
import { RouterTestingModule } from "@angular/router/testing"
import { sampleSize } from "lodash"
import { of } from "rxjs"
import { Show } from "src/app/Interfaces/Show"
import { OpenspaceService, SceneGraphNode } from "src/app/Services/openspace.service"
import { ShowService } from "src/app/Services/show.service"
import { getFakeScenes } from "src/app/Utils/test-utils"
import { PlayComponent } from "./play.component"

describe('Play Component', () => {
    let component: PlayComponent
    let fixture: ComponentFixture<PlayComponent>

    const fakeRoute = {params: of({id: 1}) }

    const fakeShow: Show = {
        id: 1,
        title: 'Test Show',
        dateCreated: new Date(),
        scenes: []
    }
    
    let fakeShowService: any
    let fakeOpenSpaceService: any

    beforeEach( async () => { 
        fakeShowService = jasmine.createSpyObj('ShowService', ['getShowById'])
        fakeShowService.getShowById.and.returnValue(fakeShow)
        
        fakeOpenSpaceService = jasmine.createSpyObj('OpenSpaceService', 
        ['flyToGeo', 'getCurrentPosition', 'disableAllNodeTrails', 
        'enableAllNodeTrails', 'setTrailVisibility', 'setNavigationState'])

        TestBed.configureTestingModule({
            declarations: [PlayComponent],
            providers: [
                {provide: ActivatedRoute, useValue: fakeRoute},
                {provide: ShowService, useValue: fakeShowService},
                {provide: OpenspaceService, useValue: fakeOpenSpaceService}
            ],
            imports: [RouterTestingModule]
        })
        .compileComponents()
        .then( () => {
            fixture = TestBed.createComponent(PlayComponent)
            component = fixture.componentInstance
            fixture.detectChanges()
        })

        fakeShow.scenes = getFakeScenes(4)
    })

    it('correct show should be used based on route param id', () => {
        fixture.detectChanges()

        expect(component.show.id).toEqual(fakeShow.id)
    })


    it('#setScene() should set provided scene to active', () => {
        const expectedScene = component.scenes[2]

        component.setScene(expectedScene)
        fixture.detectChanges()

        expect(component.currScene).toEqual(expectedScene)
    })

    it('#setScene() should set provided scene to active and disable active scene', () => {
        const firstScene = component.scenes[2]
        const secondScene = component.scenes[1]

        component.setScene(firstScene)
        fixture.detectChanges()
        
        const activeScene = component.currScene
        expect(activeScene).toEqual(firstScene)
        
        component.setScene(secondScene)
        fixture.detectChanges()
        
        expect(activeScene?.isActive).toBeFalse()
        expect(component.currScene).toEqual(secondScene)   
    })

    it('#play() should set first scene to active', () => {
        const expectedScene = component.scenes[0]

        component.play()
        fixture.detectChanges()

        expect(component.currScene).toEqual(expectedScene)
    })

    it('#execute() should setNavigationState with keepCameraPosition true and navState not undefined', () => {
        const sceneToExecute = component.scenes[0]
        
        sceneToExecute.scene.options.keepCameraPosition = true
        sceneToExecute.scene.navState = {
            Anchor: sampleSize(Object.values(SceneGraphNode), 1)[0],
            Pitch: Math.random(),
            Position: [Math.random(), Math.random(), Math.random()],
            Up: [Math.random(), Math.random(), Math.random()],
            Yaw: Math.random()
        }
        
        component.setScene(sceneToExecute)
        fixture.detectChanges()

        expect(fakeOpenSpaceService.setNavigationState).toHaveBeenCalled()
    })
    
    it('#execute() should call flyToGeo', () => {
        const sceneToExecute = component.scenes[0]
        
        component.setScene(sceneToExecute)
        fixture.detectChanges()

        expect(fakeOpenSpaceService.flyToGeo).toHaveBeenCalled()
    })

    it('#execute() should call enableAllNodeTrails when all trails are enabled', () => {
        const sceneToExecute = component.scenes[0]
        
        sceneToExecute.scene.options.enabledTrails = Object.values(SceneGraphNode)
        
        component.setScene(sceneToExecute)
        fixture.detectChanges()

        expect(fakeOpenSpaceService.enableAllNodeTrails).toHaveBeenCalled()
    })

    it('#execute() should call disableNodeTrails when options are provided', () => {
        const sceneToExecute = component.scenes[0]
        
        
        component.setScene(sceneToExecute)
        fixture.detectChanges()

        expect(fakeOpenSpaceService.disableAllNodeTrails).toHaveBeenCalled()
    })

    it('#execute() should call setTrailVisibility when some trails are enabled', () => {
        const sceneToExecute = component.scenes[0]
        sceneToExecute.scene.options.enabledTrails = sampleSize(Object.values(SceneGraphNode), 10)
        
        component.setScene(sceneToExecute)
        fixture.detectChanges()

        expect(fakeOpenSpaceService.setTrailVisibility).toHaveBeenCalled()
    })

    it('next button should be disabled when last scene is active', () => {
        const lastScene = component.scenes[component.scenes.length-1]

        component.setScene(lastScene)
        fixture.detectChanges()

        const el: HTMLElement = fixture.nativeElement
        const btn: HTMLButtonElement = el.querySelector('#next')!

        expect(btn.disabled).toBeTrue()
    })

    it('back button should be disabled when first scene is active', () => {
        const firstScene = component.scenes[0]

        component.setScene(firstScene)
        fixture.detectChanges()

        const el: HTMLElement = fixture.nativeElement
        const btn: HTMLButtonElement = el.querySelector('#back')!

        expect(btn.disabled).toBeTrue()
    })
})