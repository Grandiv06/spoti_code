/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateTransactionDto = {
    userId: string;
    type: CreateTransactionDto.type;
    status?: CreateTransactionDto.status;
    amount: number;
    title?: string;
    description?: string;
    referenceId?: string;
};
export namespace CreateTransactionDto {
    export enum type {
        DEPOSIT = 'deposit',
        WITHDRAWAL = 'withdrawal',
        TRANSFER = 'transfer',
        LOAN = 'loan',
    }
    export enum status {
        PENDING = 'pending',
        COMPLETED = 'completed',
        FAILED = 'failed',
    }
}

