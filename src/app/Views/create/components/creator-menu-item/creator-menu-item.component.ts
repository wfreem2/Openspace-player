import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { tap, Observable, Subject, takeUntil } from 'rxjs';
import { CreatorSubMenuItem } from 'src/app/Models/CreatorMenuItem';
import { OsService } from 'src/app/Services/os.service';
import { BaseComponent } from 'src/app/Shared/base/base.component';

@Component({
  selector: 'creator-menu-item',
  templateUrl: './creator-menu-item.component.html',
  styleUrls: ['./creator-menu-item.component.scss']
})
export class CreatorMenuItemComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input() menuItem!: CreatorSubMenuItem
  @Output() itemClicked = new EventEmitter()
  
  isDisabled: boolean = false
  formattedHotKeys: string = ''

  constructor() { super() }

  ngOnInit(): void { 
    this.formattedHotKeys = this.menuItem.hotKey
    .reduce(( prev, curr ) => prev + '+' + curr , OsService.getCommandKey)

    if (this.menuItem.isDisabled instanceof Observable){
      this.menuItem.isDisabled
      .pipe( takeUntil(this.$unsub) )
      .subscribe( val => this.isDisabled = val)
    }
    else{
      this.isDisabled = this.menuItem.isDisabled
    }

  }
  onClick(): void{
    if(this.isDisabled){ return }

    this.menuItem.callBack()
    this.itemClicked.emit()
  }
  
}

