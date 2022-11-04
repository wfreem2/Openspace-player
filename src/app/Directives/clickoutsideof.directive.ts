import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[clickedoutsideof]'
})

export class ClickedoutsideofDirective {

  @Output('onClickOutside') onClickOutside = new EventEmitter<HTMLElement>();
  
  constructor(private hostRef: ElementRef) { }

  @HostListener('document:click', ['$event.target'])
  onClicked(target: HTMLElement): void{

    console.log(this.hostRef.nativeElement.contains(target))

    if(!this.hostRef.nativeElement.contains(target)){
      this.onClickOutside.emit(target)
    }
  }
}
