/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_HashMap_string_object_ } from '../models/BaseResponse_HashMap_string_object_';
import type { BaseResponse_object_ } from '../models/BaseResponse_object_';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TestControllerService {

    /**
     * listAccount
     * @param token token
     * @returns BaseResponse_object_ OK
     * @throws ApiError
     */
    public static listAccountUsingGet(
token?: string,
): CancelablePromise<BaseResponse_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/test/auth/list',
            headers: {
                'token': token,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * userLogin
     * @returns BaseResponse_HashMap_string_object_ OK
     * @throws ApiError
     */
    public static userLoginUsingGet(): CancelablePromise<BaseResponse_HashMap_string_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/test/login',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listAccountNoAuth
     * @returns BaseResponse_object_ OK
     * @throws ApiError
     */
    public static listAccountNoAuthUsingGet(): CancelablePromise<BaseResponse_object_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/test/noAuth/list',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * hello
     * @returns string OK
     * @throws ApiError
     */
    public static helloUsingGet(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/test/test',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
