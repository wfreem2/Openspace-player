import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing"
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ActivatedRoute } from "@angular/router"
import { of } from "rxjs"
import { Show } from "src/app/Interfaces/Show"
import { NotificationService } from "src/app/Services/notification.service"
import { ShowService } from "src/app/Services/show.service"
import { getFakeScene, getFakeScenes } from "src/app/Utils/test-utils"
import { CreateComponent } from "./create.component"
import { CreatorSceneListComponent } from "./creator-scene-list/creator-scene-list.component"
import { SceneOptionsComponent } from "./scene-options/scene-options.component"
import { ScenePositionComponent } from "./scene-position/scene-position.component"
import { SelectedSceneService } from "./selected-scene.service"
import { RouterTestingModule } from "@angular/router/testing";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ListItemComponent } from "./creator-scene-list/list-item/list-item.component"
import { sampleSize } from "lodash"
import { Scene } from "src/app/Interfaces/Scene"
import { SearchScenesPipe } from "./search-scenes.pipe"
import { ConfirmPopupComponent } from "src/app/Shared/confirm-popup/confirm-popup.component"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { SceneExecutorService } from "src/app/Services/scene-executor.service"

describe('CreateComponent', () => {
    let component: CreateComponent
    let fixture: ComponentFixture<CreateComponent>
    
    let fakeShowService: any
    let fakeExecutorService: any
    const fakeRoute = { params: of({id: 1}) }
    
    const fakeShow: Show = {
        id: 1,
        title: 'Test Show',
        dateCreated: new Date(),
        scenes: []
    }
    
    beforeEach( async () => {
        fakeExecutorService = jasmine.createSpyObj('SceneExecutorService', ['execute'])
        fakeShowService = jasmine.createSpyObj('ShowService', ['getShowById', 'save'])
        
        fakeShowService.getShowById.and.returnValue(fakeShow)
        fakeShowService.save.and.callFake(() => {})

        TestBed.configureTestingModule({
            declarations: [
                CreateComponent, ScenePositionComponent, ListItemComponent,
                CreatorSceneListComponent, SceneOptionsComponent, SearchScenesPipe,
                ConfirmPopupComponent
            ],
            providers: [
                {provide: ActivatedRoute, useValue: fakeRoute},
                {provide: ShowService, useValue: fakeShowService},
                {provide: SceneExecutorService, useValue: fakeExecutorService},
                SelectedSceneService,
                NotificationService, FormBuilder
            ],
            imports: [ReactiveFormsModule, FormsModule, RouterTestingModule, DragDropModule, BrowserAnimationsModule]
        })
        .compileComponents()
        .then( () => {
            fixture = TestBed.createComponent(CreateComponent)
            component = fixture.componentInstance

            fixture.detectChanges()
        })

        fakeShow.scenes = getFakeScenes()
    })

    afterAll( () => localStorage.clear() )

    it('correct show should be used based on route param id', () => {
        fixture.detectChanges()

        expect(component.show.id).toEqual(fakeShow.id)
    })

    it('#newScene() should create new scene with unique id', () => {
        const selectedSceneService = fixture.debugElement.injector.get(SelectedSceneService)
        const selectedSceneSpy = spyOn(selectedSceneService, 'setScene').and.callThrough()

        component.newScene()

        const { show } = component
        const ids = new Set(show.scenes)

        expect(ids.size).toEqual(show.scenes.length)
        expect(selectedSceneSpy).toHaveBeenCalled()
    })

    it('selecting a scene should set the current forms values to the scene\'s', () => {
        const selectedSceneService = fixture.debugElement.injector.get(SelectedSceneService)
        const scene = getFakeScene(99)

        selectedSceneService.setScene(scene)

        expect(component.currScene).toEqual(scene)
        
        const rawScene = component.sceneForm.getRawValue()

        const newScene: Scene = {
            id: component.currScene!.id,
            title: rawScene.title,
            geoPos: rawScene.geoPos,
            options: rawScene.options,
            duration: rawScene.transistion || undefined,
            script: rawScene.script || undefined
        }

        expect(component.currScene).toEqual(newScene)
    })

    it('selecting a scene should not emit a valuechange event', fakeAsync(() => {
        const selectedSceneService = fixture.debugElement.injector.get(SelectedSceneService)
        const scene = sampleSize(component.show.scenes, 1)[0]
        
        let change: any;

        component.sceneForm.valueChanges.subscribe(v => change = v)
        selectedSceneService.setScene(scene)

        tick(100)
        expect(change).toBeUndefined()
    }))

    it('changing a form value should make saved state false', () => {
        const scene = getFakeScene(99)
        const selectedSceneService = fixture.debugElement.injector.get(SelectedSceneService)

        selectedSceneService.setScene(scene)

        component.sceneForm.patchValue({
            title: 'New title'
        })

        expect(component.isSaved).toBeFalse()
    })

    it('#saveShow() should save show with ShowService', () => {
        component.saveShow()

        expect(fakeShowService.save).toHaveBeenCalled()
        expect(component.isSaved).toBeTrue()
    })

    it('#onDelete() should show confirmation popup', () => {
        component.onDelete()
        fixture.detectChanges()
        
        expect(component.isConfirmShowing).toBeTrue()
    })

    it('#onConfirm() should remove scene from list', () => {
        const { scenes } = component.show
        const sceneToDelete = sampleSize(scenes, 1)[0]
        
        component.currScene = sceneToDelete

        component.onConfirm()
        fixture.detectChanges()
        
        const deletedScene = component.show.scenes.find(s => s === sceneToDelete)

        expect(deletedScene).toBeFalsy()
        expect(component.currScene).toBeFalsy()
    })

    it('#onConfirm() should set isSaved to false', () => {
        component.currScene = getFakeScene(1)

        component.onConfirm()
        fixture.detectChanges()
        
        expect(component.isSaved).toBeFalse()
    })

    it('#resetScene() should reset form to default values', () => {

        const defaultVal = component.sceneForm.getRawValue()

        component.sceneForm.patchValue({
            title: 'New ranodm title'
        })

        fixture.detectChanges()

        component.resetScene()
        expect(component.sceneForm.getRawValue()).toEqual(defaultVal)
        expect(component.isAutoMode).toEqual(false)
    })

    it('#preview() should show error notification when error previewing scene', () => {
        const sceneToExecute = component.show.scenes[0]
        
        const service = fixture.debugElement.injector.get(NotificationService)
        const spy = spyOn(service, 'showNotification').and.callThrough()
        
        fakeExecutorService.execute.and.throwError()

        component.preview(sceneToExecute) 
        expect(spy).toHaveBeenCalled()
    })
})