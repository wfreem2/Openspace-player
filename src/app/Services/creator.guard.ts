import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ShowService } from './show.service';

@Injectable({
  providedIn: 'root'
})

export class ShowCreatorGuard implements CanActivate {
  constructor(private showService: ShowService, private router: Router){ }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if(route.params['id'] === 'new'){ 
        const show = this.showService.getBlankShow()
        
        this.showService.addShow(show)
        this.router.navigate(['/creator/' + show.id])

        return true 
      }
      
      const id: number = parseInt(route.params['id'])
      
      if(!Number.isNaN(id) && !!this.showService.getShowById(id)){
         return true 
      }
      
      this.router.navigate(['/shows'])
      return false
  }
  
}
