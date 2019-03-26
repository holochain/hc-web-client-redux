declare type CallRaw = (...segments: Array<string>) => (params: any) => Promise<any>;
declare type Call = (...segments: Array<string>) => (params: any) => Promise<any>;
declare type Close = () => Promise<any>;
export declare const connect: (paramUrl?: string) => Promise<{
    call: Call;
    callRaw: CallRaw;
    close: Close;
    ws: any;
}>;
export {};
