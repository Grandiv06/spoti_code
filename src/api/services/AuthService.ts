/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmailVerificationDto } from '../models/EmailVerificationDto';
import type { ForgetPassDto } from '../models/ForgetPassDto';
import type { LoginDto } from '../models/LoginDto';
import type { LoginResponse } from '../models/LoginResponse';
import type { OtpSentResponse } from '../models/OtpSentResponse';
import type { PhoneVerificationDto } from '../models/PhoneVerificationDto';
import type { RegisterByEmailDto } from '../models/RegisterByEmailDto';
import type { RegisterByPhoneDto } from '../models/RegisterByPhoneDto';
import type { sendVerificationCodeDto } from '../models/sendVerificationCodeDto';
import type { SetNewPassDto } from '../models/SetNewPassDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * @param requestBody
     * @returns LoginResponse
     * @throws ApiError
     */
    public static authControllerLogin(
        requestBody: LoginDto,
    ): CancelablePromise<LoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns string
     * @throws ApiError
     */
    public static authControllerRegisterByEmail(
        requestBody: RegisterByEmailDto,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/register-by-email',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns OtpSentResponse
     * @throws ApiError
     */
    public static authControllerRegisterByPhone(
        requestBody: RegisterByPhoneDto,
    ): CancelablePromise<OtpSentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/register-by-phone',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns LoginResponse
     * @throws ApiError
     */
    public static authControllerVerifyEmail(
        requestBody: EmailVerificationDto,
    ): CancelablePromise<LoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/verify-email',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns LoginResponse
     * @throws ApiError
     */
    public static authControllerVerifyPhone(
        requestBody: PhoneVerificationDto,
    ): CancelablePromise<LoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/verify-phone',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns OtpSentResponse
     * @throws ApiError
     */
    public static authControllerSendVerificationCode(
        requestBody: sendVerificationCodeDto,
    ): CancelablePromise<OtpSentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/resend-verification-code',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns LoginResponse
     * @throws ApiError
     */
    public static authControllerRefreshToken(): CancelablePromise<LoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/refresh-token',
        });
    }
    /**
     * @param requestBody
     * @returns OtpSentResponse
     * @throws ApiError
     */
    public static authControllerForgetPass(
        requestBody: ForgetPassDto,
    ): CancelablePromise<OtpSentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/forget-pass',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns string
     * @throws ApiError
     */
    public static authControllerSetNewPass(
        requestBody: SetNewPassDto,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/auth/set-new-pass',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
