/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateCourseDto = {
    title: string;
    price: number;
    slug?: string;
    category?: CreateCourseDto.category;
    difficulty?: CreateCourseDto.difficulty;
    time?: string;
    mockStudentsCount?: number;
    priceType?: CreateCourseDto.priceType;
    thumbnailFileId?: string;
};
export namespace CreateCourseDto {
    export enum category {
        FRONTEND = 'frontend',
        BACKEND = 'backend',
        AI = 'ai',
        BASE = 'base',
        MOBILE = 'mobile',
        DEVOPS = 'devops',
    }
    export enum difficulty {
        BEGINNER = 'beginner',
        INTERMEDIATE = 'intermediate',
        ADVANCED = 'advanced',
    }
    export enum priceType {
        FREE = 'free',
        CASH = 'cash',
    }
}

