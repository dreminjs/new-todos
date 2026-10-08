import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import * as mediasoup from "mediasoup";
import { Worker } from "mediasoup/types";
import { MEDIA_CODECS } from "./calls.constants.js";

@Injectable()
export class MediasoupService implements OnModuleInit {
  private readonly logger = new Logger(MediasoupService.name);
  private worker: Worker;

  async onModuleInit() {
    this.worker = await mediasoup.createWorker({
      rtcMinPort: 40000,
      rtcMaxPort: 49999,
    });

    this.worker.on("died", () => {
      this.logger.error("mediasoup Worker died — restarting process");
      process.exit(1);
    });

    this.logger.log("mediasoup Worker created");
  }

  getWorker(): Worker {
    return this.worker;
  }

  get mediaCodecs() {
    return MEDIA_CODECS;
  }
}
