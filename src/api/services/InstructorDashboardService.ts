/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InstructorDashboardService {
    /**
     * @returns any
     * @throws ApiError
     */
    public static instructorDashboardControllerGetOverview(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/instructor-dashboard/overview',
        });
    }
    /**
     * @param search
     * @param category
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static instructorDashboardControllerFindMyCourses(
        search?: string,
        category?: 'frontend' | 'backend' | 'ai' | 'base' | 'mobile' | 'devops',
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/instructor-dashboard/my-courses',
            query: {
                'search': search,
                'category': category,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param courseId
     * @param lessonId
     * @param status
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static instructorDashboardControllerFindMyQas(
        courseId?: string,
        lessonId?: string,
        status?: 'questioned' | 'waiting' | 'answered',
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/instructor-dashboard/my-qas',
            query: {
                'courseId': courseId,
                'lessonId': lessonId,
                'status': status,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param courseId
     * @param status
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static instructorDashboardControllerFindMyComments(
        courseId?: string,
        status?: 'rejected' | 'accepted' | 'waiting',
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/instructor-dashboard/my-comments',
            query: {
                'courseId': courseId,
                'status': status,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param courseId
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static instructorDashboardControllerFindMyIncome(
        courseId?: string,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/instructor-dashboard/my-income',
            query: {
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
    public static instructorDashboardControllerGetMyCourseExtraDetails(
        courseId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/instructor-dashboard/my-courses/{courseId}/extra-details',
            path: {
                'courseId': courseId,
            },
        });
    }
    /**
     * @param courseId
     * @param search
     * @param category
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static instructorDashboardControllerFindMyCourseStudents(
        courseId: string,
        search?: string,
        category?: 'frontend' | 'backend' | 'ai' | 'base' | 'mobile' | 'devops',
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/instructor-dashboard/my-courses/{courseId}/students',
            path: {
                'courseId': courseId,
            },
            query: {
                'search': search,
                'category': category,
                'page': page,
                'limit': limit,
            },
        });
    }
}
