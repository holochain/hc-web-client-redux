declare type hcWebClientConnect = {
    call: (callStr: string) => (params: any) => Promise<string>;
    close: () => Promise<any>;
    ws: any;
};
export declare const connect: (url: string) => Promise<hcWebClientConnect>;
export {};
