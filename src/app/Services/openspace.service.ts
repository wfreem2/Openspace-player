import { Injectable } from '@angular/core';
import * as api from 'openspace-api-js'
import { BehaviorSubject, Observable } from 'rxjs';
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
    console.log('disconnected')
  }

  private async onConnect(api: any){
    this.openspace = await api.library()
    this._isConnected.next(true)
      
    console.log('connected')
  }

  isConnected(): Observable<boolean>{
    return this._isConnected.asObservable()
  }
  
  goToGeo(globe: string='', lat: Number, long: Number, alt: Number): void{
    this.openspace.globebrowsing.goToGeo(globe, lat, long, alt)
  }

  async getCurrentPosition(): Promise<GeoPosition>{

    const pos = await this.openspace.globebrowsing.getGeoPositionForCamera()

    return {
      lat: pos[1],
      long: pos[2],
      alt: pos[3]
    }
  }

  
}
