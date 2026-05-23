/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplyDiscountDto } from '../models/ApplyDiscountDto';
import type { CreateDiscountDto } from '../models/CreateDiscountDto';
import type { DiscountEntity } from '../models/DiscountEntity';
import type { UpdateDiscountDto } from '../models/UpdateDiscountDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DiscountService {
    /**
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static discountControllerFindAll(
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/discounts/admin',
            query: {
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param requestBody
     * @returns DiscountEntity
     * @throws ApiError
     */
    public static discountControllerCreate(
        requestBody: CreateDiscountDto,
    ): CancelablePromise<DiscountEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/discounts/admin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns DiscountEntity
     * @throws ApiError
     */
    public static discountControllerFindOne(
        id: string,
    ): CancelablePromise<DiscountEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/discounts/{id}/admin',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns DiscountEntity
     * @throws ApiError
     */
    public static discountControllerUpdate(
        id: string,
        requestBody: UpdateDiscountDto,
    ): CancelablePromise<DiscountEntity> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/discounts/{id}/admin',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static discountControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/discounts/{id}/admin',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static discountControllerPreviewApply(
        requestBody: ApplyDiscountDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/discounts/apply',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static discountControllerConsume(
        requestBody: ApplyDiscountDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/discounts/consume',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
