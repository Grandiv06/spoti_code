/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTransactionDto } from '../models/CreateTransactionDto';
import type { TransactionEntity } from '../models/TransactionEntity';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TransactionService {
    /**
     * @param requestBody
     * @returns TransactionEntity
     * @throws ApiError
     */
    public static transactionControllerCreate(
        requestBody: CreateTransactionDto,
    ): CancelablePromise<TransactionEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/transactions/admin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param type
     * @param status
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static transactionControllerFindMyTransactions(
        type?: 'deposit' | 'withdrawal' | 'transfer' | 'loan',
        status?: 'pending' | 'completed' | 'failed',
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/transactions/my',
            query: {
                'type': type,
                'status': status,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static transactionControllerGetMySummary(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/transactions/my/summary',
        });
    }
}
