import { injectable } from 'inversify';
import events from 'events';

@injectable()
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
