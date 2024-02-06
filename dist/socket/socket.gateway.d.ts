import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
export declare class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private authService;
    private jwtService;
    server: Server;
    private logger;
    constructor(authService: AuthService, jwtService: JwtService);
    afterInit(server: Server): void;
    handleConnection(client: Socket, ...args: any[]): Promise<Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>>;
    onJoinRoom(client: Socket, payload: {
        roomId: string;
    }): void;
    manualLeaveRoom(client: Socket, payload: {
        roomId: string;
    }): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    manualDisconnect(client: Socket): Promise<void>;
    customEvent(eventName: string, roomIds: any[], data?: {}): Promise<void>;
}
