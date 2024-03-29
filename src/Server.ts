import express from "express";
import cors from "cors";
import * as http from "http";
import { Socket } from "dgram";

export class Server {
  public static readonly PORT: number = 8080;
  private app: express.Application;
  private server: http.Server;
  private io: SocketIO.Server;
  private port: string | number;

  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
  }

  private createApp(): void {
    this.app = express();
    this.app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    //res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
this.app.use(cors())
  }

  private createServer(): void {
    this.server = http.createServer(this.app);
  }

  private config(): void {
    this.port = process.env.PORT || Server.PORT;
  }

  private sockets(): void {
    this.io = require("socket.io").listen(this.server,{pingTimeout: 0, pingInterval: 500, origins: '*:*'});
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });

    this.io.on("connect", (socket: Socket) => {
      console.log("Connected client on port %s.", this.port);
      /*  socket.on("message", (m: Message) => {
        console.log("[server](message): %s", JSON.stringify(m));
        this.io.emit("message", m);
      }); */

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
      socket.on("speed", (message: any) => {
        this.io.emit("test", message.response);
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}
