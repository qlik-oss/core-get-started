import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { QlikComponent } from './qlik.component';

@NgModule({
    imports:      [ BrowserModule ],
    declarations: [ AppComponent, QlikComponent ],
    bootstrap:    [ AppComponent, QlikComponent ],
})
export class AppModule { }
