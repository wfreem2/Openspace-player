import { ComponentFixture, TestBed } from "@angular/core/testing"
import { FormControlStatus, FormsModule, ReactiveFormsModule } from "@angular/forms"
import { sampleSize } from "lodash"
import { of, throwError } from "rxjs"
import { GeoPosition } from "src/app/Interfaces/GeoPosition"
import { NotificationService } from "src/app/Services/notification.service"
import { OpenspaceService, SceneGraphNode } from "src/app/Services/openspace.service"
import { DropdownComponent } from "src/app/Shared/dropdown/dropdown.component"
import { SortingSelectorComponent } from "src/app/Shared/sorting-selector/sorting-selector.component"
import { testControlValueImplementation } from "src/app/Utils/test-utils"
import { ScenePositionComponent } from "./scene-position.component"

describe('Scene-Positon component', () => {
    let component: ScenePositionComponent
    let fixture: ComponentFixture<ScenePositionComponent>

    const fakeOpenSpaceService = jasmine.createSpyObj('OpenSpaceService', ['listenCurrentPosition'])
    
    beforeEach( async () => {
        const $fakeObs =  of({
            alt: Math.random(),
            lat: Math.random(),
            long: Math.random(),
            nodeName: sampleSize(Object.values(SceneGraphNode), 1)[0]
        } as GeoPosition)

        fakeOpenSpaceService.listenCurrentPosition.and.returnValue($fakeObs)

        TestBed.configureTestingModule({
            declarations: [ScenePositionComponent, SortingSelectorComponent, DropdownComponent],
            providers: [{provide: OpenspaceService, useValue: fakeOpenSpaceService}, NotificationService],
            imports: [ReactiveFormsModule, FormsModule]
        })
        .compileComponents()
        .then( () => {
            fixture = TestBed.createComponent(ScenePositionComponent)
            component = fixture.componentInstance
            fixture.detectChanges()
        })
    })


    it('#writeValue() should correctly set GeoPosition', () => {

        const expectedGeo: GeoPosition = {
            alt: Math.random(),
            lat: Math.random(),
            long: Math.random(),
            nodeName: sampleSize(Object.values(SceneGraphNode), 1)[0]
        }


        component.writeValue(expectedGeo)
        fixture.detectChanges()

        expect(component.geoPosForm.value as GeoPosition).toEqual(expectedGeo)
    })

    it('#writeValue() should not set geoposition with unexpected object ', () => {

        const unexpectedObj = { unexpected: 'an unexpected object'}
        
        const defaultValue = component.geoPosForm.getRawValue()

        component.writeValue(unexpectedObj)
        fixture.detectChanges()

        expect(component.geoPosForm.getRawValue()).toEqual(defaultValue)
    })

    it('setting autoMode to true should disable form', () => {
        component.$isAutoMode.next(true)
        fixture.detectChanges()

        const expectedStatus: FormControlStatus = 'DISABLED'

        expect(component.geoPosForm.status).toEqual(expectedStatus)
    })

    it('setting autoMode to false should enable form', () => {
        //Disable form first then re-enable
        component.$isAutoMode.next(true)
        fixture.detectChanges()

        component.$isAutoMode.next(false)
        fixture.detectChanges()

        const expectedStatus: FormControlStatus = 'VALID'

        expect(component.geoPosForm.status).toEqual(expectedStatus)
    })


    it('lat, long, and alt controls with values that are not numbers should have invalid status', () => {

        const badGeoPosition = {
            lat: 'invalid',
            long: '0.33bad',
            alt: 'notgood',
            nodeName: sampleSize(Object.values(SceneGraphNode), 1)[0]
        }

        component.writeValue(badGeoPosition)
        fixture.detectChanges();

        [component.alt!, component.lat!, component.long!]
        .forEach(ctrl => expect(ctrl.errors!['pattern']).toBeTruthy() )
    })

    it('should properly implement ControlValueAccessor', () => testControlValueImplementation(component))

    it('openspace.listenCurrentPosition() error should set autoMode to false', () => {
        fakeOpenSpaceService.listenCurrentPosition.and.returnValue( throwError( () => 'Error!'))

        //To trigger change detection
        component.$isAutoMode.next(true)
        fixture.detectChanges()

        expect(component.isAutoMode).toBeFalse()
    })

    it('openspace.listenCurrentPosition() error should enable form', () => {
        fakeOpenSpaceService.listenCurrentPosition.and.returnValue( throwError( () => 'Error!'))

        //To trigger change detection
        component.$isAutoMode.next(true)
        fixture.detectChanges()

        expect(component.geoPosForm.enabled).toBeTrue()
    })
})