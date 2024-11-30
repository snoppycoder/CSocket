import { Injectable, OnModuleDestroy} from '@nestjs/common';
import * as WebSocket from 'ws' 


@Injectable()
export class ServerService implements OnModuleDestroy {
    private socket: WebSocket;
    private server: WebSocket.Server;
    private sockets: WebSocket[] = [];
    constructor() {
       this.server = new WebSocket.Server({port:4040})
       this.looksFor();
    }
    looksFor():void {
        this.server.on('connection', (socket) => {
            console.log('Client connected')
            this.sockets.push(socket);
            this.MessageHandler(socket);
        })

    }
    MessageHandler(socket: WebSocket) : void { 
         socket.on('message', (message) => {
            this.broadcast(message.toString());
            console.log('Received message: ', message.toString());
         })


    }broadcast(message: string): void {
        this.sockets.forEach(socket => {
              socket.send(`${message}`);
    
        });
    }


    onModuleDestroy() {
       
           this.sockets.forEach(socket => socket.close())
           console.log('Disconnected from the server')
        
    }
    
}
