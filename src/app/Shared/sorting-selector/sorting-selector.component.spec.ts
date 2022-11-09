import { ComponentFixture, TestBed } from "@angular/core/testing"
import { SortingSelectorComponent, SortingType } from "./sorting-selector.component"

describe('SortingSelector', () => {
    let fixture: ComponentFixture<SortingSelectorComponent>
    let component: SortingSelectorComponent


    beforeEach(async () => { 
        TestBed.configureTestingModule({
            declarations: [SortingSelectorComponent],
        })
        .compileComponents()
        .then(_ => {
            fixture = TestBed.createComponent(SortingSelectorComponent)
            component = fixture.componentInstance
            fixture.detectChanges()
        })
    })

    it('#toggleSorting() with SortingType.None should set sortingType to Ascending', () => {
        component.sortingType = SortingType.None
        component.toggleSorting()

        fixture.detectChanges()
        
        expect(component.sortingType).toEqual(SortingType.Ascending)
    })

    it('#toggleSorting() with SortingType.Ascending should set sortingType to Descending', () => {
        component.sortingType = SortingType.Ascending
        component.toggleSorting()

        fixture.detectChanges()
        
        expect(component.sortingType).toEqual(SortingType.Descending)
    })

    it('#toggleSorting() with SortingType.Descending should set sortingType to None', () => {
        component.sortingType = SortingType.Descending
        component.toggleSorting()

        fixture.detectChanges()
        
        expect(component.sortingType).toEqual(SortingType.None)
    })

})