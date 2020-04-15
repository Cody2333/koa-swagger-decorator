export interface Data {
    [key: string]: {
        [name: string]: any;
    };
}
export declare type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options' | 'trace';
export interface QueryParams {
    [param: string]: {
        type: 'number' | 'string';
        required: boolean;
        default?: number | string;
        description?: string;
    };
}
