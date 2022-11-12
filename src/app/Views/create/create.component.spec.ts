import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing"
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ActivatedRoute } from "@angular/router"
import { of } from "rxjs"
import { Show } from "src/app/Interfaces/Show"
import { NotificationService } from "src/app/Services/notification.service"
import { ShowService } from "src/app/Services/show.service"
import { getFakeScenes } from "src/app/Utils/test-utils"
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

describe('CreateComponent', () => {
    let component: CreateComponent
    let fixture: ComponentFixture<CreateComponent>

    
    const fakeShow: Show = {
        id: 1,
        title: 'Test Show',
        dateCreated: new Date(),
        scenes: getFakeScenes()
    }

    const fakeRoute = {params: of({id: 1}) }
    const fakeShowService = jasmine.createSpyObj('ShowService', ['getShowById'])
    fakeShowService.getShowById.and.returnValue(fakeShow)


    beforeEach( async () => {
        TestBed.configureTestingModule({
            declarations: [
                CreateComponent, ScenePositionComponent, ListItemComponent,
                CreatorSceneListComponent, SceneOptionsComponent,
            ],
            providers: [
                {provide: ActivatedRoute, useValue: fakeRoute},
                {provide: ShowService, useValue: fakeShowService},
                SelectedSceneService,
                NotificationService, FormBuilder
            ],
            imports: [ReactiveFormsModule, FormsModule, RouterTestingModule, DragDropModule]
        })
        .compileComponents()
        .then( () => {
            fixture = TestBed.createComponent(CreateComponent)
            component = fixture.componentInstance

            fixture.detectChanges()
        })
    })


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
        const scene = sampleSize(component.show.scenes, 1)[0]

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

})