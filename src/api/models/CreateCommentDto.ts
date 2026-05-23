/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateCommentDto = {
    content: string;
    commentableType: CreateCommentDto.commentableType;
    commentableId: string;
    parentId?: string;
    rating?: number;
};
export namespace CreateCommentDto {
    export enum commentableType {
        COURSE = 'course',
    }
}

