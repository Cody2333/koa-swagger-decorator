export interface Expect {
    required?: boolean;
    enum?: any[];
    default?: any;
    properties?: any;
    [name: string]: any;
}
declare const Checker: any;
export default Checker;
