/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginationLinksDto } from './PaginationLinksDto';
import type { PaginationMetaDto } from './PaginationMetaDto';
import type { User } from './User';
export type UserPaginatedResopnse = {
    meta: PaginationMetaDto;
    links: PaginationLinksDto;
    items: Array<User>;
};

