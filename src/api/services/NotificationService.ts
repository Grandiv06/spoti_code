/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateBroadcastNotificationDto } from '../models/CreateBroadcastNotificationDto';
import type { CreateNotificationDto } from '../models/CreateNotificationDto';
import type { NotificationEntity } from '../models/NotificationEntity';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationService {
    /**
     * @param requestBody
     * @returns NotificationEntity
     * @throws ApiError
     */
    public static notificationControllerCreate(
        requestBody: CreateNotificationDto,
    ): CancelablePromise<NotificationEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/admin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns NotificationEntity
     * @throws ApiError
     */
    public static notificationControllerCreateBroadcast(
        requestBody: CreateBroadcastNotificationDto,
    ): CancelablePromise<NotificationEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/admin/broadcast',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param isRead
     * @param type
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static notificationControllerFindMyNotifications(
        isRead?: boolean,
        type?: 'info' | 'success' | 'warning' | 'error',
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notifications/my',
            query: {
                'isRead': isRead,
                'type': type,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static notificationControllerGetMyUnreadCount(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notifications/my/unread-count',
        });
    }
    /**
     * @param id
     * @returns NotificationEntity
     * @throws ApiError
     */
    public static notificationControllerMarkAsRead(
        id: string,
    ): CancelablePromise<NotificationEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/notifications/my/{id}/read',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static notificationControllerMarkAllAsRead(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/notifications/my/read-all',
        });
    }
}
