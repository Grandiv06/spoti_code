/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AchievementEntity } from '../models/AchievementEntity';
import type { AssignUserAchievementDto } from '../models/AssignUserAchievementDto';
import type { CreateAchievementDto } from '../models/CreateAchievementDto';
import type { UserAchievementEntity } from '../models/UserAchievementEntity';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AchievementService {
    /**
     * @param requestBody
     * @returns AchievementEntity
     * @throws ApiError
     */
    public static achievementControllerCreate(
        requestBody: CreateAchievementDto,
    ): CancelablePromise<AchievementEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/achievements/admin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns UserAchievementEntity
     * @throws ApiError
     */
    public static achievementControllerAssignToUser(
        id: string,
        requestBody: AssignUserAchievementDto,
    ): CancelablePromise<UserAchievementEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/achievements/{id}/assign/admin',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns AchievementEntity
     * @throws ApiError
     */
    public static achievementControllerFindAllActive(): CancelablePromise<Array<AchievementEntity>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/achievements/public',
        });
    }
    /**
     * @returns UserAchievementEntity
     * @throws ApiError
     */
    public static achievementControllerFindMyAchievements(): CancelablePromise<Array<UserAchievementEntity>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/achievements/my',
        });
    }
}
