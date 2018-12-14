"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rpc_websockets_1 = require("rpc-websockets");
exports.connect = (url) => new Promise((fulfill, reject) => {
    const ws = new rpc_websockets_1.Client(url);
    ws.on('open', () => {
        const call = (...segments) => (params) => {
            const method = segments.length === 1 ? segments[0] : segments.join('/');
            return ws.call(method, params);
        };
        const close = () => ws.close();
        fulfill({ call, close, ws });
    });
});
// const win = (window as any)
// win.holoclient = win.holoclient || {connect}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBcUM7QUFTeEIsUUFBQSxPQUFPLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFxQixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtJQUMxRixNQUFNLEVBQUUsR0FBRyxJQUFJLHVCQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDMUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO1FBQ2pCLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDdkMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUN2RSxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQ2hDLENBQUMsQ0FBQTtRQUNELE1BQU0sS0FBSyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUM5QixPQUFPLENBQUMsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUE7SUFDNUIsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLDhCQUE4QjtBQUM5QiwrQ0FBK0MifQ==