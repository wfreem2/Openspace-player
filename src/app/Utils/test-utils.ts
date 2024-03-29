import { faker } from '@faker-js/faker'
import { sampleSize } from 'lodash'
import { GeoPosition } from '../Models/GeoPosition'
import { Scene } from '../Models/Scene'
import { SceneOptions } from '../Models/SceneOptions'
import { SceneGraphNode } from '../Services/openspace.service'

export function testControlValueImplementation(component: any) {
	const onChange = () => { }
	const onTouch = () => { }

	component.registerOnChange(onChange)
	component.registerOnTouched(onTouch)

	expect(component.onChange).toEqual(onChange)
	expect(component.onTouch).toEqual(onTouch)
}

export function getFakeScenes(N: number = 5): Scene[] {
	const scenes: Scene[] = []

	for (let i = 0; i < N; i++) {
		const id = i
		const title = faker.address.cityName()
		const geoPos: GeoPosition = {
			alt: Math.random(),
			lat: Math.random(),
			long: Math.random(),
			node: sampleSize(Object.values(SceneGraphNode), 1)[0],
			timestamp: new Date().toISOString()
		}
		const options: SceneOptions = {
			enabledTrails: sampleSize(Object.values(SceneGraphNode), 5),
			keepCameraPosition: faker.datatype.boolean()
		}

		const duration = Math.random()
		const script = faker.lorem.sentence()

		const scene: Scene = {
			id: id,
			title: title,
			geoPos: geoPos,
			options: options,
			script: i % 2 === 0 ? script : null,
			transistion: i % 2 === 0 ? duration : null
		}

		scenes.push(scene)
	}

	return scenes
}

export function getFakeScene(id: number): Scene {
	const title = faker.address.cityName()
	const geoPos: GeoPosition = {
		alt: Math.random(),
		lat: Math.random(),
		long: Math.random(),
		node: sampleSize(Object.values(SceneGraphNode), 1)[0],
		timestamp: new Date().toISOString()
	}
	const options: SceneOptions = {
		enabledTrails: sampleSize(Object.values(SceneGraphNode), 5),
		keepCameraPosition: faker.datatype.boolean()
	}

	const duration = Math.random()
	const script = faker.lorem.sentence()

	const scene: Scene = {
		id: id,
		title: title,
		geoPos: geoPos,
		options: options,
		script: script,
		transistion: duration
	}

	return scene
}
