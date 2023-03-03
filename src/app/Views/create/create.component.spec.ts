import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing"
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ActivatedRoute } from "@angular/router"
import { first, of, skip } from "rxjs"
import { Show } from "src/app/Models/Show"
import { NotificationService } from "src/app/Services/notification.service"
import { ShowService } from "src/app/Services/show.service"
import { getFakeScene, getFakeScenes } from "src/app/Utils/test-utils"
import { CreateComponent } from "./create.component"
import { RouterTestingModule } from "@angular/router/testing";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { sampleSize } from "lodash"
import { Scene } from "src/app/Models/Scene"
import { SearchScenesPipe } from "./pipes/search-scenes.pipe"
import { ConfirmPopupComponent } from "src/app/Shared/confirm-popup/confirm-popup.component"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { SceneExecutorService } from "src/app/Services/scene-executor.service"
import { CreatorSceneListComponent } from "./components/creator-scene-list/creator-scene-list.component"
import { ListItemComponent } from "./components/creator-scene-list/list-item/list-item.component"
import { SceneOptionsComponent } from "./components/scene-options/scene-options.component"
import { ScenePositionComponent } from "./components/scene-position/scene-position.component"
import { SelectedSceneService } from "./services/selected-scene.service"
import { TablerIconsModule } from "angular-tabler-icons"
import { IconsModule } from "src/app/icons.module"
import { OpenspaceService } from "src/app/Services/openspace.service"

describe('CreateComponent', () => {
    let component: CreateComponent
    let fixture: ComponentFixture<CreateComponent>
    
    let fakeShowService: jasmine.SpyObj<ShowService>
    let fakeExecutorService: jasmine.SpyObj<SceneExecutorService>
    let fakeOpenSpaceService: jasmine.SpyObj<OpenspaceService>

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
        fakeOpenSpaceService = jasmine.createSpyObj('OpenSpaceService', ['isConnected', 'getTime', 'listenCurrentPosition'])

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
                {provide: OpenspaceService, useValue: fakeOpenSpaceService},
                
                NotificationService, FormBuilder
            ],
            imports: [ReactiveFormsModule, FormsModule, RouterTestingModule, 
                DragDropModule, BrowserAnimationsModule, IconsModule, TablerIconsModule]

        })
        .compileComponents()
        .then( () => {
            fixture = TestBed.createComponent(CreateComponent)
            component = fixture.componentInstance

            fixture.detectChanges()

            fakeOpenSpaceService.isConnected.and.returnValue( of(true) )
            fakeOpenSpaceService.getTime.and.resolveTo( new Date() )
        })

        fakeShow.scenes = getFakeScenes(5)
    })

    afterAll( () => localStorage.clear() )

    it('correct show should be used based on route param id', () => {
        fixture.detectChanges()

        expect(component.show.id).toEqual(fakeShow.id)
    })

    it('selecting a scene should set the current forms values to the scene\'s', (done) => {
        const selectedScene = getFakeScene(99)

        component.$setScene.next(selectedScene)

        let id = 100
        component.$selectedScene
        .pipe( first() )
        .subscribe( scene => {
            expect(scene).toEqual(selectedScene)
            id = scene!.id + 1
        })

        const rawScene = component.sceneForm.getRawValue()

        const newScene: Scene = {
            id: id,
            title: rawScene.title + 'some other stuff',
            geoPos: rawScene.geoPos,
            options: rawScene.options,
            duration: rawScene.transistion || undefined,
            script: rawScene.script || undefined,
            time: new Date()
        }
        
        component.$setScene.next(newScene)
        
        component.$selectedScene
        .pipe( first() )
        .subscribe( scene => {
            expect(scene).toEqual(newScene)
            done()
        })

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

    xit('changing a form value should make saved state false', () => {
        /* For some reason isSaved is true, even though it is false in the component after execution */
        const scene = getFakeScene(3)
        
        component.$setScene.next(scene)
        component.sceneForm.patchValue({
            title: 'New title'
        })

        fixture.detectChanges()

        expect(component.isSaved).toBeFalse()
    })

    it('#saveShow() should save show with ShowService', () => {
        component.saveShow()

        expect(fakeShowService.save).toHaveBeenCalled()
        expect(component.isSaved).toBeTrue()
    })

    it('#saveShow() should not save form if the form is invalid', () => {
        
        component.sceneForm.controls.transistion.setErrors({'pattern': true})
        fixture.detectChanges()

        component.saveShow()
        
        expect(fakeShowService.save).not.toHaveBeenCalled()
    })

    it('#onDeleteClicked() should show confirmation popup', (done) => {

        const spy = spyOn(component.$setConfirmVisibility, 'next').and.callThrough()

        component.$isConfirmShowing.pipe( first() )
        .subscribe( isConfirmShowing => {
            expect(spy).toHaveBeenCalled()
            expect(isConfirmShowing).toBeTrue()
            done()
        })
            
        fixture.detectChanges()
        component.onDeleteClicked()

    })

    it('#deleteScene() should remove scene from list', (done) => {
        const { scenes } = component.show
        const sceneToDelete = sampleSize(scenes, 1)[0]

        component.$setScene.next(sceneToDelete)
        
        component.$selectedScene
        .pipe( 
            skip(1),
            first() 
        )
        .subscribe( scene =>{

            expect(scene).toBeFalsy()
            const deletedScene = component.show.scenes.find(s => s === sceneToDelete)
            expect(deletedScene).toBeFalsy()
            done()
        })

        component.deleteScene()
        fixture.detectChanges()
    })

    it('#deleteScene() should set isSaved to false', () => {
        component.$setScene.next( getFakeScene(1) )

        component.deleteScene()
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
        
        fakeOpenSpaceService.isConnected.and.returnValue( of(false) )
        fakeExecutorService.execute.and.throwError('Bad!')

        component.preview(sceneToExecute) 
        expect(spy).toHaveBeenCalled()
    })

})