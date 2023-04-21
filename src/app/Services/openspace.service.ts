import { Injectable } from '@angular/core';
import * as api from 'openspace-api-js'
import { interval, mergeMap, Observable, ReplaySubject } from 'rxjs';
import { GeoPosition } from '../Models/GeoPosition';
import { NavigationState } from '../Models/NavigationState';
import { NotificationType } from '../Models/ToastNotification';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})

export class OpenspaceService {

  private openspace: any
  private nodes: SceneGraphNode[] = Object.values(SceneGraphNode)

  private readonly client = api('localhost', 4682)
  private readonly _isConnected = new ReplaySubject<boolean>()

  constructor(private notiService: NotificationService) {
    this.client.onConnect(async () => await this.onConnect(this.client))
    this.client.onDisconnect(async () => await this.onDisconnect())

    this.connect()
  }

  private async onDisconnect(){
    this._isConnected.next(false)

    this.notiService.showNotification({ 
      title: 'Openspace is Disconnected',
      type: NotificationType.WARNING
    })
  }

  private async onConnect(api: any){
    this.openspace = await api.library()
    this._isConnected.next(true)

    this.notiService.showNotification({
      title: 'Openspace is Connected',
      type: NotificationType.SUCCESS
    })
  }

  connect(): void{ this.client.connect() }
  
  isConnected(): Observable<boolean>{  return this._isConnected.asObservable() }
  
  flyToGeo({lat, long, alt, timestamp, node}: GeoPosition, transistion: number | null = null): void{
    
    this.setTime(timestamp)
    this.pauseTime()

    if(!transistion){
      this.openspace.globebrowsing.flyToGeo(node, lat, long, alt)
    }
    else{
      this.openspace.globebrowsing.flyToGeo(node, lat, long, alt, transistion)
    }
  }

  async getCurrentPosition(): Promise<GeoPosition>{
    const time = await this.getTime()
    const anchor = await this.getCurrentAnchor()
    const canHaveGeo = await this.nodeCanHaveGeo(anchor)

    if(!canHaveGeo){
      return {
        lat: 0,
        long: 0,
        alt: 0,
        node: anchor,
        timestamp: time
      }
    }
    
    const pos: number[] = await this.openspace.globebrowsing.getGeoPositionForCamera()

    return {
      lat: pos[1],
      long: pos[2],
      alt: pos[3],
      node: anchor,
      timestamp: time
    }
  }
  
  flyTo(node: SceneGraphNode): void{ this.openspace.pathnavigation.flyTo(node.toString()) }

  resetAnchor(): void{
    this.openspace.navigation.retargetAnchor()
  }

  listenCurrentPosition(): Observable<GeoPosition>{
    return interval(100)
    .pipe( mergeMap( async () => await this.getCurrentPosition() ) )
  }

  setTrailVisibility(node: SceneGraphNode, isVisible: boolean): void{

    const trail = this.nodeToTrail(node)
    
    this.openspace.setPropertyValueSingle(`Scene.${trail}.Renderable.Enabled`, isVisible) 
  }

  private nodeToTrail(node: SceneGraphNode): string{
    return node in NodeToTrailMap ? NodeToTrailMap[node] : `${node.toString()}Trail`
  }

  private nodeToRenderable(node: SceneGraphNode): string{
    return node in NodeToRenderableMap ? NodeToRenderableMap[node] : node.toString()
  }

  async getRenderableType(node: SceneGraphNode): Promise<RenderableType>{
    const renderable = this.nodeToRenderable(node)

    return await this.getPropertyValue<RenderableType>(`Scene.${renderable}.Renderable.Type`)   
  }

  async nodeCanHaveGeo(node: SceneGraphNode): Promise<boolean>{
    try{
      return (await this.getRenderableType(node)) === RenderableType.RENDERABLEGLOBE
    }
    catch{
      return true
    }
  }

  setTime(timestamp: string): void{
    this.openspace.time.setTime( timestamp )
  }

  async getTime(): Promise<string>{
    const rawValue = this.retrieveValue(await this.openspace.time.currentWallTime())
    return this.parseDate(rawValue)
  }

  private pauseTime(): void{
    this.openspace.time.setPause(true)
  }

  private resumeTime(): void{
    this.openspace.time.setPause(false)
  }

  private parseDate(date: string): string{
    const firstHalf = date.split('T')[0]
    const secondHalf = date.split('T')[1]

    const dates = firstHalf.split('-').map(val => parseInt(val))
    const times = secondHalf.split(':').map(val => parseInt(val))

    return `${dates[0]}-${dates[1]}-${dates[2]}T${times[0]}:${times[1]}:${times[2]}`
  }

  async getNavigationState(): Promise<NavigationState>{
    return this.retrieveValue((await this.openspace.navigation.getNavigationState()))
  }

  setNavigationState(state: NavigationState){
    this.openspace.navigation.setNavigationState(state)
  }

  disableAllNodeTrails(): void{
    this.nodes.forEach(node => this.setTrailVisibility(node, false))
  }

  enableAllNodeTrails(): void{
    this.nodes.forEach(node => this.setTrailVisibility(node, true))    
  }

  async getCurrentAnchor(): Promise<SceneGraphNode>{
    const anchor = await this.getPropertyValue<SceneGraphNode>('NavigationHandler.OrbitalNavigator.Anchor')

    return anchor
  }

  private async getPropertyValue<T>(valueURI: string): Promise<T>{
    return <T> this.retrieveValue(await this.openspace.getPropertyValue(valueURI))
  }

  private retrieveValue(openspaceObj: { '1': any }){
    return openspaceObj['1']
  }
}

export enum SceneGraphNode{  
 Mercury="Mercury", 
 Venus="Venus", 
 Earth="Earth", 
 Mars="Mars", 
 Jupiter="Jupiter", 
 Saturn="Saturn", 
 Uranus="Uranus", 
 Neptune="Neptune", 
 Moon="Moon", 
 Phobos="Phobos", 
 Deimos="Deimos", 
 Callisto="Callisto", 
 Europa="Europa", 
 Ganymede="Ganymede", 
 Io="Io", 
 Dione="Dione", 
 Enceladus="Enceladus", 
 Hyperion="Hyperion", 
 Iapetus="Iapetus", 
 Mimas="Mimas", 
 Rhea="Rhea", 
 Tethys="Tethys", 
 Titan="Titan", 
 PlutoBarycenter="PlutoBarycenter", 
 PlutoBarycentric="PlutoBarycentric", 
 CharonBarycentric="CharonBarycentric", 
 Hydra="Hydra", 
 Kerberos="Kerberos", 
 Nix="Nix", 
 Styx="Styx",
 Sun="Sun",
 ISS="ISS"
}

interface NodeMap {
  [key: string | SceneGraphNode]: string
}

export const NodeToTrailMap: NodeMap = {
  Sun: "SunOrbit",
  ISS: "ISS_trail"
}

export const NodeToRenderableMap: NodeMap = {
  Sun: "SunOrbit",
  ISS: "ISSModel"
}

export enum RenderableType{
  RENDERABLEMODEL="RenderableModel",
  RENDERABLEGLOBE="RenderableGlobe"
}
