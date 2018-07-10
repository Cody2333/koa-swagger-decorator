declare class SwaggerObject {
    data: any;
    constructor();
    add(target: any, name: any, content: any): void;
    addMulti(target: any, content: any, filters?: string[]): void;
}
declare const swaggerObject: SwaggerObject;
export default swaggerObject;
