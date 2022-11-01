import { Injectable } from '@angular/core';
import * as api from 'openspace-api-js'
import { BehaviorSubject, interval, map, mergeMap, Observable } from 'rxjs';
import { GeoPosition } from '../Interfaces/GeoPosition';

@Injectable({
  providedIn: 'root'
})

export class OpenspaceService {

  openspace: any
  _isConnected = new BehaviorSubject<boolean>(false)
  o = api('localhost', 4682)

  constructor() {
    this.o.onConnect(async () => await this.onConnect(this.o))
    this.o.onDisconnect(async () => await this.onDisconnect())

    this.o.connect()
  }

  private async onDisconnect(){
    this._isConnected.next(false)
  }

  private async onConnect(api: any){
    this.openspace = await api.library()
    this._isConnected.next(true)
  }

  isConnected(): Observable<boolean>{
    return this._isConnected.asObservable()
  }
  
  flyToGeo(lat: Number, long: Number, alt: Number, globe: string=''): void{
    this.openspace.globebrowsing.flyToGeo(globe, lat, long, alt)
  }


  async getCurrentPosition(): Promise<GeoPosition>{

    const pos = await this.openspace.globebrowsing.getGeoPositionForCamera()

    return {
      lat: pos[1],
      long: pos[2],
      alt: pos[3]
    }
  } 
  
  flyTo(path: PathNavigationOptions){
    this.openspace.pathnavigation.flyTo(path.toString())
  }

  listenCurrentPosition(): Observable<GeoPosition>{
    return interval(100)
    .pipe(
      mergeMap(async _ => await this.getCurrentPosition())
    )
  }

  setTrail(trail: Trail, value: boolean): void{
    this.openspace.setPropertyValueSingle(`Scene.${trail}Trail.Renderable.Enabled`, value) 
  }

}

export enum PathNavigationOptions{
  Mercury="Mercury",
  Venus="Venus",
  Earth="Earth",
  Mars="Mars",
  Jupiter="Jupiter",
  Saturn="Saturn",
  Uranus="Uranus",
  Neptune="Neptune"
}

export type Trail = 
 "Mercury" |
 "Venus" |
 "Earth" |
 "Mars" |
 "Jupiter" |
 "Saturn" |
 "Uranus" |
 "Neptune" |
 "Moon" |
 "Phobos" |
 "Deimos" |
 "Callisto" |
 "Europa" |
 "Ganymede" |
 "Io" |
 "Saturn" |
 "Dione" |
 "Enceladus" |
 "Hyperion" |
 "Iapetus" |
 "Mimas" |
 "Rhea" |
 "Tethys" |
 "Titan" |
 "PlutoBarycenter" |
 "PlutoBarycentric" |
 "CharonBarycentric" |
 "Hydra" |
 "Kerberos" |
 "Nix" |
 "Styx"


export const trails: Trail[] = [
  "Mercury",
  "Venus",
  "Earth",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Moon",
  "Phobos",
  "Deimos",
  "Callisto",
  "Europa",
  "Ganymede",
  "Io",
  "Saturn",
  "Dione",
  "Enceladus",
  "Hyperion",
  "Iapetus",
  "Mimas",
  "Rhea",
  "Tethys",
  "Titan",
  "PlutoBarycenter",
  "PlutoBarycentric",
  "CharonBarycentric",
  "Hydra",
  "Kerberos",
  "Nix",
  "Styx",
]