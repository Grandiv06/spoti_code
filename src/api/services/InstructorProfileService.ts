/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UpdateInstructorProfileDto } from '../models/UpdateInstructorProfileDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InstructorProfileService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static instructorProfileControllerGetMine(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/instructor-dashboard/me',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static instructorProfileControllerUpdateMine(
        requestBody: UpdateInstructorProfileDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/instructor-dashboard/me',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param teacherId
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static instructorProfileControllerUpdateByTeacherId(
        teacherId: string,
        requestBody: UpdateInstructorProfileDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/instructor-dashboard/profile/admin/{teacherId}',
            path: {
                'teacherId': teacherId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param teacherId
     * @returns any
     * @throws ApiError
     */
    public static instructorProfileControllerGetByTeacherId(
        teacherId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/instructor-dashboard/profile/admin/{teacherId}',
            path: {
                'teacherId': teacherId,
            },
        });
    }
}
