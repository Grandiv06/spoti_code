/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateTicketStatusDto = {
    status: UpdateTicketStatusDto.status;
};
export namespace UpdateTicketStatusDto {
    export enum status {
        OPEN = 'open',
        UNDER_REVIEW = 'underReview',
        ANSWERED = 'answered',
        CLOSED = 'closed',
    }
}

