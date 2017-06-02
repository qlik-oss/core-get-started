import { Component } from '@angular/core';

@Component({
    selector: 'greetings',
    template: `<h1>Hello {{name}} </h1>`,
})
export class AppComponent {
    public name = 'Angular';
}
