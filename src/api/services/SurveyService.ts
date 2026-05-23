/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSurveyDto } from '../models/CreateSurveyDto';
import type { SurveyEntity } from '../models/SurveyEntity';
import type { UpdateSurveyAcceptanceDto } from '../models/UpdateSurveyAcceptanceDto';
import type { UpdateSurveyAdminDto } from '../models/UpdateSurveyAdminDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SurveyService {
    /**
     * @param requestBody
     * @returns SurveyEntity
     * @throws ApiError
     */
    public static surveyControllerCreate(
        requestBody: CreateSurveyDto,
    ): CancelablePromise<SurveyEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/surveys',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static surveyControllerFindAllPublic(
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/surveys',
            query: {
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static surveyControllerFindAllAdmin(
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/surveys/admin',
            query: {
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param id
     * @returns SurveyEntity
     * @throws ApiError
     */
    public static surveyControllerFindOneAdmin(
        id: string,
    ): CancelablePromise<SurveyEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/surveys/{id}/admin',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns SurveyEntity
     * @throws ApiError
     */
    public static surveyControllerUpdateAdmin(
        id: string,
        requestBody: UpdateSurveyAdminDto,
    ): CancelablePromise<SurveyEntity> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/surveys/{id}/admin',
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
    public static surveyControllerRemoveAdmin(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/surveys/{id}/admin',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns SurveyEntity
     * @throws ApiError
     */
    public static surveyControllerUpdateAcceptanceAdmin(
        id: string,
        requestBody: UpdateSurveyAcceptanceDto,
    ): CancelablePromise<SurveyEntity> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/surveys/{id}/acceptance/admin',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
