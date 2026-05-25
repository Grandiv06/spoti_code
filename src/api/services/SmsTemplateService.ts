/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSmsTemplateDto } from '../models/CreateSmsTemplateDto';
import type { SmsTemplateEntity } from '../models/SmsTemplateEntity';
import type { UpdateSmsTemplateDto } from '../models/UpdateSmsTemplateDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SmsTemplateService {
    /**
     * @param requestBody
     * @returns SmsTemplateEntity
     * @throws ApiError
     */
    public static smsTemplateControllerCreate(
        requestBody: CreateSmsTemplateDto,
    ): CancelablePromise<SmsTemplateEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sms-template',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns SmsTemplateEntity
     * @throws ApiError
     */
    public static smsTemplateControllerFindAll(): CancelablePromise<Array<SmsTemplateEntity>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/sms-template',
        });
    }
    /**
     * @param id
     * @returns SmsTemplateEntity
     * @throws ApiError
     */
    public static smsTemplateControllerFindOne(
        id: string,
    ): CancelablePromise<SmsTemplateEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/sms-template/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns SmsTemplateEntity
     * @throws ApiError
     */
    public static smsTemplateControllerUpdate(
        id: string,
        requestBody: UpdateSmsTemplateDto,
    ): CancelablePromise<SmsTemplateEntity> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/sms-template/{id}',
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
    public static smsTemplateControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/sms-template/{id}',
            path: {
                'id': id,
            },
        });
    }
}
