import { ChangeDetectorRef } from "@angular/core"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { ListItemComponent } from "./list-item/list-item.component"
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CreatorSceneListComponent } from "./creator-scene-list.component";
import { getFakeScene, getFakeScenes } from "src/app/Utils/test-utils";
import { SearchScenesPipe } from "src/app/Views/create/pipes/search-scenes.pipe";
import { first } from "rxjs";
import { IconsModule } from "src/app/icons.module";
import { FormsModule } from "@angular/forms";

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

            component.scenes = getFakeScenes(3)
            fixture.detectChanges()
        })

    })


    it('#onDuplicateClicked() should duplicate scene with unique id', () =>{
        const toDuplicate = component.items.first

        const setSceneSpy = spyOn(component.$setScene, 'next')

        component.onDuplicateClicked(toDuplicate)
        fixture.detectChanges()
        
        const duplicatedScene = component.scenes[component.scenes.length-1]

        const ids = new Set(component.scenes)

        expect(ids.size).toEqual(component.scenes.length)
        expect(setSceneSpy).toHaveBeenCalled()
        expect(duplicatedScene.id).toBeGreaterThan(toDuplicate.scene.id)
    })

    
    it('#onDuplicateClicked() should duplicate scene with unique name after being called twice', () =>{
        const toDuplicate = component.items.first

        component.onDuplicateClicked(toDuplicate)
        fixture.detectChanges()
        component.onDuplicateClicked(toDuplicate)
        fixture.detectChanges()
        
        
        const duplicatedScene = component.scenes[component.scenes.length-1]
        expect(component.scenes.filter(s => s.title === duplicatedScene.title).length).toEqual(1)
    })



    it('#newScene() should create new scene with unique id', (done) => {

        component.DEFAULT_SCENE = getFakeScene(1)

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