/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrderDto } from '../models/CreateOrderDto';
import type { FeeCalculationDto } from '../models/FeeCalculationDto';
import type { InitiatePaymentDto } from '../models/InitiatePaymentDto';
import type { InquiryOrderDto } from '../models/InquiryOrderDto';
import type { OrderEntity } from '../models/OrderEntity';
import type { VerifyPaymentDto } from '../models/VerifyPaymentDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderService {
    /**
     * @param requestBody
     * @returns OrderEntity
     * @throws ApiError
     */
    public static orderControllerCreate(
        requestBody: CreateOrderDto,
    ): CancelablePromise<OrderEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/orders',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param status
     * @param courseId
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static orderControllerFindMyOrders(
        status?: 'pending' | 'redirected' | 'expired' | 'paid' | 'failed' | 'canceled',
        courseId?: string,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/orders/my',
            query: {
                'status': status,
                'courseId': courseId,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param id
     * @returns OrderEntity
     * @throws ApiError
     */
    public static orderControllerFindOneMine(
        id: string,
    ): CancelablePromise<OrderEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/orders/my/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static orderControllerInitiatePayment(
        id: string,
        requestBody: InitiatePaymentDto,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/orders/{id}/initiate-payment',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns OrderEntity
     * @throws ApiError
     */
    public static orderControllerVerifyPayment(
        id: string,
        requestBody: VerifyPaymentDto,
    ): CancelablePromise<OrderEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/orders/{id}/verify-payment',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns OrderEntity
     * @throws ApiError
     */
    public static orderControllerCancelOrder(
        id: string,
    ): CancelablePromise<OrderEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/orders/{id}/cancel',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static orderControllerInquiryPayment(
        id: string,
        requestBody: InquiryOrderDto,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/orders/{id}/inquiry',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static orderControllerFeeCalculation(
        requestBody: FeeCalculationDto,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/orders/fee-calculation',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param orderId
     * @param authority
     * @param status
     * @returns any
     * @throws ApiError
     */
    public static orderControllerZarinpalCallback(
        orderId: string,
        authority?: string,
        status?: 'OK' | 'NOK',
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/orders/gateway/zarinpal/callback',
            query: {
                'Authority': authority,
                'Status': status,
                'order_id': orderId,
            },
        });
    }
}
