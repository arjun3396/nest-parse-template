import events from 'events';
import { Injectable } from '@nestjs/common';

@Injectable()
class EventEmitterUtil {
    private emitter;

    constructor() {
      this.emitter = new events.EventEmitter();
    }

    listenFor(eventName: string, callback: {(): Promise<{[key: string]: any}>}): any {
      this.emitter.on(eventName, callback);
    }

    emitEvent(eventName: string): any {
      this.emitter.emit(eventName);
    }
}

export { EventEmitterUtil };
