/**
 * Moulds the failure response
 */

import {get} from "lodash";
import generateMessage from "./message";

import {Response} from "node-fetch";

interface ApiError {
    code: number;
    success: boolean;
    data: { error: Error };
}

const failureResponse = async (res: Response) => {

    const headers = res.headers;
    console.log(headers);
    const location = res.url;
    console.log(location);
    let error: ApiError = {
        code: 0,
        data: {error: {name: "", message: ""}},
        success: false
    };

    console.log(res, "failure response");

    error.code = get(res, "status", 500);

    const response = await res.json();

    if (
        (error.code === 401 || error.code === 400 || error.code === 422) &&
        (response.hasOwnProperty("errorMessage") ||
            response.hasOwnProperty("message") ||
            response.hasOwnProperty("messages"))
    ) {

        console.log("Nooooooope");

        error.code = get(response, "errorCode", error.code);
        var code = get(
            response,
            "errorMessage",
            get(response, "messages[0].code", "")
        );
        if (code === "Customer.Sync.Errors") {
            error.data.error.message = get(
                response,
                "errorMessage",
                get(response, "messages[0].argsMap.messages", "Something went wrong!")
            );
        } else {
            error.data.error.message = get(
                response,
                "errorMessage",
                get(response, "messages[0].message", "Something went wrong!")
            );
        }

        return {
            success: false,
            data: error
        };
    }

    error.data.error.message = await generateMessage(error.code);
    return {
        success: false,
        data: error
    };
};

export default failureResponse;
