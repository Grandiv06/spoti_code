/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateDiscountDto = {
    code?: string;
    type: CreateDiscountDto.type;
    value: number;
    startsAt?: string;
    expiresAt?: string;
    isActive?: boolean;
    globalUsageLimit?: number;
    perUserUsageLimit?: number;
};
export namespace CreateDiscountDto {
    export enum type {
        PERCENT = 'percent',
        FIXED = 'fixed',
    }
}

