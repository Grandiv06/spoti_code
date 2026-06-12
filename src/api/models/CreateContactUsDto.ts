/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateContactUsDto = {
    fullName: string;
    email?: string;
    phoneNumber?: string;
    subject: CreateContactUsDto.subject;
    content: string;
};
export namespace CreateContactUsDto {
    export enum subject {
        COURSES = 'courses',
        TECHNICAL_ISSUE = 'technical_issue',
        GENERAL = 'general',
        ASSOCIATION = 'association',
        OTHER = 'other',
    }
}

