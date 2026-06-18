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
     * @param page
     * @param limit
     * @param search
     * @param category
     * @returns any
     * @throws ApiError
     */
    public static instructorDashboardControllerFindMyCourses(
        page?: number,
        limit?: number,
        search?: string,
        category?: 'frontend' | 'backend' | 'ai' | 'base' | 'mobile' | 'devops',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/instructor-dashboard/my-courses',
            query: {
                'page': page,
                'limit': limit,
                'search': search,
                'category': category,
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
    public static instructorDashboardControllerFindMyQas(
        page?: number,
        limit?: number,
        courseId?: string,
        lessonId?: string,
        status?: 'questioned' | 'waiting' | 'answered',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/instructor-dashboard/my-qas',
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
     * @param status
     * @returns any
     * @throws ApiError
     */
    public static instructorDashboardControllerFindMyComments(
        page?: number,
        limit?: number,
        courseId?: string,
        status?: 'rejected' | 'accepted' | 'waiting',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/instructor-dashboard/my-comments',
            query: {
                'page': page,
                'limit': limit,
                'courseId': courseId,
                'status': status,
            },
        });
    }
    /**
     * @param page
     * @param limit
     * @param courseId
     * @returns any
     * @throws ApiError
     */
    public static instructorDashboardControllerFindMyIncome(
        page?: number,
        limit?: number,
        courseId?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/instructor-dashboard/my-income',
            query: {
                'page': page,
                'limit': limit,
                'courseId': courseId,
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
     * @param page
     * @param limit
     * @param search
     * @param category
     * @returns any
     * @throws ApiError
     */
    public static instructorDashboardControllerFindMyCourseStudents(
        courseId: string,
        page?: number,
        limit?: number,
        search?: string,
        category?: 'frontend' | 'backend' | 'ai' | 'base' | 'mobile' | 'devops',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/instructor-dashboard/my-courses/{courseId}/students',
            path: {
                'courseId': courseId,
            },
            query: {
                'page': page,
                'limit': limit,
                'search': search,
                'category': category,
            },
        });
    }
}
