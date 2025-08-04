
import axios from 'axios';
import mustache from 'mustache';

function RestApi(base: any) {
    const http = axios.create({
        baseURL: base,
        timeout: 300000,
        withCredentials:true
    });

    async function post(uriTemplate: string, pathArgs: any, body: any, queryArgs?: any) {
        const uri = pathArgs ? mustache.render(uriTemplate, pathArgs) : uriTemplate;
        console.log("POST " + uri, queryArgs ? queryArgs : "");
        console.log(JSON.stringify(body));
        return http.post(uri, body, {params: queryArgs || {}})
            .then((response: any) => {
                if (response.status === 201) {
                    const location = response.headers.location;
                    if (location) {
                        const lastIndex = location.lastIndexOf("/");
                        if (lastIndex !== -1) {
                            const id = location.substring(lastIndex + 1);
                            return id;
                        }
                    }
                } else if (response.status === 200) {
                    return response.data;
                }
            }).catch((error: any) => {
                // console.error(error.response.data.message);
                throw error;
            });
    }

    async function put(uriTemplate: string, pathArgs: any, body: any, queryArgs?: any) {
        const uri = pathArgs ? mustache.render(uriTemplate, pathArgs) : uriTemplate;
        console.log("PUT " + uri, queryArgs ? queryArgs : "");
        console.log(JSON.stringify(body));
        return http.put(uri, body, {params: queryArgs || {}})
            .catch((error: any) => {
                console.error(JSON.stringify(error.response.data));
                throw error;
            });
    }

    async function get(uriTemplate: string, pathArgs?: any, queryArgs?: any) {
        const uri = pathArgs ? mustache.render(uriTemplate, pathArgs) : uriTemplate;
        console.log("GET " + uri, queryArgs ? queryArgs : "");
        return http.get(uri, {params: queryArgs || {}})
            .then((response: any) => {
                if (response.status === 200) {
                    return response.data;
                } else {
                    let error = {code: 'http.get.error', message: `Http GET [${uri}] failed with ${response.status}`};
                    throw error;
                }
            }).catch((error: any) => {
                console.error(JSON.stringify(error.response.data));
                throw error;
            });
    }

    async function del(uriTemplate: string, pathArgs: any, body?: any, queryArgs?: any) {
        const uri = pathArgs ? mustache.render(uriTemplate, pathArgs) : uriTemplate;
        console.log("DELETE " + uri, queryArgs ? queryArgs : "");
        if (body) {
            console.log(JSON.stringify(body))
        }
        return http.delete(uri, {data: body, params: queryArgs || {}})
            .then((response: any) => {
                if (response.status === 204) {
                    return 'deleted';
                }
            })
            .catch((error: any) => {
                console.error(JSON.stringify(error.response.data));
                throw error;
            });
    }

    return {
        get,
        post,
        del,
        put,
        http
    };
}

export const server = RestApi("/api");

