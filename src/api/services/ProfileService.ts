/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProfileEntity } from '../models/ProfileEntity';
import type { UpsertProfileDto } from '../models/UpsertProfileDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProfileService {
    /**
     * @returns ProfileEntity
     * @throws ApiError
     */
    public static profileControllerGetMyProfile(): CancelablePromise<ProfileEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/profiles/me',
        });
    }
    /**
     * @param requestBody
     * @returns ProfileEntity
     * @throws ApiError
     */
    public static profileControllerUpsertMyProfile(
        requestBody: UpsertProfileDto,
    ): CancelablePromise<ProfileEntity> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/profiles/me',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
