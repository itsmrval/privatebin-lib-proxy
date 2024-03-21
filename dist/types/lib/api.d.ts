import { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
export declare class Api {
    axios: AxiosInstance;
    constructor(config: AxiosRequestConfig);
    get<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
    post<T, B, R = AxiosResponse<T>>(url: string, data?: B, config?: AxiosRequestConfig): Promise<R>;
    success<T>(response: AxiosResponse<T>): T;
}
//# sourceMappingURL=api.d.ts.map