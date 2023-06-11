import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Subject, first } from "rxjs";
import { getFakeScene, getFakeScenes } from "src/app/Utils/test-utils";
import { SearchScenesPipe } from "src/app/Views/create/pipes/search-scenes.pipe";
import { IconsModule } from "src/app/icons.module";
import { CreatorSceneListComponent } from "./creator-scene-list.component";
import { ListItemComponent } from "./list-item/list-item.component";

describe('Creator-Scene-List Component', () => {
    let component: CreatorSceneListComponent
    let fixture: ComponentFixture<CreatorSceneListComponent>


    beforeEach( async () =>{
        TestBed.configureTestingModule({
            declarations: [CreatorSceneListComponent, ListItemComponent, SearchScenesPipe],
            providers: [ChangeDetectorRef],
            imports: [DragDropModule, IconsModule, FormsModule]
        })
        .compileComponents()
        .then( () =>{
            fixture = TestBed.createComponent(CreatorSceneListComponent)
            component = fixture.componentInstance
            component.$currentScene = new Subject()

            component.scenes = getFakeScenes(3)
            fixture.detectChanges()
        })

    })


    it('#onDuplicateClicked() should emit', () => {
        const fakeScene = getFakeScene(1)
        const listItem = {
            scene: fakeScene
        } as ListItemComponent

        const spy = spyOn(component.duplicateClickedEvent, 'emit')
        component.onDuplicateClicked(listItem)

        expect(spy).toHaveBeenCalledOnceWith(fakeScene)
    })


    it('#newScene() should create new scene with unique id', (done) => {

        component.DEFAULT_SCENE = getFakeScene(1)
        fixture.detectChanges()

        component.$currScene
        .pipe( first() )
        .subscribe( () => {
            const ids = new Set(component.scenes)
            expect(ids.size).toEqual(component.scenes.length)
            
            done()
        })

        component.newScene()
    })
})