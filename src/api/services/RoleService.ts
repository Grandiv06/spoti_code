/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRoleDto } from '../models/CreateRoleDto';
import type { GrantPermissionToRoleDto } from '../models/GrantPermissionToRoleDto';
import type { GrantToUserDto } from '../models/GrantToUserDto';
import type { Permission } from '../models/Permission';
import type { Role } from '../models/Role';
import type { UpdateRoleDto } from '../models/UpdateRoleDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RoleService {
    /**
     * @param requestBody
     * @returns Role
     * @throws ApiError
     */
    public static roleControllerCreate(
        requestBody: CreateRoleDto,
    ): CancelablePromise<Role> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/roles',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns Role
     * @throws ApiError
     */
    public static roleControllerFindAll(): CancelablePromise<Array<Role>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/roles',
        });
    }
    /**
     * @param id
     * @returns Role
     * @throws ApiError
     */
    public static roleControllerFindOne(
        id: string,
    ): CancelablePromise<Role> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/roles/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static roleControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/roles/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns UpdateRoleDto
     * @throws ApiError
     */
    public static roleControllerUpdate(
        id: string,
        requestBody: UpdateRoleDto,
    ): CancelablePromise<UpdateRoleDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/roles/{id}',
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
    public static roleControllerGrantToUser(
        requestBody: GrantToUserDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/roles/grant-to-user',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static roleControllerDismissFromUser(
        requestBody: GrantToUserDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/roles/dismiss-from-user',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static roleControllerGrantPermissions(
        requestBody: GrantPermissionToRoleDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/roles/grant-permissions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static roleControllerDissmisPermissions(
        requestBody: GrantPermissionToRoleDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/roles/dissmis-permissions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param roleId
     * @returns Permission
     * @throws ApiError
     */
    public static roleControllerGetPermissions(
        roleId: string,
    ): CancelablePromise<Array<Permission>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/roles/{roleId}/permissions',
            path: {
                'roleId': roleId,
            },
        });
    }
}
