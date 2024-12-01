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
                const data = JSON.parse(message.toString());
                if(data.type === 'name') {
                    this.sockets.set(socket, data.name);
                    this.broadcast(`${data.name} joined the chat`)

                }
                if(data.type === 'message') {
                    this.broadcast(`${this.sockets.get(socket)}: ${data.message}`)
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