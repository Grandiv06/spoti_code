/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActionEntity } from '../models/ActionEntity';
import type { CreateActionDto } from '../models/CreateActionDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ActionService {
    /**
     * @param requestBody
     * @returns ActionEntity
     * @throws ApiError
     */
    public static actionControllerCreate(
        requestBody: CreateActionDto,
    ): CancelablePromise<ActionEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/actions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param page
     * @param limit
     * @param type
     * @returns any
     * @throws ApiError
     */
    public static actionControllerFindMyActions(
        page?: number,
        limit?: number,
        type?: 'follow' | 'unfollow' | 'like' | 'disslike' | 'bookmark',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/actions/my',
            query: {
                'page': page,
                'limit': limit,
                'type': type,
            },
        });
    }
}
