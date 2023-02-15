export interface ToastNotifcation{
    id?: number,
    title: string,
    type: NotificationType
}


export enum NotificationType{
    WARNING='Warning',
    SUCCESS='Success',
    ERROR='Error'
}