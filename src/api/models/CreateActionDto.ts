/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateActionDto = {
    type: CreateActionDto.type;
    targetUserId?: string;
    targetType?: string;
    targetId?: string;
};
export namespace CreateActionDto {
    export enum type {
        FOLLOW = 'follow',
        UNFOLLOW = 'unfollow',
        LIKE = 'like',
        DISSLIKE = 'disslike',
        BOOKMARK = 'bookmark',
    }
}

