import { ILogger } from './types';

export abstract class Logging implements ILogger {
    private instance: string;
    constructor() {
        this.instance = this.constructor.name;
        this.debug('Logger initialized');
    }

    trace(message: unknown, ...additional: unknown[]): void {
        if(additional.length > 0) {
            console.log('[TRACE]', `[${this.instance}]`, message, additional);
        } else {
            console.log('[TRACE]', `[${this.instance}]`, message);
        }
    }

    debug(message: unknown, ...additional: unknown[]): void {
        if(additional.length > 0) {
            console.log('[DEBUG]', `[${this.instance}]`, message, additional);
        } else {
            console.log('[DEBUG]', `[${this.instance}]`, message);
        }
    }

    info(message: unknown, ...additional: unknown[]): void {
        if(additional.length > 0) {
            console.log('[INFO]', `[${this.instance}]`, message, additional);
        } else {
            console.log('[INFO]', `[${this.instance}]`, message);
        }
    }

    warn(message: unknown, ...additional: unknown[]): void {
        if(additional.length > 0) {
            console.warn('[WARN]', `[${this.instance}]`, message, additional);
        } else {
            console.warn('[WARN]', `[${this.instance}]`, message);
        }
    }

    fatal(message: unknown, ...additional: unknown[]): void {
        if(additional.length > 0) {
            console.error('[FATAL]', `[${this.instance}]`, message, additional);
        } else {
            console.error('[FATAL]', `[${this.instance}]`, message);
        }
    }
}