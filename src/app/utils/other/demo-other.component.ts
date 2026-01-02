import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { isEmpty, regexpSlash } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-other',
    templateUrl: './demo-other.component.html',
    styleUrl: './demo-other.component.scss',
    imports: [ReactiveFormsModule, CodeTabsComponent, JsonPipe],
})
export class DemoOtherComponent {
    codeTs = `import { isEmpty } from '@ikilote/magma';

@Component({ ... })
export class TestComponent {
    isEmptyString = isEmpty('');
    isEmptyArray = isEmpty([]);
    isEmptyObject = isEmpty({});
    isEmptyUndefined = isEmpty(undefined);
    isEmptyNull = isEmpty(null);

    notEmptyArray = isEmpty([undefined]);
    notEmptyString = isEmpty('   ');
    notEmptyObject = isEmpty({ a: undefined });
}`;

    codeTsRegExp = `import { regexpSlash } from '@ikilote/magma';

@Component({ ... })
export class TestComponent {
    regexpSlashString = regexpSlash('Test');
    regexpSlashString2 = regexpSlash('/Test/');
    regexpSlashRegex = regexpSlash(/Test/);
}`;

    isEmptyString = isEmpty('');
    isEmptyArray = isEmpty([]);
    isEmptyObject = isEmpty({});
    isEmptyUndefined = isEmpty(undefined);
    isEmptyNull = isEmpty(null);

    notEmptyArray = isEmpty([undefined]);
    notEmptyString = isEmpty('   ');
    notEmptyObject = isEmpty({ a: undefined });

    regexpSlashString = regexpSlash('Test');
    regexpSlashString2 = regexpSlash('/Test/');
    regexpSlashRegex = regexpSlash(/Test/);
}
