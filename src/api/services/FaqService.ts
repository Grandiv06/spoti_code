/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateFaqDto } from '../models/CreateFaqDto';
import type { FaqEntity } from '../models/FaqEntity';
import type { UpdateFaqDto } from '../models/UpdateFaqDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FaqService {
    /**
     * @param courseId
     * @param isPublished
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static faqControllerFindPublicByCourse(
        courseId: string,
        isPublished?: boolean,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/faqs/public/course/{courseId}',
            path: {
                'courseId': courseId,
            },
            query: {
                'isPublished': isPublished,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param courseId
     * @param isPublished
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static faqControllerFindAdminByCourse(
        courseId: string,
        isPublished?: boolean,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/faqs/admin/course/{courseId}',
            path: {
                'courseId': courseId,
            },
            query: {
                'isPublished': isPublished,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param requestBody
     * @returns FaqEntity
     * @throws ApiError
     */
    public static faqControllerCreate(
        requestBody: CreateFaqDto,
    ): CancelablePromise<FaqEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/faqs/admin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns FaqEntity
     * @throws ApiError
     */
    public static faqControllerUpdate(
        id: string,
        requestBody: UpdateFaqDto,
    ): CancelablePromise<FaqEntity> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/faqs/{id}/admin',
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
    public static faqControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/faqs/{id}/admin',
            path: {
                'id': id,
            },
        });
    }
}
