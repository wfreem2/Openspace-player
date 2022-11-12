import { faker } from "@faker-js/faker"
import { sampleSize } from "lodash"
import { GeoPosition } from "../Interfaces/GeoPosition"
import { Scene } from "../Interfaces/Scene"
import { SceneOptions } from "../Interfaces/SceneOptions"
import { SceneGraphNode } from "../Services/openspace.service"

export function testControlValueImplementation(component: any){
    const onChange = () => { console.log('change') }
    const onTouch = () => { console.log('touch') }

    component.registerOnChange(onChange)
    component.registerOnTouched(onTouch)

    expect(component.onChange).toEqual(onChange)
    expect(component.onTouch).toEqual(onTouch)
}

export function getFakeScenes(N: number = 5): Scene[]{

    let scenes: Scene[] = []

    for(let i = 0; i < N; i++){
        const id = i
        const title = faker.address.cityName()
        const geoPos: GeoPosition = {
            alt: Math.random(),
            lat: Math.random(),
            long: Math.random(),
            nodeName: sampleSize(Object.values(SceneGraphNode), 1)[0]
        }
        const options: SceneOptions = {
            enabledTrails: sampleSize(Object.values(SceneGraphNode), 5),
            keepCameraPosition: faker.datatype.boolean()
        } 

        const duration = Math.random()
        const script = faker.lorem.sentence()

        const scene: Scene = {
            id: id, title: title, geoPos: geoPos, options: options,
            script: (i % 2 === 0) ? script : undefined,
            duration: (i % 2 === 0) ? duration : undefined,
        }

        scenes.push(scene)
    }

    return scenes
}