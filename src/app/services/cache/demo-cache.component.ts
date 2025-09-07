import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
    MagmaCache,
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-cache',
    templateUrl: './demo-cache.component.html',
    styleUrls: ['./demo-cache.component.scss'],
    imports: [FormsModule, CodeTabsComponent, MagmaInput, MagmaInputElement, MagmaInputText],
})
export class DemoCacheComponent {
    protected readonly cache = inject(MagmaCache);
    protected readonly http = inject(HttpClient);

    id = 'test';
    group = 'Group1, Group2';
    idClear = 'test';
    groupClear = 'Group2';

    codeTs = `import { MagmaCache, flattenedListItems } from '@ikilote/magma';

@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrls: ['./demo-test.component.scss'],
})
export class TestComponent {
    protected readonly cache = inject(MagmaCache);
    protected readonly http = inject(HttpClient);

    id = 'test';
    group = 'Group1, Group2';
    idClear = 'test';
    groupClear = 'Group2';

    async action() {
        const value = await this.cache.request(
            this.id,
            flattenedListItems(this.group),
            this.http.get('/assets/images/magma.svg', { responseType: 'text' }),
        );
        console.log(value);
    }

    clearId() {
        this.cache.clearById(this.idClear);
    }

    clearGroup() {
        this.cache.clearByGroupName(this.groupClear);
    }
}`;

    async action() {
        const value = await this.cache.request(
            this.id,
            this.group,
            this.http.get('/assets/images/magma.svg', { responseType: 'text' }),
        );
        console.log(value);
    }

    clearId() {
        this.cache.clearById(this.idClear);
    }

    clearGroup() {
        this.cache.clearByGroupName(this.groupClear);
    }
}
