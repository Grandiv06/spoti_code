/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommentEntity } from '../models/CommentEntity';
import type { CreateCommentDto } from '../models/CreateCommentDto';
import type { UpdateCommentDto } from '../models/UpdateCommentDto';
import type { UpdateCommentStatusDto } from '../models/UpdateCommentStatusDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CommentService {
    /**
     * @param commentableType
     * @param commentableId
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static commentControllerFindByTarget(
        commentableType: string,
        commentableId: string,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/comments/{commentableType}/{commentableId}',
            path: {
                'commentableType': commentableType,
                'commentableId': commentableId,
            },
            query: {
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param requestBody
     * @returns CommentEntity
     * @throws ApiError
     */
    public static commentControllerCreate(
        requestBody: CreateCommentDto,
    ): CancelablePromise<CommentEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/comments',
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
    public static commentControllerFindAllAdmin(
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/comments/admin',
            query: {
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param id
     * @returns CommentEntity
     * @throws ApiError
     */
    public static commentControllerFindOneAdmin(
        id: string,
    ): CancelablePromise<CommentEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/comments/{id}/admin',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns CommentEntity
     * @throws ApiError
     */
    public static commentControllerUpdateAdmin(
        id: string,
        requestBody: UpdateCommentDto,
    ): CancelablePromise<CommentEntity> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/comments/{id}/admin',
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
    public static commentControllerRemoveAdmin(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/comments/{id}/admin',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns CommentEntity
     * @throws ApiError
     */
    public static commentControllerUpdateStatusAdmin(
        id: string,
        requestBody: UpdateCommentStatusDto,
    ): CancelablePromise<CommentEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/comments/{id}/status/admin',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns CommentEntity
     * @throws ApiError
     */
    public static commentControllerReplyAsAdmin(
        requestBody: CreateCommentDto,
    ): CancelablePromise<CommentEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/comments/reply/admin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
