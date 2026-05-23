/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateSurveyAdminDto = {
    status?: UpdateSurveyAdminDto.status;
    adminNote?: string;
};
export namespace UpdateSurveyAdminDto {
    export enum status {
        WAITING = 'waiting',
        REVIEWED = 'reviewed',
        RESOLVED = 'resolved',
    }
}

