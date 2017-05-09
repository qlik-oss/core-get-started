import { Component } from '@angular/core';
import * as enigma from 'enigma.js';
import { enigmaConfig } from './enigma-config';

@Component({
    selector: 'qlik',
    template: `<div>QIX Version: <span id="qix-version">{{version}}</span><br /><br />{{versionError}}</div>`,
})
export class QlikComponent  {
    private version = 'unknown';
    private versionError = '';

    constructor() {
        console.log('QlikComponent: constructor() called.');
    }
    public ngOnInit() {
        console.log('QlikComponent: ngOnInit() called.');
        console.log('Got enigmaConfig obj,', enigmaConfig);
        this.getVersion();
    }
    private async getVersion() {
        try {
            const qix = await enigma.getService('qix', enigmaConfig);
            const ver = await qix.global.engineVersion();

            console.log(`Hello, I am QIX Engine! I am running version: ${ver.qComponentVersion}`);
            this.version = ver.qComponentVersion;
        } catch (err) {
            console.log(`Error when connecting to QIX Engine: ${err.message}`);
            this.versionError = err.message;
        }
    }
}
