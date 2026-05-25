/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginationLinksDto } from './PaginationLinksDto';
import type { PaginationMetaDto } from './PaginationMetaDto';
import type { SmsEntity } from './SmsEntity';
export type PaginatedSmsResponse = {
    meta: PaginationMetaDto;
    links: PaginationLinksDto;
    data: Array<SmsEntity>;
};

