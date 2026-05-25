/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { File } from '../models/File';
import type { PaginatedFindAllUsersByRolenameResponse } from '../models/PaginatedFindAllUsersByRolenameResponse';
import type { Permission } from '../models/Permission';
import type { RegisterDto } from '../models/RegisterDto';
import type { Role } from '../models/Role';
import type { updateProfileDto } from '../models/updateProfileDto';
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { User } from '../models/User';
import type { UserPaginatedResopnse } from '../models/UserPaginatedResopnse';
import type { VerifyUserDto } from '../models/VerifyUserDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * @param roleName
     * @param advancedSearch
     * @param userName
     * @param email
     * @param phoneNumber
     * @param name
     * @param nationalCode
     * @param page
     * @param limit
     * @returns any
     * @returns UserPaginatedResopnse
     * @throws ApiError
     */
    public static userControllerFindAll(
        roleName?: string,
        advancedSearch?: boolean,
        userName?: string,
        email?: string,
        phoneNumber?: string,
        name?: string,
        nationalCode?: string,
        page?: number,
        limit?: number,
    ): CancelablePromise<Record<string, any> | UserPaginatedResopnse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users',
            query: {
                'roleName': roleName,
                'advancedSearch': advancedSearch,
                'userName': userName,
                'email': email,
                'phoneNumber': phoneNumber,
                'name': name,
                'nationalCode': nationalCode,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param requestBody
     * @returns User
     * @throws ApiError
     */
    public static userControllerCreate(
        requestBody: RegisterDto,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/users',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param page
     * @param limit
     * @param search
     * @param filterRolesName Filter by roles.name using operators like $eq, $gte, etc.
     * @param sortBy
     * @returns PaginatedFindAllUsersByRolenameResponse
     * @throws ApiError
     */
    public static userControllerFindAllByRolename(
        page?: number,
        limit?: number,
        search?: string,
        filterRolesName?: string,
        sortBy?: Array<string>,
    ): CancelablePromise<PaginatedFindAllUsersByRolenameResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/find-all-by-rolename',
            query: {
                'page': page,
                'limit': limit,
                'search': search,
                'filter.roles.name': filterRolesName,
                'sortBy': sortBy,
            },
        });
    }
    /**
     * @returns User
     * @throws ApiError
     */
    public static userControllerGetProfile(): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/profile',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static userControllerUpdateProfile(
        requestBody: updateProfileDto,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/users/profile',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns User
     * @throws ApiError
     */
    public static userControllerFindOne(
        id: string,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/{id}',
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
    public static userControllerUpdate(
        id: string,
        requestBody: UpdateUserDto,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/users/{id}',
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
    public static userControllerDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/users/{id}',
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
    public static userControllerRestore(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns Permission
     * @throws ApiError
     */
    public static userControllerGetPermissions(): CancelablePromise<Array<Permission>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/profile/permissions',
        });
    }
    /**
     * @returns Role
     * @throws ApiError
     */
    public static userControllerGetRoles(): CancelablePromise<Array<Role>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/profile/roles',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static userControllerUpload(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/users/{id}/files',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns File
     * @throws ApiError
     */
    public static userControllerGetFiles(
        id: string,
    ): CancelablePromise<Array<File>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/{id}/files',
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
    public static userControllerVerify(
        id: string,
        requestBody: VerifyUserDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/users/{id}/verify',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
