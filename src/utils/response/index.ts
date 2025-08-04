/**
 * Exports all the response methods
 */

export {
    authResponse,
    allFieldsResponse,
    serverDownResponse,
    duplicateResponse
} from "./custom";

export {default as successResponse} from "./success";
export {default as generateMessage} from "./message";
export {default as kernel} from "./kernel";
export {default as failureResponse} from "./failure";

export default {};
