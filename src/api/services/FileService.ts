/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { File } from '../models/File';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FileService {
    /**
     * @param formData
     * @returns File
     * @throws ApiError
     */
    public static fileControllerUploadFile(
        formData: {
            file: Blob;
            relatedEntity: string;
            relatedId: string;
            relationType?: string;
            title?: string;
        },
    ): CancelablePromise<File> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/files',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static fileControllerDownloadFile(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/files/{id}',
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
    public static fileControllerDeleteFile(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/files/{id}',
            path: {
                'id': id,
            },
        });
    }
}
