/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SortByDto } from './SortByDto';
export type PaginationMetaDto = {
    itemsPerPage: number;
    totalItems?: number;
    currentPage?: number;
    totalPages?: number;
    sortBy?: Array<SortByDto>;
    search?: string;
    filter?: Record<string, any>;
};

