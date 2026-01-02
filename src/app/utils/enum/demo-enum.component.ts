import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';

import { Highlight } from 'ngx-highlightjs';

import {
    enumToKeyList,
    enumToKeyValue,
    enumToMap,
    enumToObject,
    enumToValueList,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

enum Test {
    Val1 = 'test',
    Val2 = 'foo',
    Val3 = 'bar',
    Val4 = 1,
}

@Component({
    selector: 'demo-enum',
    templateUrl: './demo-enum.component.html',
    styleUrl: './demo-enum.component.scss',
    imports: [CodeTabsComponent, JsonPipe, Highlight],
})
export class DemoEnumComponent {
    codeTs = `import {
    enumToValueList,
    enumToKeyList,
    enumToKeyValue,
    enumToObject,
    enumToMap
} from '@ikilote/magma';

enum Test {
    Val1 = 'test',
    Val2 = 'foo',
    Val3 = 'bar',
    Val4 = 1,
}`;

    codeTsMap = `Map(4) {
    size: 4
    <entries>
    0: Array [ "Val1" ] → "test"
    1: Array [ "Val2" ] → "foo"
    2: Array [ "Val3" ] → "bar"
    3: Array [ "Val4" ] → 1
}`;

    enumToValueList = enumToValueList(Test);
    enumToKeyList = enumToKeyList(Test);
    enumToKeyValue = enumToKeyValue(Test);
    enumToObject = enumToObject(Test);
    enumToMap = enumToMap(Test);

    constructor() {
        console.log(this.enumToMap);
    }
}
