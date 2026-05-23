/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePermissionDto } from '../models/CreatePermissionDto';
import type { GrantPermissionToUserDto } from '../models/GrantPermissionToUserDto';
import type { Permission } from '../models/Permission';
import type { PermissionCategory } from '../models/PermissionCategory';
import type { UpdatePermissinDto } from '../models/UpdatePermissinDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PermissionService {
    /**
     * @returns PermissionCategory
     * @throws ApiError
     */
    public static permissionControllerFindAll(): CancelablePromise<Array<PermissionCategory>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/permissions',
        });
    }
    /**
     * @param requestBody
     * @returns Permission
     * @throws ApiError
     */
    public static permissionControllerCreate(
        requestBody: CreatePermissionDto,
    ): CancelablePromise<Permission> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/permissions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns Permission
     * @throws ApiError
     */
    public static permissionControllerFindOne(
        id: string,
    ): CancelablePromise<Permission> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/permissions/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns Permission
     * @throws ApiError
     */
    public static permissionControllerUpdate(
        id: string,
        requestBody: UpdatePermissinDto,
    ): CancelablePromise<Permission> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/permissions/{id}',
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
    public static permissionControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/permissions/{id}',
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
    public static permissionControllerDissmisPermissions(
        requestBody: GrantPermissionToUserDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/permissions/dissmis-from-user',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static permissionControllerGrantPermissions(
        requestBody: GrantPermissionToUserDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/permissions/grant-to-user',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
