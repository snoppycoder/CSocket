import { Injectable, OnModuleDestroy} from '@nestjs/common';
import * as WebSocket from 'ws' 



@Injectable()
export class ServerService implements OnModuleDestroy {
    private server: WebSocket.Server;
    private sockets: Map<WebSocket, string> = new Map();

    constructor() {
       this.server = new WebSocket.Server({port:4040})
       this.looksFor();
    }
    looksFor():void {
        this.server.on('connection', (socket) => {
            console.log('Client connected')
            this.MessageHandler(socket);
        })

    }
    MessageHandler(socket: WebSocket) : void { 
         socket.on('message', (message) => {
            try {
                  let parsedMessage = JSON.parse(message.toString())
                  if(parsedMessage.type === 'name' && socket.readyState === WebSocket.OPEN) {
                    const name = parsedMessage.name;
                    this.sockets.set(socket, name);
                    this.broadcast(`New user connected: ${name}`);
                  }
                  else if(parsedMessage.type === 'message') {
                    this.broadcast(parsedMessage.message)
                  }

                
            }catch (err) {
                console.error(err);
                return;
            }
            
         })


    }broadcast(message: string): void {
        this.sockets.forEach((name, socket) => {
            socket.send(`${message}`);
    
        });
    }


    onModuleDestroy() {
         this.sockets.forEach((name, socket) => {
            console.log(`Closing connection for ${name}`);
            socket.close(); // Close the WebSocket connection
        });
        console.log('Disconnected from the server');
}
}