export interface IResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
}