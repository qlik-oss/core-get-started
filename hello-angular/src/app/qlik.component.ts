import { Component } from '@angular/core';
import * as enigma from 'enigma.js';
import { enigmaConfig } from './enigma-config';

@Component({
    selector: 'qlik',
    template: `<div>QIX Version: <span id="qix-version">{{version}}</span><br /><br />{{der}}</div>`,
})
export class QlikComponent  {
    version = 'unknown';
    der = '';

    constructor() {
        console.log('QlikComponent: constructor() called.');
    }
    ngOnInit() {
        console.log('QlikComponent: ngOnInit() called.');
        console.log('Got enigmaConfig obj,', enigmaConfig);
        enigma.getService('qix', enigmaConfig).then((qix) => {
          console.log('Connection established');
          return qix.global.engineVersion();
        })
        .then((version) => {
            console.log(`Hello, I am QIX Engine! I am running version: ${version.qComponentVersion}`);
            this.version = version.qComponentVersion;
        })
        .catch((err) => {
            console.log(`Error when connecting to QIX Engine: ${err.message}`);
            this.der = err.message;
        });
    }
}
