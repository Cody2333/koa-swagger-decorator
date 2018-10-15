interface Data {
    [key: string]: {
        [name: string]: any;
    };
}
declare class SwaggerObject {
    data: Data;
    constructor();
    add(target: any, name: string, content: any): void;
    addMulti(target: any, content: any, filters?: string[]): void;
}
declare const swaggerObject: SwaggerObject;
export default swaggerObject;
