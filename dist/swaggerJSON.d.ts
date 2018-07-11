/**
 * build swagger json from apiObjects
 */
declare const swaggerJSON: (options: {
    [name: string]: any;
}, apiObjects: any) => any;
export default swaggerJSON;
export { swaggerJSON };
