import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MsgDTO } from './dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit() {
    console.log('WebSocket server initialized');
  }

  private logger: Logger = new Logger('ChatGateway');
  private connectedClients = new Set<string>();

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const chatRoomId = client.handshake.query?.chatRoomId?.toString();
      
        if (!chatRoomId) {
          throw new Error('Missing chatRoomId parameter');
        }
       
        if (this.connectedClients.has(client.id)) {
          throw new Error('Client already connected');
        }
  
      
        if (this.server.sockets.adapter.rooms[chatRoomId]?.length >= 2) {
          throw new Error('Chat room is full');
        }
  
        this.logger.log(`Client ${client.id} connected to chat room ${chatRoomId}`);
        client.join(chatRoomId);
  
        this.connectedClients.add(client.id);
      } catch (error) {
        this.logger.error(`Error connecting client: ${error.message}`);
        client.disconnect();
      }
    }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('sendMsg')
  async handleSendMsg(client: Socket, payload: any) {
    const patientId = client.handshake.query.patientId[0];
    const chatRoomId = client.handshake.query.chatRoomId.toString();

    const message = await this.chatService.createMessage(patientId, chatRoomId, payload.message);
    this.server.emit('newMessage', message);
  }

  @SubscribeMessage('joinChatRoom')
  async handleJoinChatRoom(client: Socket, chatRoomId: string) {
    client.join(chatRoomId);
    const messages = await this.chatService.getChatRoomById(chatRoomId);
    client.emit('messageHistory', messages);
  }
  @SubscribeMessage('leaveChatRoom')
  handleLeaveChatRoom(client: Socket, chatRoomId: string) {
    client.leave(chatRoomId);
  }
}