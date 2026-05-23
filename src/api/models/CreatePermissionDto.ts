/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreatePermissionDto = {
    accessLevel: CreatePermissionDto.accessLevel;
    categoryId: string;
    title: string;
    translatedTitle: string;
};
export namespace CreatePermissionDto {
    export enum accessLevel {
        CREATE = 'create',
        READ = 'read',
        UPDATE = 'update',
        DELETE = 'delete',
        RECOVER = 'recover',
    }
}

