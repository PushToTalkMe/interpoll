import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Poll } from '../entities/poll.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PollsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Клиент подключился: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Клиент отключился: ${client.id}`);
  }

  @SubscribeMessage('pollUpdated')
  handlePollUpdated(data: Poll) {
    console.log(`Обновление опросника`);
    this.server.emit('updatePoll', data);
  }

  @SubscribeMessage('pollUpdated')
  handlePollDeleted(id: number) {
    console.log(`Удаление опросника`);
    this.server.emit('deletePoll', id);
  }

  @SubscribeMessage('pollCreated')
  handlePollCreated(data: Poll) {
    console.log(`Создание опросника`);
    this.server.emit('createPoll', data);
  }
}
