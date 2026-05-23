/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InitiatePaymentDto = {
    gateway?: InitiatePaymentDto.gateway;
    callbackUrl?: string;
    description?: string;
};
export namespace InitiatePaymentDto {
    export enum gateway {
        ZARRINPAL = 'zarrinpal',
        MANUAL = 'manual',
    }
}

