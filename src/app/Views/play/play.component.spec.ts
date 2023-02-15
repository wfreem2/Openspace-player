import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing"
import { ActivatedRoute } from "@angular/router"
import { RouterTestingModule } from "@angular/router/testing"
import { sampleSize } from "lodash"
import { of } from "rxjs"
import { Show } from "src/app/Models/Show"
import { NotificationService } from "src/app/Services/notification.service"
import { OpenspaceService, SceneGraphNode } from "src/app/Services/openspace.service"
import { SceneExecutorService } from "src/app/Services/scene-executor.service"
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
    let fakeExecutorService: any

    beforeEach( async () => { 
        fakeExecutorService = jasmine.createSpyObj('SceneExecutorService', ['execute'])
        
        fakeShowService = jasmine.createSpyObj('ShowService', ['getShowById'])
        fakeShowService.getShowById.and.returnValue(fakeShow)
        
        fakeOpenSpaceService = jasmine.createSpyObj('OpenSpaceService', 
        ['flyToGeo', 'getCurrentPosition', 'disableAllNodeTrails', 'isConnected', 
        'enableAllNodeTrails', 'setTrailVisibility', 'setNavigationState'])

        TestBed.configureTestingModule({
            declarations: [PlayComponent],
            providers: [
                {provide: ActivatedRoute, useValue: fakeRoute},
                {provide: ShowService, useValue: fakeShowService},
                {provide: OpenspaceService, useValue: fakeOpenSpaceService},
                {provide: SceneExecutorService, useValue: fakeExecutorService},
                NotificationService
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

    it('#setScene() should not set provided scene to active if it is the current scene', () => {

        const scene = component.scenes[0]

        component.setScene(scene)
        fixture.detectChanges()

        component.setScene(scene)

        expect(scene.isActive).toBeTrue()
    })

    it('#play() should set first scene to active', () => {
        const expectedScene = component.scenes[0]

        component.play()
        fixture.detectChanges()

        expect(component.currScene).toEqual(expectedScene)
    })

    it('#execute() should show error notification when error playing scene', () => {
        const sceneToExecute = component.scenes[0]
        
        const service = fixture.debugElement.injector.get(NotificationService)
        const spy = spyOn(service, 'showNotification').and.callThrough()
        
        fakeOpenSpaceService.isConnected.and.returnValue(of(false))

        fakeExecutorService.execute.and.throwError()

        component.setScene(sceneToExecute) 
        expect(spy).toHaveBeenCalled()
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