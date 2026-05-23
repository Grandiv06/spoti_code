/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateNotificationDto = {
    userId: string;
    title: string;
    message: string;
    type?: CreateNotificationDto.type;
    link?: string;
};
export namespace CreateNotificationDto {
    export enum type {
        INFO = 'info',
        SUCCESS = 'success',
        WARNING = 'warning',
        ERROR = 'error',
    }
}

