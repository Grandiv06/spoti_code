/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateCourseDto = {
    title?: string;
    description?: string;
    thumbnailFileId?: string;
    introVideoFileId?: string;
    price?: number;
    priceType?: UpdateCourseDto.priceType;
    time?: string;
    mockStudentsCount?: number;
    difficulty?: UpdateCourseDto.difficulty;
    category?: UpdateCourseDto.category;
    about?: string;
    specialWord?: string | null;
    teacherId?: string;
    slug?: string;
};
export namespace UpdateCourseDto {
    export enum priceType {
        FREE = 'free',
        CASH = 'cash',
    }
    export enum difficulty {
        BEGINNER = 'beginner',
        INTERMEDIATE = 'intermediate',
        ADVANCED = 'advanced',
    }
    export enum category {
        FRONTEND = 'frontend',
        BACKEND = 'backend',
        AI = 'ai',
        BASE = 'base',
        MOBILE = 'mobile',
        DEVOPS = 'devops',
    }
}

