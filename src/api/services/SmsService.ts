/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkDeleteDto } from '../models/BulkDeleteDto';
import type { PaginatedSmsResponse } from '../models/PaginatedSmsResponse';
import type { SaveDraftDto } from '../models/SaveDraftDto';
import type { SaveGroupDrafts } from '../models/SaveGroupDrafts';
import type { SendDraftDto } from '../models/SendDraftDto';
import type { SendGroupDraftDto } from '../models/SendGroupDraftDto';
import type { SendGroupSmsDto } from '../models/SendGroupSmsDto';
import type { SendSmsDto } from '../models/SendSmsDto';
import type { SmsEntity } from '../models/SmsEntity';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SmsService {
    /**
     * @param page
     * @param limit
     * @param search
     * @param filterPhoneNumber Filter by phoneNumber using operators like $eq, $gte, etc.
     * @param filterStatus Filter by status using operators like $eq, $gte, etc.
     * @param sortBy
     * @returns PaginatedSmsResponse
     * @throws ApiError
     */
    public static smsControllerFindAll(
        page?: number,
        limit?: number,
        search?: string,
        filterPhoneNumber?: string,
        filterStatus?: string,
        sortBy?: Array<string>,
    ): CancelablePromise<PaginatedSmsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/sms',
            query: {
                'page': page,
                'limit': limit,
                'search': search,
                'filter.phoneNumber': filterPhoneNumber,
                'filter.status': filterStatus,
                'sortBy': sortBy,
            },
        });
    }
    /**
     * @param requestBody
     * @returns SmsEntity
     * @throws ApiError
     */
    public static smsControllerSend(
        requestBody: SendSmsDto,
    ): CancelablePromise<SmsEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sms/send',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static smsControllerSendGroupSms(
        requestBody: SendGroupSmsDto,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sms/send/group',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns SmsEntity
     * @throws ApiError
     */
    public static smsControllerSendQuick(
        requestBody: SendSmsDto,
    ): CancelablePromise<SmsEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sms/sendQuick',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns SmsEntity
     * @throws ApiError
     */
    public static smsControllerSaveDraft(
        requestBody: SaveDraftDto,
    ): CancelablePromise<SmsEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sms/save-draft-sms',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static smsControllerSaveGroupDrafts(
        requestBody: SaveGroupDrafts,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sms/save-group-drafts',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns SmsEntity
     * @throws ApiError
     */
    public static smsControllerSendDraft(
        requestBody: SendDraftDto,
    ): CancelablePromise<SmsEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sms/send-draft-sms',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static smsControllerSendGroupDrafts(
        requestBody: SendGroupDraftDto,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sms/send/group-drafts',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static smsControllerBulkDelete(
        requestBody: BulkDeleteDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/sms/bulk',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns SmsEntity
     * @throws ApiError
     */
    public static smsControllerCancelScheduledSms(
        id: string,
    ): CancelablePromise<SmsEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/sms/{id}/cancel',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns SmsEntity
     * @throws ApiError
     */
    public static smsControllerSendScheduled(
        id: string,
    ): CancelablePromise<SmsEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/sms/{id}/sendschedule',
            path: {
                'id': id,
            },
        });
    }
}
