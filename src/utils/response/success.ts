/**
 * Moulds the success response
 */

import {includes} from "lodash";
import {Response} from "node-fetch";

const successResponse = async (res: Response) => {
    console.log("success handleer");
    // if (apiresponse.statusText === "No Content") {
    //   return {
    //     success: true,
    //     data: { message: "Success!" }
    //   };
    // }
    try {
        const contentType = res.headers.get("content-type");
        const location = res.headers.get('location');

        let response;
        if (res.status === 201) {
            return {
                success: true,
                data: {location: location}
            };
        }
        if (res.status === 200 && res.redirected) {
            let params = new URLSearchParams(res.url);
            var code = params.get("code");
            console.log(code);
            return {
                success: true,
                data: {code: code}
            };
        }
        if (includes(contentType, "text/plain")) {
            response = await res.text();
        } else {
            response = await res.json();
        }
        return {
            success: true,
            data: response.data ? response.data : response
        };
    } catch (error) {
        if (error.type === "invalid-json") {
            return {success: true, data: {message: "Success!"}};
        }
        return {success: true, data: {message: error.message}};
    }
};

export default successResponse;
