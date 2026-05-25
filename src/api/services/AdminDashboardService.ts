/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DataHistoryEntity } from '../models/DataHistoryEntity';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminDashboardService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static adminDashboardControllerGetOverview(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin-dashboard/overview',
        });
    }
    /**
     * @param search Search by fullName, email, phoneNumber, nationalCode, or userName
     * @param email
     * @param phoneNumber
     * @param nationalCode
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static adminDashboardControllerFindUsers(
        search?: string,
        email?: string,
        phoneNumber?: string,
        nationalCode?: string,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin-dashboard/users',
            query: {
                'search': search,
                'email': email,
                'phoneNumber': phoneNumber,
                'nationalCode': nationalCode,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param search
     * @param category
     * @param isPublished true or false
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static adminDashboardControllerFindCourses(
        search?: string,
        category?: 'frontend' | 'backend' | 'ai' | 'base' | 'mobile' | 'devops',
        isPublished?: string,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin-dashboard/courses',
            query: {
                'search': search,
                'category': category,
                'isPublished': isPublished,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param status
     * @param userId
     * @param courseId
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static adminDashboardControllerFindOrders(
        status?: 'pending' | 'redirected' | 'expired' | 'paid' | 'failed' | 'canceled',
        userId?: string,
        courseId?: string,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin-dashboard/orders',
            query: {
                'status': status,
                'userId': userId,
                'courseId': courseId,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param courseId
     * @returns any
     * @throws ApiError
     */
    public static adminDashboardControllerGetCourseExtraDetails(
        courseId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin-dashboard/courses/{courseId}/extra-details',
            path: {
                'courseId': courseId,
            },
        });
    }
    /**
     * @param courseId
     * @param search Search by fullName, email, phoneNumber, nationalCode, or userName
     * @param email
     * @param phoneNumber
     * @param nationalCode
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static adminDashboardControllerFindCourseStudents(
        courseId: string,
        search?: string,
        email?: string,
        phoneNumber?: string,
        nationalCode?: string,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin-dashboard/courses/{courseId}/students',
            path: {
                'courseId': courseId,
            },
            query: {
                'search': search,
                'email': email,
                'phoneNumber': phoneNumber,
                'nationalCode': nationalCode,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param type
     * @param limit Max rows to export (1..5000)
     * @returns any
     * @throws ApiError
     */
    public static adminDashboardControllerGenerateReport(
        type: 'users' | 'courses' | 'orders',
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin-dashboard/reports',
            query: {
                'type': type,
                'limit': limit,
            },
        });
    }
    /**
     * @param days Last N days. Ignored when startDate/endDate are provided.
     * @param startDate
     * @param endDate
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static adminDashboardControllerFindDataHistory(
        days?: number,
        startDate?: string,
        endDate?: string,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin-dashboard/data-history',
            query: {
                'days': days,
                'startDate': startDate,
                'endDate': endDate,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @returns DataHistoryEntity
     * @throws ApiError
     */
    public static adminDashboardControllerCreateSnapshot(): CancelablePromise<DataHistoryEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin-dashboard/data-history/snapshot',
        });
    }
}
