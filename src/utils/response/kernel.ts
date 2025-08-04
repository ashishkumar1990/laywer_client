/**
 * Kernel to differentiate success / error / exception
 * in responses.
 */

import {failureResponse, successResponse} from "./index";

export const kernel = async (value: any) => {
    if (!value.ok) {
        return await failureResponse(value);
    }
    return await successResponse(value);
};

export default kernel;
