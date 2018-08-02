export interface Expect {
    required?: boolean;
    enum?: any[];
    default?: any;
    properties?: any;
    [name: string]: any;
}
declare const Checker: {
    required: (input: any, expect?: Expect) => {
        is: boolean;
        val?: undefined;
    } | {
        is: boolean;
        val: any;
    };
    object: (input: any, expect?: Expect) => {
        is: boolean;
        val: any;
    } | {
        is: boolean;
    };
    string: (val: any, expect: Expect) => {
        is: boolean;
        val?: undefined;
    } | {
        is: boolean;
        val: string;
    };
    num: (val: any, expect: Expect) => {
        is: boolean;
        val?: undefined;
    } | {
        is: boolean;
        val: number;
    };
    bool: (val: any, expect: Expect) => any;
    default: (input: any, expect?: Expect) => {
        is: boolean;
        val: any;
    };
    array: (input: any, expect: Expect) => {
        is: boolean;
        val: any;
    } | {
        is: boolean;
        val?: undefined;
    } | {
        is: any;
        val: any[];
    };
    check: (input: any, expect: Expect) => any;
};
export default Checker;
