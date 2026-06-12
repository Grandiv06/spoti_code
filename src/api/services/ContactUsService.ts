/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContactUsEntity } from '../models/ContactUsEntity';
import type { CreateContactUsDto } from '../models/CreateContactUsDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContactUsService {
    /**
     * @param requestBody
     * @returns ContactUsEntity
     * @throws ApiError
     */
    public static contactUsControllerCreate(
        requestBody: CreateContactUsDto,
    ): CancelablePromise<ContactUsEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contact-us',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ContactUsEntity
     * @throws ApiError
     */
    public static contactUsControllerFindAll(): CancelablePromise<Array<ContactUsEntity>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contact-us/admin',
        });
    }
}
