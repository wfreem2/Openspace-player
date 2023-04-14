import { FormArray, FormControl, FormGroup, FormRecord } from "@angular/forms";
import { SceneGraphNode } from "../Services/openspace.service";
import { GeoPosition } from "./GeoPosition";
import { SceneOptions } from "./SceneOptions";


export interface SceneForm{
    title: FormControl<string>,
    geoPos: FormControl<GeoPosition>,
    options: FormControl<SceneOptions>,
    transistion: FormControl<number | null>,
    script: FormControl<string | null>
}

export interface SceneOptionsForm{
    keepCameraPosition: FormControl<boolean>
    enabledTrails: FormArray<FormGroup<TrailOptionsForm>>
}

export interface TrailOptionsForm{
    trail: FormControl<SceneGraphNode>,
    isEnabled: FormControl<boolean>
}

export interface GeoPosForm{
    alt: FormControl<number>
    lat: FormControl<number>
    long: FormControl<number>
    node: FormControl<SceneGraphNode>,
    timestamp: FormControl<string>
}