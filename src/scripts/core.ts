import { Logging } from './logging';

export default class Core extends Logging {
    constructor() {
        super();
        this.debug('Core initialized');
    }
}