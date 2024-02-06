"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const event_emitter_1 = require("@nestjs/event-emitter");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
const dotenv = require("dotenv");
dotenv.config();
let SocketGateway = SocketGateway_1 = class SocketGateway {
    constructor(authService, jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(SocketGateway_1.name);
    }
    afterInit(server) {
        this.logger.log('Init');
    }
    async handleConnection(client, ...args) {
        var _a;
        if (!((_a = client.handshake.headers) === null || _a === void 0 ? void 0 : _a.authorization)) {
            this.logger.log("Auth header token is missing. Connection closed");
            return client.disconnect(true);
        }
        const isValid = this.jwtService.verify(client.handshake.headers.authorization);
        if (!isValid) {
            this.logger.log("Request with Invalid auth token. Connection closed");
            return client.disconnect(true);
        }
        const { payload } = this.jwtService.decode(client.handshake.headers.authorization, { complete: true });
        if (!payload || !payload._id) {
            this.logger.log("Request with Invalid auth token. Connection closed");
            return client.disconnect(true);
        }
        ;
        const userData = await this.authService.checkuserExist(payload.payload._id);
        if (!userData || userData.authKey != payload.authKey) {
            this.logger.log("Request with Invalid auth session token. Connection closed");
            return client.disconnect(true);
        }
        this.logger.log(`connected for user: ${payload._id}`);
        client.data = Object.assign(Object.assign({}, client.data), { userId: payload._id, version: client.handshake.headers.version });
    }
    onJoinRoom(client, payload) {
        this.logger.log(`Joining room: ${client.data.userId} - ${payload.roomId}`);
        client.join(payload.roomId);
    }
    async manualLeaveRoom(client, payload) {
        this.logger.log(`Leaving room: ${client.data.userId} - ${payload.roomId}`);
        client.leave(payload.roomId);
    }
    async handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.data.userId}`);
    }
    async manualDisconnect(client) {
        this.logger.log(`Client disconnected manually: ${client.data.userId}`);
        client.disconnect();
    }
    async customEvent(eventName, roomIds, data = {}) {
        this.logger.log(`Custom event: ${eventName} - ${roomIds.join(',')}`);
        this.server.to(roomIds).emit(eventName, data);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "onJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "manualLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('closeConnection'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "manualDisconnect", null);
__decorate([
    (0, event_emitter_1.OnEvent)('socket.customEvent'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "customEvent", null);
SocketGateway = SocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGIN
        }
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService, jwt_1.JwtService])
], SocketGateway);
exports.SocketGateway = SocketGateway;
//# sourceMappingURL=socket.gateway.js.map