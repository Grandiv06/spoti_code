/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssignUserCourseDto } from '../models/AssignUserCourseDto';
import type { CourseEntity } from '../models/CourseEntity';
import type { CourseLessonEntity } from '../models/CourseLessonEntity';
import type { CourseStepEntity } from '../models/CourseStepEntity';
import type { CreateCourseDto } from '../models/CreateCourseDto';
import type { CreateCourseLessonDto } from '../models/CreateCourseLessonDto';
import type { CreateCourseStepDto } from '../models/CreateCourseStepDto';
import type { CreateTeacherDto } from '../models/CreateTeacherDto';
import type { TeacherEntity } from '../models/TeacherEntity';
import type { UpdateCourseDto } from '../models/UpdateCourseDto';
import type { UpdateCourseLessonDto } from '../models/UpdateCourseLessonDto';
import type { UpdateCourseStepDto } from '../models/UpdateCourseStepDto';
import type { UpdateLessonFreeStatusDto } from '../models/UpdateLessonFreeStatusDto';
import type { UpdatePublishStatusDto } from '../models/UpdatePublishStatusDto';
import type { UpdateTeacherDto } from '../models/UpdateTeacherDto';
import type { UserCourseEntity } from '../models/UserCourseEntity';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CourseService {
    /**
     * @param search
     * @param slug
     * @param category
     * @param difficulty
     * @param priceType
     * @param teacherId
     * @param discountCode
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static courseControllerFindAllPublicCourses(
        search?: string,
        slug?: string,
        category?: 'frontend' | 'backend' | 'ai' | 'base' | 'mobile' | 'devops',
        difficulty?: 'beginner' | 'intermediate' | 'advanced',
        priceType?: 'free' | 'cash',
        teacherId?: string,
        discountCode?: string,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/courses/public',
            query: {
                'search': search,
                'slug': slug,
                'category': category,
                'difficulty': difficulty,
                'priceType': priceType,
                'teacherId': teacherId,
                'discountCode': discountCode,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param slug
     * @param discountCode
     * @param inclueSteps
     * @param inclueLessons
     * @returns CourseEntity
     * @throws ApiError
     */
    public static courseControllerFindOnePublicCourseBySlug(
        slug: string,
        discountCode?: string,
        inclueSteps?: boolean,
        inclueLessons?: boolean,
    ): CancelablePromise<CourseEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/courses/public/slug/{slug}',
            path: {
                'slug': slug,
            },
            query: {
                'discountCode': discountCode,
                'inclueSteps': inclueSteps,
                'inclueLessons': inclueLessons,
            },
        });
    }
    /**
     * @param id
     * @param discountCode
     * @param inclueSteps
     * @param inclueLessons
     * @returns CourseEntity
     * @throws ApiError
     */
    public static courseControllerFindOnePublicCourse(
        id: string,
        discountCode?: string,
        inclueSteps?: boolean,
        inclueLessons?: boolean,
    ): CancelablePromise<CourseEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/courses/public/{id}',
            path: {
                'id': id,
            },
            query: {
                'discountCode': discountCode,
                'inclueSteps': inclueSteps,
                'inclueLessons': inclueLessons,
            },
        });
    }
    /**
     * @param courseId
     * @param inclueLessons
     * @returns CourseStepEntity
     * @throws ApiError
     */
    public static courseControllerFindCourseSteps(
        courseId: string,
        inclueLessons?: boolean,
    ): CancelablePromise<Array<CourseStepEntity>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/courses/{courseId}/steps',
            path: {
                'courseId': courseId,
            },
            query: {
                'inclueLessons': inclueLessons,
            },
        });
    }
    /**
     * @param id
     * @returns CourseStepEntity
     * @throws ApiError
     */
    public static courseControllerFindCourseStepById(
        id: string,
    ): CancelablePromise<CourseStepEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/courses/steps/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param stepId
     * @returns CourseLessonEntity
     * @throws ApiError
     */
    public static courseControllerFindCourseStepLessons(
        stepId: string,
    ): CancelablePromise<Array<CourseLessonEntity>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/courses/steps/{stepId}/lessons',
            path: {
                'stepId': stepId,
            },
        });
    }
    /**
     * @param id
     * @returns CourseLessonEntity
     * @throws ApiError
     */
    public static courseControllerFindCourseStepLessonById(
        id: string,
    ): CancelablePromise<CourseLessonEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/courses/steps/lessons/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static courseControllerCompleteLesson(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/courses/lessons/{id}/complete',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param search
     * @param slug
     * @param category
     * @param difficulty
     * @param priceType
     * @param teacherId
     * @param discountCode
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static courseControllerFindAllAdminCourses(
        search?: string,
        slug?: string,
        category?: 'frontend' | 'backend' | 'ai' | 'base' | 'mobile' | 'devops',
        difficulty?: 'beginner' | 'intermediate' | 'advanced',
        priceType?: 'free' | 'cash',
        teacherId?: string,
        discountCode?: string,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/courses/admin',
            query: {
                'search': search,
                'slug': slug,
                'category': category,
                'difficulty': difficulty,
                'priceType': priceType,
                'teacherId': teacherId,
                'discountCode': discountCode,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param requestBody
     * @returns CourseEntity
     * @throws ApiError
     */
    public static courseControllerCreateCourse(
        requestBody: CreateCourseDto,
    ): CancelablePromise<CourseEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/courses/admin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param discountCode
     * @param inclueSteps
     * @param inclueLessons
     * @returns CourseEntity
     * @throws ApiError
     */
    public static courseControllerFindOneAdminCourse(
        id: string,
        discountCode?: string,
        inclueSteps?: boolean,
        inclueLessons?: boolean,
    ): CancelablePromise<CourseEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/courses/{id}/admin',
            path: {
                'id': id,
            },
            query: {
                'discountCode': discountCode,
                'inclueSteps': inclueSteps,
                'inclueLessons': inclueLessons,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns CourseEntity
     * @throws ApiError
     */
    public static courseControllerUpdateCourse(
        id: string,
        requestBody: UpdateCourseDto,
    ): CancelablePromise<CourseEntity> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/courses/{id}/admin',
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
    public static courseControllerRemoveCourse(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/courses/{id}/admin',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns CourseEntity
     * @throws ApiError
     */
    public static courseControllerUpdateCoursePublishStatus(
        id: string,
        requestBody: UpdatePublishStatusDto,
    ): CancelablePromise<CourseEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/courses/{id}/publish-status/admin',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns CourseStepEntity
     * @throws ApiError
     */
    public static courseControllerCreateStep(
        requestBody: CreateCourseStepDto,
    ): CancelablePromise<CourseStepEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/courses/steps/admin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns CourseStepEntity
     * @throws ApiError
     */
    public static courseControllerUpdateStep(
        id: string,
        requestBody: UpdateCourseStepDto,
    ): CancelablePromise<CourseStepEntity> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/courses/steps/{id}/admin',
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
    public static courseControllerRemoveStep(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/courses/steps/{id}/admin',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns CourseStepEntity
     * @throws ApiError
     */
    public static courseControllerUpdateStepPublishStatus(
        id: string,
        requestBody: UpdatePublishStatusDto,
    ): CancelablePromise<CourseStepEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/courses/steps/{id}/publish-status/admin',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns CourseLessonEntity
     * @throws ApiError
     */
    public static courseControllerCreateLesson(
        requestBody: CreateCourseLessonDto,
    ): CancelablePromise<CourseLessonEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/courses/lessons/admin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns CourseLessonEntity
     * @throws ApiError
     */
    public static courseControllerUpdateLesson(
        id: string,
        requestBody: UpdateCourseLessonDto,
    ): CancelablePromise<CourseLessonEntity> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/courses/lessons/{id}/admin',
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
    public static courseControllerRemoveLesson(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/courses/lessons/{id}/admin',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns CourseLessonEntity
     * @throws ApiError
     */
    public static courseControllerUpdateLessonPublishStatus(
        id: string,
        requestBody: UpdatePublishStatusDto,
    ): CancelablePromise<CourseLessonEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/courses/lessons/{id}/publish-status/admin',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns CourseLessonEntity
     * @throws ApiError
     */
    public static courseControllerUpdateLessonFreeStatus(
        id: string,
        requestBody: UpdateLessonFreeStatusDto,
    ): CancelablePromise<CourseLessonEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/courses/lessons/{id}/free-status/admin',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns TeacherEntity
     * @throws ApiError
     */
    public static courseControllerCreateTeacher(
        requestBody: CreateTeacherDto,
    ): CancelablePromise<TeacherEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/courses/teachers/admin',
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
    public static courseControllerFindAllTeachers(
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/courses/teachers/admin',
            query: {
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param id
     * @returns TeacherEntity
     * @throws ApiError
     */
    public static courseControllerFindOneTeacher(
        id: string,
    ): CancelablePromise<TeacherEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/courses/teachers/{id}/admin',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns TeacherEntity
     * @throws ApiError
     */
    public static courseControllerUpdateTeacher(
        id: string,
        requestBody: UpdateTeacherDto,
    ): CancelablePromise<TeacherEntity> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/courses/teachers/{id}/admin',
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
    public static courseControllerRemoveTeacher(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/courses/teachers/{id}/admin',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns UserCourseEntity
     * @throws ApiError
     */
    public static courseControllerAssignUserToCourse(
        id: string,
        requestBody: AssignUserCourseDto,
    ): CancelablePromise<UserCourseEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/courses/{id}/assign-user/admin',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param userId
     * @returns any
     * @throws ApiError
     */
    public static courseControllerUnassignUserFromCourse(
        id: string,
        userId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/courses/{id}/unassign-user/{userId}/admin',
            path: {
                'id': id,
                'userId': userId,
            },
        });
    }
}
