import { ChangeDetectorRef } from "@angular/core"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { SelectedSceneService } from "../selected-scene.service"
import { ListItemComponent } from "./list-item/list-item.component"
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CreatorSceneListComponent } from "./creator-scene-list.component";
import { getFakeScenes } from "src/app/Utils/test-utils";

describe('Creator-Scene-List Component', () => {
    let component: CreatorSceneListComponent
    let fixture: ComponentFixture<CreatorSceneListComponent>


    beforeEach( async () =>{
        TestBed.configureTestingModule({
            declarations: [CreatorSceneListComponent, ListItemComponent],
            providers: [ChangeDetectorRef, SelectedSceneService],
            imports: [DragDropModule]
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
        const selectedSceneService = fixture.debugElement.injector.get(SelectedSceneService)

        const selectedSceneSpy = spyOn(selectedSceneService, 'setScene')

        component.onDuplicateClicked(toDuplicate)
        fixture.detectChanges()
        
        const duplicatedScene = component.scenes[component.scenes.length-1]

        const ids = new Set(component.scenes)

        expect(ids.size).toEqual(component.scenes.length)
        expect(selectedSceneSpy).toHaveBeenCalled()
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



    it('#onItemClicked() should set all items to inactive', () =>{
        const itemClicked = component.items.first
        const selectedSceneService = fixture.debugElement.injector.get(SelectedSceneService)

        const selectedSceneSpy = spyOn(selectedSceneService, 'setScene')

        component.onItemClicked(itemClicked)
        fixture.detectChanges()
        
        const itemsNotClicked = component.items.filter(i => !i.isActive)

        expect(itemsNotClicked.find(i => i === itemClicked)).toBeFalsy()
        expect(itemsNotClicked.length).toEqual(component.items.length-1)
        expect(itemClicked.isActive).toBeTrue()

        expect(selectedSceneSpy).toHaveBeenCalled()
    })
})