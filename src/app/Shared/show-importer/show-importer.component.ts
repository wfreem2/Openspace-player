import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Show } from 'src/app/Models/Show';
import { ShowService } from 'src/app/Services/show.service';

@Component({
  selector: 'show-importer',
  templateUrl: './show-importer.component.html',
  styleUrls: ['./show-importer.component.scss']
})
export class ShowImporterComponent implements OnInit {

  dropzoneActive: boolean = false
  hasErrors: boolean = false
  importedShow?: Show
  errorMsg: string = ''

  @Output() closeImporterEvent = new EventEmitter()

  constructor(private showService: ShowService) { }

  ngOnInit(): void { }


  async handleDrop(ev: DragEvent){
    ev.preventDefault()
    
    this.dropzoneActive = false
    
    const json = ev.dataTransfer?.files.item(0)

    if(json?.type != 'application/json'){
      this.errorMsg = 'Invalid file type. Only JSON files are accepted.'
      this.hasErrors = true
      
      return
    }
    
    const jsonString = await json?.text()

    if(!jsonString.trim()){
      this.hasErrors = true
      this.errorMsg = 'JSON file is empty.'
    
      return 
    }
    
    try{
      const jsonParsed = JSON.parse(jsonString)

      if(!this.showService.instanceOfShow(jsonParsed)){
        debugger
        this.errorMsg = 'JSON data is not a valid show'
        this.hasErrors = true
        
        return
      }

      this.importedShow = jsonParsed as Show
      this.importedShow.id = 1
      this.showService.addShow(this.importedShow)

      this.hasErrors = false
      this.errorMsg = ''

      this.closeImporterEvent.emit()
    }
    catch(error: any){
      if(error instanceof SyntaxError){
        this.errorMsg = error.message
      }
      else{
        this.errorMsg = error
      }

      this.hasErrors = true
    }
  }
  
  
}