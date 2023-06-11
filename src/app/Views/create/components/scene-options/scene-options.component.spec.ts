import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { sampleSize } from 'lodash'
import { first, map, skip } from 'rxjs'
import { IconsModule } from 'src/app/icons.module'
import { SceneOptions } from 'src/app/Models/SceneOptions'
import { SceneGraphNode } from 'src/app/Services/openspace.service'
import { SortingSelectorComponent, SortingType } from 'src/app/Shared/sorting-selector/sorting-selector.component'
import { testControlValueImplementation } from 'src/app/Utils/test-utils'
import { SceneOptionsComponent } from './scene-options.component'

describe('Scene-options component', () => {
	let component: SceneOptionsComponent
	let fixture: ComponentFixture<SceneOptionsComponent>

	const mapSceneOptions = map((v: any) => {
		return {
			enabledTrails: v.enabledTrails?.filter((t: any) => t.isEnabled).map((t: any) => t.trail),
			keepCameraPosition: v.keepCameraPosition
		} as SceneOptions
	})

	const sortingFn = (a: FormGroup, b: FormGroup) => {
		const firstVal = a.controls['trail'].value
		const secondVal = b.controls['trail'].value

		if (firstVal < secondVal) {
			return -1
		}
		if (firstVal > secondVal) {
			return 1
		}

		return 0
	}

	beforeEach(async () => {
		TestBed.configureTestingModule({
			declarations: [SceneOptionsComponent, SortingSelectorComponent],
			imports: [ReactiveFormsModule, FormsModule, IconsModule]
		})
			.compileComponents()
			.then(() => {
				fixture = TestBed.createComponent(SceneOptionsComponent)
				component = fixture.componentInstance
				fixture.detectChanges()
			})
	})

	it('#writeValue() should correctly set options on form', () => {
		const vals = sampleSize(Object.values(SceneGraphNode), 3)

		const expectedOptions: SceneOptions = {
			enabledTrails: vals,
			keepCameraPosition: false
		}

		component.writeValue(expectedOptions)
		fixture.detectChanges()

		const expectedTrails = component.optionsForm.value.enabledTrails?.filter((t) => t.isEnabled).map((t) => t.trail)
		const expectedCamera = component.optionsForm.value.keepCameraPosition

		expect(expectedCamera).toEqual(expectedOptions.keepCameraPosition)
		expect(expectedTrails?.sort()).toEqual(expectedOptions.enabledTrails.sort())
	})

	it('#writeValue() should not set value with unexpected object', () => {
		const someObject = { notexpected: 'NotExpected' }

		const defaultValue = component.optionsForm.getRawValue()

		component.writeValue(someObject)
		fixture.detectChanges()

		expect(component.optionsForm.getRawValue()).toEqual(defaultValue)
	})

	it('#writeValue() should not emit valuechanges', fakeAsync(() => {
		const expectedOptions: SceneOptions = {
			enabledTrails: [SceneGraphNode.Mercury, SceneGraphNode.Mars],
			keepCameraPosition: false
		}

		let changes

		component.optionsForm.valueChanges.subscribe((v) => (changes = v))

		component.writeValue(expectedOptions)
		fixture.detectChanges()

		tick(100)
		expect(changes).toBeUndefined()
	}))

	it('#selectAllTrails() should select all trails', (done) => {
		const expectedTrails = Object.values(SceneGraphNode)

		component.optionsForm.valueChanges.pipe(mapSceneOptions).subscribe((v) => {
			expect(v.enabledTrails).toEqual(expectedTrails)
			done()
		})

		component._$selectAll.next()
		fixture.detectChanges()
	})

	it('#deselectAllTrails() should deselect all trails', (done) => {
		component.optionsForm.valueChanges.pipe(mapSceneOptions).subscribe((v) => {
			expect(v.enabledTrails).toEqual([])
			done()
		})

		component._$deselectAll.next()
		fixture.detectChanges()
	})

	it('setting values on options form should emit event with correct values', (done) => {
		const valsToChange: SceneOptions = {
			enabledTrails: [SceneGraphNode.Callisto, SceneGraphNode.Deimos],
			keepCameraPosition: true
		}

		component.optionsForm.valueChanges.pipe(mapSceneOptions).subscribe((v) => {
			expect(v).toEqual(valsToChange)
			done()
		})

		component.optionsForm.patchValue({
			enabledTrails: valsToChange.enabledTrails.map((t) => {
				return { isEnabled: true, trail: t }
			}),
			keepCameraPosition: valsToChange.keepCameraPosition
		})
	})

	it('#sort() should sort controls ascending with SortingType.Ascending', (done) => {
		const expectedSort = component._filteredTrails.getValue().sort(sortingFn)

		component.$filteredTrails
			.pipe(
				skip(1), //Skip first emission (default list)
				first()
			)
			.subscribe((value) => {
				expect(value).toEqual(expectedSort)
				done()
			})

		component.sort(SortingType.Ascending)
	})

	it('#sort() should sort controls descending with SortingType.Descending', (done) => {
		const expectedSort = component._filteredTrails.getValue().sort(sortingFn).reverse()

		component.$filteredTrails
			.pipe(
				skip(1), //Skip first emission (default list)
				first()
			)
			.subscribe((value) => {
				expect(value).toEqual(expectedSort)
				done()
			})

		component.sort(SortingType.Descending)
	})

	it('#sort() should sort controls with original sorting with SortingType.None', (done) => {
		const expectedSort = component.optionsForm.controls.enabledTrails.controls

		component.$filteredTrails
			.pipe(
				skip(3) //Skip first emission (default list) and Sorting.Descending & Ascending
			)
			.subscribe((value) => {
				expect(value).toEqual(expectedSort)
				done()
			})

		component.sort(SortingType.Descending)
		component.sort(SortingType.Ascending)
		component.sort(SortingType.None)
	})

	it('should properly implement ControlValueAccessor', () => testControlValueImplementation(component))
})
