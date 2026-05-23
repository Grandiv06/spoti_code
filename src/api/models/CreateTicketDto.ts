/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateTicketDto = {
    subject: string;
    description: string;
    category: CreateTicketDto.category;
    urgency?: CreateTicketDto.urgency;
    tags?: Array<string>;
    attachmentFileIds?: Array<string>;
    firstMessage?: string;
};
export namespace CreateTicketDto {
    export enum category {
        TECHNICAL = 'technical',
        BILLING = 'billing',
        ACCOUNT = 'account',
        FEATURE_REQUEST = 'featureRequest',
        BUG_REPORT = 'bugReport',
        OTHER = 'other',
    }
    export enum urgency {
        HIGH = 'high',
        MEDIUM = 'medium',
        LOW = 'low',
    }
}

