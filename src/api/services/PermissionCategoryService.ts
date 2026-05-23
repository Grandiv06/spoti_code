/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PermissionCategoryService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static permissionCategoryControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/permission-categories',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static permissionCategoryControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/permission-categories/{id}',
            path: {
                'id': id,
            },
        });
    }
}
