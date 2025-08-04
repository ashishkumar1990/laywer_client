import React from "react";
import _ from "lodash";
import {server} from "./rest";
import { Backdrop, CircularProgress } from '@mui/material';
import generateMessage from "./response/message";
import { getGlobalToast } from '../context/ToastContext';

class ApiInterceptor extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            loading: {},
            errorCode: 0
        };
    }


    componentDidMount() {
        // Bind axios interceptor
        this.axiosInterceptor(server);
    }

    axiosInterceptor = (rest: any) => {
        rest.http.interceptors.request.use(
            (config: any) => {
                this.showLoader(config.url);
                return config;
            },
            (error: any) => {
                this.hideLoader(error.config.url);
                Promise.reject(error)
            });
        rest.http.interceptors.response.use((response: any) => {
            this.hideLoader(response.config.url);
            // Do something with response data
            return response;
        }, (error: any) => {
            this.logError(error);
            this.hideLoader(error.config.url);
            // Do something with response error
            return Promise.reject(error);
        });
    };

    showLoader = (url: string) => {
        if (this.state.loading[url]) {
            return;
        }
        this.setState({loading: {...this.state.loading, [url]: true}})
    };

    hideLoader = (url: string) => {
        if (!this.state.loading[url]) {
            return;
        }
        const loading = {...this.state.loading};
        delete loading[url];
        this.setState({loading})
    };

    logError = async (error: any) => {
        const toast = getGlobalToast();
        let message = _.get(error, "response.data.message", "");
        if (message === "") {
            const code = _.get(error, "response.status", "");
            this.setState({
                errorCode: code
            });
            message = await generateMessage(code);
        }
        toast?.showToast(message, 'error');
    };

    render() {
        return (
            <div>
                {!_.isEmpty(this.state.loading) ?
                    <div style={{
                        position: "absolute", top: 0, left: 200, right: 0, bottom: 0,
                        zIndex: 20000,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <div className="loader" style={{}}>
                            <Backdrop open={!_.isEmpty(this.state.loading)} sx={{ zIndex: (theme) => theme.zIndex.drawer + 999 }}>
                                <CircularProgress color="inherit" />
                            </Backdrop>
                        </div>
                    </div> : null}</div>
        )
    }
}

export default ApiInterceptor;
