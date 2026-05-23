/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateBroadcastNotificationDto = {
    title: string;
    message: string;
    type?: CreateBroadcastNotificationDto.type;
    link?: string;
};
export namespace CreateBroadcastNotificationDto {
    export enum type {
        INFO = 'info',
        SUCCESS = 'success',
        WARNING = 'warning',
        ERROR = 'error',
    }
}

