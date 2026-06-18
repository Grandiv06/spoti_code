/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerQaDto } from '../models/AnswerQaDto';
import type { CreateQaDto } from '../models/CreateQaDto';
import type { QaEntity } from '../models/QaEntity';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QaService {
    /**
     * @param requestBody
     * @returns QaEntity
     * @throws ApiError
     */
    public static qaControllerCreate(
        requestBody: CreateQaDto,
    ): CancelablePromise<QaEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/qas',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param page
     * @param limit
     * @param courseId
     * @param lessonId
     * @param status
     * @returns any
     * @throws ApiError
     */
    public static qaControllerFindMy(
        page?: number,
        limit?: number,
        courseId?: string,
        lessonId?: string,
        status?: 'questioned' | 'waiting' | 'answered',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/qas/my',
            query: {
                'page': page,
                'limit': limit,
                'courseId': courseId,
                'lessonId': lessonId,
                'status': status,
            },
        });
    }
    /**
     * @param page
     * @param limit
     * @param courseId
     * @param lessonId
     * @param status
     * @returns any
     * @throws ApiError
     */
    public static qaControllerFindForInstructor(
        page?: number,
        limit?: number,
        courseId?: string,
        lessonId?: string,
        status?: 'questioned' | 'waiting' | 'answered',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/qas/instructor',
            query: {
                'page': page,
                'limit': limit,
                'courseId': courseId,
                'lessonId': lessonId,
                'status': status,
            },
        });
    }
    /**
     * @param id
     * @returns QaEntity
     * @throws ApiError
     */
    public static qaControllerAccept(
        id: string,
    ): CancelablePromise<QaEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/qas/{id}/accept',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns QaEntity
     * @throws ApiError
     */
    public static qaControllerAnswer(
        id: string,
        requestBody: AnswerQaDto,
    ): CancelablePromise<QaEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/qas/{id}/answer',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
