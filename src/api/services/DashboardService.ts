/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProfileEntity } from '../models/ProfileEntity';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DashboardService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static dashboardControllerGetOverview(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/overview',
        });
    }
    /**
     * @param category
     * @param search
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static dashboardControllerFindMyCourses(
        category?: 'frontend' | 'backend' | 'ai' | 'base' | 'mobile' | 'devops',
        search?: string,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/my-courses',
            query: {
                'category': category,
                'search': search,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param status
     * @param commentableType
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static dashboardControllerFindMyComments(
        status?: 'rejected' | 'accepted' | 'waiting',
        commentableType?: 'course',
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/my-comments',
            query: {
                'status': status,
                'commentableType': commentableType,
                'page': page,
                'limit': limit,
            },
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
    public static dashboardControllerFindMyNotifications(
        isRead?: boolean,
        type?: 'info' | 'success' | 'warning' | 'error',
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/my-notifications',
            query: {
                'isRead': isRead,
                'type': type,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param type
     * @param status
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static dashboardControllerFindMyTransactions(
        type?: 'deposit' | 'withdrawal' | 'transfer' | 'loan',
        status?: 'pending' | 'completed' | 'failed',
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/my-transactions',
            query: {
                'type': type,
                'status': status,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param type
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static dashboardControllerFindMyActions(
        type?: 'follow' | 'unfollow' | 'like' | 'disslike' | 'bookmark',
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/my-actions',
            query: {
                'type': type,
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
    public static dashboardControllerFindMyAchievements(
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/my-achievements',
            query: {
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param status
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static dashboardControllerFindMySurveys(
        status?: 'waiting' | 'reviewed' | 'resolved',
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/my-surveys',
            query: {
                'status': status,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @returns ProfileEntity
     * @throws ApiError
     */
    public static dashboardControllerGetMyProfile(): CancelablePromise<ProfileEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/my-profile',
        });
    }
    /**
     * @param status
     * @param category
     * @param urgency
     * @param search
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static dashboardControllerFindMyTickets(
        status?: 'open' | 'underReview' | 'answered' | 'closed',
        category?: 'technical' | 'billing' | 'account' | 'featureRequest' | 'bugReport' | 'other',
        urgency?: 'high' | 'medium' | 'low',
        search?: string,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/my-tickets',
            query: {
                'status': status,
                'category': category,
                'urgency': urgency,
                'search': search,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static dashboardControllerGetMyCourseIncome(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/my-course-income',
        });
    }
}
