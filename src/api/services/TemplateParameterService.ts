/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TemplateParameterEntity } from '../models/TemplateParameterEntity';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TemplateParameterService {
    /**
     * @returns TemplateParameterEntity
     * @throws ApiError
     */
    public static templateParameterControllerFindAll(): CancelablePromise<Array<TemplateParameterEntity>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/template-parameter',
        });
    }
}
