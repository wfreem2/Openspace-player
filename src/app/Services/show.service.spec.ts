import { first, map } from "rxjs"
import { Show } from "../Models/Show"
import { ShowService } from "./show.service"

describe("ShowService", () => {
    let showService: ShowService

    const shows: Show[] = 
    [
        { id: 1, title: 'Show 1', scenes: [], dateCreated: new Date() },
        { id: 2, title: 'Show 2', scenes: [], dateCreated: new Date() },
        { id: 3, title: 'Show 3', scenes: [], dateCreated: new Date() }
    ]   

    beforeEach( () =>{ 
        showService = new ShowService()
        shows.forEach(s => showService.addShow(s)) 
    })

    afterEach( () => localStorage.clear() )

    it('#addShow() show with existing id should have id reassigned', () => {
        const id = 3    
        const show = { id: 3, title: 'Show 3 conflicting', scenes: [], dateCreated: new Date() }

        showService.addShow(show)

        expect(show.id).not.toEqual(id)
    })

    it('#removeShowById() should remove show with id 2', () => {
        const id = 2

        showService.removeShowById(id)

        expect(showService.getShowById(id))
        .toBeFalsy()
    })  

    it('#saveShow() should save existing show without appending', () => {
        
        const toAdd: Show = { id: 4, title: 'Show 4', scenes: [], dateCreated: new Date() }
        showService.addShow(toAdd)

        const newTitle = 'Show 4 - New title'
        toAdd.title = newTitle
        
        showService.save(toAdd)
        
        let showCount: number = 0
        
        showService.getAllShows()
        .pipe(map(s => s.length), first())
        .subscribe(N => showCount = N)
        
        showService.getAllShows()
        .pipe(first())
        .subscribe(s => {
            expect(s.find(s => s === toAdd)?.title)
            .toEqual(newTitle)

            expect(showCount)
            .toEqual(s.length)
        })
        
    })

    it('#saveShow() should save non-existing show and append', () => {
        
        const toAdd: Show = { id: 4, title: 'Show 4', scenes: [], dateCreated: new Date() }
        
        spyOn(showService, 'addShow').and.callThrough()
        
        showService.save(toAdd)
        
        expect(showService.addShow).toHaveBeenCalled()


        showService.getAllShows()
        .pipe(first())
        .subscribe(s => {
            expect(s.find(s => s === toAdd))
            .toEqual(toAdd)
        })
    })

    it('#saveShow() should save show to localstorage', () => {
        
        const toAdd: Show = { id: 4, title: 'Show 4', scenes: [], dateCreated: new Date() }

        showService.save(toAdd)
        const savedShows: Show[] = JSON.parse(localStorage.getItem('shows')!)

        expect(savedShows).toBeTruthy()
        expect(savedShows.length).toEqual(shows.length+1)
    })

    it('#getBlankShow() should return show with unique id', () => {

        const lastShow = shows[shows.length-1]
        const newShow = showService.getBlankShow()

        expect(newShow.id)
        .toBeGreaterThan(lastShow.id)
    })
})