import { bufferCount } from "rxjs"
import { NotificationType, ToastNotifcation } from "../Interfaces/ToastNotification"
import { NotificationService } from "./notification.service"


describe("NotificationService", () => {
    const notifications: ToastNotifcation[] = [
        { title: 'Test', type: NotificationType.SUCCESS },
        { title: 'Test2', type: NotificationType.ERROR },
        { title: 'Test3', type: NotificationType.WARNING }
    ]

    let notiService: NotificationService
    const originalTime = jasmine.DEFAULT_TIMEOUT_INTERVAL

    beforeEach( () => { 
        notiService = new NotificationService() 
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20
    })
    afterEach( () => jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTime )

    it('should show all notifications ',  (done) => {
       
        notifications.forEach(n => notiService.showNotification(n))

        notiService.notifications
        .pipe(bufferCount(notifications.length))
        .subscribe(n => {
            expect(n.length).toEqual(notifications.length)
            done()
        })
    })

    it('should remove existing notification ',  (done) => {
        const toRemove = notifications[1]
        notifications.forEach(n => notiService.showNotification(n))

        notiService.removeNotification(toRemove)

        notiService.notifications
        .pipe(bufferCount(notifications.length-1))
        .subscribe(n => {
            const isRemoved = n.find(n => n.find(n => n === toRemove))

            expect(n.length).toEqual(notifications.length-1)
            expect(isRemoved).toBeFalsy() //Removed notification should not be emitted

            done()
        })
    })

    it('should not remove non-existing notification ',  (done) => {
        const toRemove = { title: 'Test4', type: NotificationType.SUCCESS }

        notifications.forEach(n => notiService.showNotification(n))
        notiService.removeNotification(toRemove)


        notiService.notifications
        .pipe(bufferCount(notifications.length))
        .subscribe(n => {
            const isRemoved = n.find(n => n.find(n => n === toRemove))

            expect(n.length).toEqual(notifications.length) //No elements removed
            expect(isRemoved).toBeFalsy() //Removed notification should not be found

            done()
        })
    })

})