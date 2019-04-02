declare type Call = (...segments: Array<string>) => (params: any) => Promise<any>;
declare type CallZome = (instanceId: string, zome: string, func: string) => (params: any) => Promise<any>;
declare type Close = () => Promise<any>;
export declare const connect: (paramUrl?: string) => Promise<{
    call: Call;
    callZome: CallZome;
    close: Close;
    ws: any;
}>;
export {};
