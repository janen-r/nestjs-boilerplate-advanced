import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

import * as dotenv from 'dotenv';
dotenv.config();

@WebSocketGateway({
    cors: {
        origin: process.env.CORS_ORIGIN
    }
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;

    private logger = new Logger(SocketGateway.name);
    constructor(private authService: AuthService, private jwtService: JwtService) {}

    afterInit(server: Server) {
        this.logger.log('Init');
    }

    /**
     * This is a default function to be triggered on any socket connection. Validate, incase of any invalidate token disconnect the client.
     * Steps to connect user:
     * 1. Validate header authorization token
     * 2. Validate received authorization token with jwt
     * 3. Validate with user's current session authkey
     */
    async handleConnection(client: Socket, ...args: any[]) {

        // 1.Validate header authorization token
        // this.logger.debug(`Received headers: ${JSON.stringify(client.handshake.headers)}`);
        if(!client.handshake.headers?.authorization) {
            this.logger.log("Auth header token is missing. Connection closed");
            return client.disconnect(true);
        }

        // 2.Validate received authorization token with jwt
        const isValid = this.jwtService.verify(client.handshake.headers.authorization);
        if(!isValid) {
            this.logger.log("Request with Invalid auth token. Connection closed");
            return client.disconnect(true);
        }
        const { payload } = this.jwtService.decode(client.handshake.headers.authorization, { complete: true }) as Record<string, any>;
        if(!payload || !payload._id) {
            this.logger.log("Request with Invalid auth token. Connection closed");
            return client.disconnect(true);
        };
        
        // 3.Validate with user's current session authkey
        const userData = await this.authService.checkuserExist(payload.payload._id);
        if(!userData || userData.authKey != payload.authKey) {
            this.logger.log("Request with Invalid auth session token. Connection closed");
            return client.disconnect(true);
        }

        // Connect the user after successful validation
        // Update the required user data in current socket connection
        this.logger.log(`connected for user: ${payload._id}`);
        client.data = {
            ...client.data, 
            userId: payload._id,
            version: client.handshake.headers.version
        };
    }

    @SubscribeMessage('joinRoom')
    onJoinRoom(client: Socket, payload: { roomId: string }): void {
        // NOTE: validate if the room has restrictions for specific users
        this.logger.log(`Joining room: ${client.data.userId} - ${payload.roomId}`)
        client.join(payload.roomId);
    }

    @SubscribeMessage('leaveRoom')
    async manualLeaveRoom(client: Socket, payload: { roomId: string }) {
        this.logger.log(`Leaving room: ${client.data.userId} - ${payload.roomId}`);
        client.leave(payload.roomId);
    }

    async handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.data.userId}`);
    }

    @SubscribeMessage('closeConnection')
    async manualDisconnect(client: Socket) {
        this.logger.log(`Client disconnected manually: ${client.data.userId}`);
        client.disconnect();
    }

    /**
     * To trigger an socket event from other module, use this steps
     * Ex: 
     * import { EventEmitter2 } from "@nestjs/event-emitter"; 
     * constructor(private eventEmitter: EventEmitter2){}
     * this.eventEmitter.emit('socket.customEvent', "customEventName", [roomId1, roomId2], data);
     */
    @OnEvent('socket.customEvent')
    async customEvent(eventName: string, roomIds: any[], data: {} = {}) {
        this.logger.log(`Custom event: ${eventName} - ${roomIds.join(',')}`);
        this.server.to(roomIds).emit(eventName, data);
    }
}