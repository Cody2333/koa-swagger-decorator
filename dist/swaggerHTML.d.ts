declare const swaggerHTML: (apiPath: string, options?: {
    [name: string]: any;
    swaggerVersion?: string;
}) => string;
export default swaggerHTML;
export { swaggerHTML };
