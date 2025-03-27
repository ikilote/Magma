import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
    ExceptionJsonParse,
    MagmaInput,
    MagmaInputElement,
    MagmaInputTextarea,
    jsonParse,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-json',
    templateUrl: './demo-json.component.html',
    styleUrls: ['./demo-json.component.scss'],
    imports: [CodeTabsComponent, MagmaInput, MagmaInputTextarea, FormsModule, MagmaInputElement],
})
export class DemoJsonComponent {
    codeTsCopy = `@Component({ ... })
export class TestComponent {
    myNewObject?: MyObject;

    testEmail(myObject: object) {
        this.myNewObject = jsonCopy<MyObject>(myObject);
    }
}`;

    codeTsParse = `@Component({ ... })
export class TestComponent {
    error = '';

    update($event: any) {
        this.error = '';
        try {
            jsonParse($event);
        } catch (e) {
            this.error = (e as ExceptionJsonParse).cause;
        }
    }
}`;

    codeTsParseHtml = `<mg-input>
  <mg-input-label>Json</mg-input-label>
  <mg-input-textarea [(ngModel)]="json"
                     (ngModelChange)="update($event)"
                     autosize
                     monospace></mg-input-textarea>
  @if (error) {
    <mg-input-error>
      <pre class="mono">{{ error }}</pre>
    </mg-input-error>
  }
</mg-input>`;

    json = `{
  "text": "example",
  "array" : [ 1, 2, 3 ]
}`;

    error = '';

    update($event: any) {
        this.error = '';
        try {
            jsonParse($event);
        } catch (e) {
            this.error = (e as ExceptionJsonParse).cause;
        }
    }
}
