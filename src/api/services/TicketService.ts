/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssignTicketDto } from '../models/AssignTicketDto';
import type { CreateTicketDto } from '../models/CreateTicketDto';
import type { CreateTicketMessageDto } from '../models/CreateTicketMessageDto';
import type { TicketEntity } from '../models/TicketEntity';
import type { TicketMessageEntity } from '../models/TicketMessageEntity';
import type { UpdateTicketAdminNoteDto } from '../models/UpdateTicketAdminNoteDto';
import type { UpdateTicketStatusDto } from '../models/UpdateTicketStatusDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TicketService {
    /**
     * @param requestBody
     * @returns TicketEntity
     * @throws ApiError
     */
    public static ticketControllerCreateMyTicket(
        requestBody: CreateTicketDto,
    ): CancelablePromise<TicketEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tickets/my',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param status
     * @param category
     * @param urgency
     * @param assignedToId
     * @param search
     * @param myAssignedOnly
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static ticketControllerFindMyTickets(
        status?: 'open' | 'underReview' | 'answered' | 'closed',
        category?: 'technical' | 'billing' | 'account' | 'featureRequest' | 'bugReport' | 'other',
        urgency?: 'high' | 'medium' | 'low',
        assignedToId?: string,
        search?: string,
        myAssignedOnly?: boolean,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tickets/my',
            query: {
                'status': status,
                'category': category,
                'urgency': urgency,
                'assignedToId': assignedToId,
                'search': search,
                'myAssignedOnly': myAssignedOnly,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param id
     * @returns TicketEntity
     * @throws ApiError
     */
    public static ticketControllerFindOneMyTicket(
        id: string,
    ): CancelablePromise<TicketEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tickets/my/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns TicketMessageEntity
     * @throws ApiError
     */
    public static ticketControllerAddMyMessage(
        id: string,
        requestBody: CreateTicketMessageDto,
    ): CancelablePromise<TicketMessageEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tickets/my/{id}/messages',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param status
     * @param category
     * @param urgency
     * @param assignedToId
     * @param search
     * @param myAssignedOnly
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static ticketControllerFindAllAdmin(
        status?: 'open' | 'underReview' | 'answered' | 'closed',
        category?: 'technical' | 'billing' | 'account' | 'featureRequest' | 'bugReport' | 'other',
        urgency?: 'high' | 'medium' | 'low',
        assignedToId?: string,
        search?: string,
        myAssignedOnly?: boolean,
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tickets/admin',
            query: {
                'status': status,
                'category': category,
                'urgency': urgency,
                'assignedToId': assignedToId,
                'search': search,
                'myAssignedOnly': myAssignedOnly,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param id
     * @returns TicketEntity
     * @throws ApiError
     */
    public static ticketControllerFindOneAdmin(
        id: string,
    ): CancelablePromise<TicketEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tickets/admin/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns TicketMessageEntity
     * @throws ApiError
     */
    public static ticketControllerAddAdminMessage(
        id: string,
        requestBody: CreateTicketMessageDto,
    ): CancelablePromise<TicketMessageEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tickets/admin/{id}/messages',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns TicketMessageEntity
     * @throws ApiError
     */
    public static ticketControllerAddInternalNoteMessage(
        id: string,
        requestBody: CreateTicketMessageDto,
    ): CancelablePromise<TicketMessageEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tickets/admin/{id}/internal-notes',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns TicketEntity
     * @throws ApiError
     */
    public static ticketControllerUpdateStatus(
        id: string,
        requestBody: UpdateTicketStatusDto,
    ): CancelablePromise<TicketEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/tickets/admin/{id}/status',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns TicketEntity
     * @throws ApiError
     */
    public static ticketControllerAssign(
        id: string,
        requestBody: AssignTicketDto,
    ): CancelablePromise<TicketEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/tickets/admin/{id}/assign',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns TicketEntity
     * @throws ApiError
     */
    public static ticketControllerUpdateAdminNote(
        id: string,
        requestBody: UpdateTicketAdminNoteDto,
    ): CancelablePromise<TicketEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/tickets/admin/{id}/note',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
