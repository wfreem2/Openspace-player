import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Show } from 'src/app/Models/Show'
import { ShowService } from 'src/app/Services/show.service'
import { getFakeScene, getFakeScenes } from 'src/app/Utils/test-utils'
import { ModalComponent } from '../modal/modal.component'

import { ShowImporterComponent } from './show-importer.component'

describe('ShowImporterComponent', () => {
	let component: ShowImporterComponent
	let fixture: ComponentFixture<ShowImporterComponent>
	let fakeShowService: jasmine.SpyObj<ShowService>

	const getDragEventSpy = (fileSpy: any) => {
		const fileList = jasmine.createSpyObj<FileList>(['item'])
		fileList.item.and.returnValue(fileSpy)

		const dataTransfer = jasmine.createSpyObj<DataTransfer>([], { files: fileList })

		const dragEvent = jasmine.createSpyObj<DragEvent>({ preventDefault: undefined }, { dataTransfer: dataTransfer })
		dragEvent.preventDefault.and.stub()

		return dragEvent
	}

	beforeEach(async () => {
		fakeShowService = jasmine.createSpyObj<ShowService>(['addShow', 'instanceOfShow'])

		await TestBed.configureTestingModule({
			declarations: [ShowImporterComponent, ModalComponent],
			providers: [ShowService]
		}).compileComponents()

		fixture = TestBed.createComponent(ShowImporterComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})

	it('Invalid file type should cause error', async () => {
		const invalidFile = jasmine.createSpyObj<File>('File', {}, { type: 'svg' })

		const dragEvent = getDragEventSpy(invalidFile)

		await component.handleDrop(dragEvent)
		expect(component.hasErrors).toBeTrue()
	})

	it('Empty JSON file should cause error', async () => {
		const invalidFile = jasmine.createSpyObj<File>(
			'File',
			{ text: Promise.resolve<string>('') },
			{ type: 'application/json' }
		)

		const dragEvent = getDragEventSpy(invalidFile)
		await component.handleDrop(dragEvent)
		fixture.detectChanges()

		expect(component.hasErrors).toBeTrue()
	})

	it('Bad JSON data should cause error', async () => {
		const invalidFile = jasmine.createSpyObj<File>(
			'File',
			{ text: Promise.resolve<string>('qweiqweiwue;;;') },
			{ type: 'application/json' }
		)

		const dragEvent = getDragEventSpy(invalidFile)
		await component.handleDrop(dragEvent)
		fixture.detectChanges()

		expect(component.hasErrors).toBeTrue()
	})

	it('Invalid JSON show data should cause error', async () => {
		const spy = spyOn(TestBed.inject(ShowService), 'instanceOfShow').and.callThrough()

		const invalidFile = jasmine.createSpyObj<File>(
			'File',
			{ text: Promise.resolve<string>('{"not": "json"}') },
			{ type: 'application/json' }
		)

		const dragEvent = getDragEventSpy(invalidFile)
		await component.handleDrop(dragEvent)
		fixture.detectChanges()

		expect(component.hasErrors).toBeTrue()
		expect(spy).toHaveBeenCalled()
	})

	it('Valid JSON show data should add show', async () => {
		const spy = spyOn(TestBed.inject(ShowService), 'instanceOfShow').and.callThrough()

		const show: Show = {
			id: 0,
			title: 'fake Show',
			scenes: getFakeScenes(2),
			dateCreated: new Date(),
			isStarred: false
		}

		const validFile = jasmine.createSpyObj<File>(
			'File',
			{ text: Promise.resolve<string>(JSON.stringify(show)) },
			{ type: 'application/json' }
		)

		const dragEvent = getDragEventSpy(validFile)
		await component.handleDrop(dragEvent)
		fixture.detectChanges()

		expect(component.hasErrors).toBeFalse()
		expect(spy).toHaveBeenCalled()
	})
})
