import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
    MagmaSortableModule,
    MagmaTableModule,
    NumFormatPipe,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-sortable',
    templateUrl: './demo-sortable.component.html',
    styleUrls: ['./demo-sortable.component.scss'],
    imports: [
        MagmaSortableModule,
        MagmaTableModule,
        FormsModule,
        NumFormatPipe,
        DatePipe,
        CodeTabsComponent,
        MagmaInput,
        MagmaInputText,
        MagmaInputElement,
    ],
})
export class DemoSortableComponent {
    codeTs = `import { MagmaSortable, MagmaTableComponent } from '@ikilote/magma';

@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrls: ['./demo-test.component.scss'],
    imports: [
        MagmaSortable, // like [MagmaSortableDirective, MagmaSortRuleDirective]
        MagmaTableComponent,
        NumFormatPipe,
        DatePipe
    ],
})
export class TestComponent {
    items = [
        { col1: 'X', col2: 'Y', col3: 'B', col4: 'A', col5: { date: new Date('2025-10-03'), value: 1 } },
        { col1: 'A', col2: 'B', col3: 'K', col4: 'D', col5: { date: new Date('2022-09-09'), value: 12 } },
        { col1: 'M', col2: 'F', col3: 'G', col4: 'P', col5: { date: new Date('2030-10-03'), value: 5 } },
        { col1: 'E', col2: 'N', col3: 'O', col4: 'H', col5: { date: new Date('1980-06-15'), value: 1000 } },
        { col1: 'I', col2: 'J', col3: 'C', col4: 'L', col5: { date: new Date('1999-01-29'), value: 4 } },
    ];
}`;
    codeHtml = `<table mg hover [sortable]="items" class="s-12">
  <thead mg>
    <tr mg>
      <th mg [sort-rule]="{ type: 'string', attr: 'col1', init: 'asc' }">Col 1</th>
      <th mg sort-rule="col2">Col 2</th>
      <th mg [sort-rule]="{ type: 'string', attr: 'col3' }">Col 3</th>
      <th mg [sort-rule]="{ type: 'string', attr: 'col4' }">Col 4</th>
      <th mg [sort-rule]="{ type: 'number', attr: 'col5.value' }">Col Num</th>
      <th mg [sort-rule]="{ type: 'date', attr: 'col5.date' }">Col Date</th>
      <th mg sort-rule="col6.value:number,col5.value:number">Col Num+</th>
    </tr>
  </thead>
  <tbody mg>
    @for (item of items; track $index) {
      <tr mg>
        <td mg>{{ item.col1 }}</td>
        <td mg>{{ item.col2 }}</td>
        <td mg>{{ item.col3 }}</td>
        <td mg>{{ item.col4 }}</td>
        <td mg>{{ item.col5.value | numFormat }}</td>
        <td mg>{{ item.col5.date | date: 'yyyy-MM-dd' }}</td>
        <td mg>{{ item.col6.value | numFormat }}</td>
      </tr>
    }
  </tbody>
</table>`;

    codeTsFilter = `@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrls: ['./demo-test.component.scss'],
    imports: [
        MagmaSortable, // like [MagmaSortableDirective, MagmaSortRuleDirective]
        FormsModule,
        NumFormatPipe,
        DatePipe,
        MagmaTableComponent,
        MagmaInput,
        MagmaInputText,
        MagmaInputElement,
    ],
})
export class TestComponent {
    items = [
        { col1: 'X', col2: 'Y', col3: 'B', col4: 'A', col5: { date: new Date('2025-10-03'), value: 1 } },
        { col1: 'A', col2: 'B', col3: 'K', col4: 'D', col5: { date: new Date('2022-09-09'), value: 12 } },
        { col1: 'M', col2: 'F', col3: 'G', col4: 'P', col5: { date: new Date('2030-10-03'), value: 5 } },
        { col1: 'E', col2: 'N', col3: 'O', col4: 'H', col5: { date: new Date('1980-06-15'), value: 1000 } },
        { col1: 'I', col2: 'J', col3: 'C', col4: 'L', col5: { date: new Date('1999-01-29'), value: 4 } },
    ];

    filter = '';

    sortableFilter = (
        key: string,
        item: { col1: string; col2: string; col3: string; col4: string; col5: { date: Date; value: number } },
        _index: number,
    ): boolean => {
        return (
            key.toLocaleLowerCase() === item.col1.toLocaleLowerCase() ||
            key.toLocaleLowerCase() === item.col2.toLocaleLowerCase() ||
            key.toLocaleLowerCase() === item.col3.toLocaleLowerCase() ||
            key.toLocaleLowerCase() === item.col4.toLocaleLowerCase() ||
            +key === item.col5.value ||
            new Date(key).getTime() === item.col5.date.getTime()
        );
    };
}`;
    codeHtmlFilter = `<mg-input class="s-6">
  <mg-input-label>Filter</mg-input-label>
  <mg-input-text
    id="browser-list-filter"
    type="search"
    maxlength="150"
    [(ngModel)]="filter"
    #inputFilter
  />
</mg-input>

<table
  mg
  hover
  [sortable]="items"
  [sortable-filter-input]="inputFilter"
  [sortable-filter]="sortableFilter"
  class="s-12"
>
  <thead mg>
    <tr mg>
      <th mg [sort-rule]="{ type: 'string', attr: 'col1' }">Col 1</th>
      <th mg [sort-rule]="{ type: 'string', attr: 'col2' }">Col 2</th>
      <th mg [sort-rule]="{ type: 'string', attr: 'col3' }">Col 3</th>
      <th mg [sort-rule]="{ type: 'string', attr: 'col4' }">Col 4</th>
      <th mg [sort-rule]="{ type: 'number', attr: 'col5.value' }">Col Num</th>
      <th mg [sort-rule]="{ type: 'date', attr: 'col5.date' }">Col Date</th>
    </tr>
  </thead>
  <tbody mg>
    @for (item of items; track $index) {
      <tr mg>
        <td mg>{{ item.col1 }}</td>
        <td mg>{{ item.col2 }}</td>
        <td mg>{{ item.col3 }}</td>
        <td mg>{{ item.col4 }}</td>
        <td mg>{{ item.col5.value | numFormat }}</td>
        <td mg>{{ item.col5.date | date: 'yyyy-MM-dd' }}</td>
      </tr>
    }
  </tbody>
</table>`;

    items: {
        col1: string;
        col2: string;
        col3: string;
        col4: string;
        col5: { date: Date; value: number };
        col6: { value: number };
    }[] = [
        {
            col1: 'X',
            col2: 'Y',
            col3: 'B',
            col4: 'A',
            col5: { date: new Date('2025-10-03'), value: 1 },
            col6: { value: 5.65 },
        },
        {
            col1: 'A',
            col2: 'B',
            col3: 'K',
            col4: 'D',
            col5: { date: new Date('2022-09-09'), value: 12 },
            col6: { value: 456.85 },
        },
        {
            col1: 'M',
            col2: 'F',
            col3: 'G',
            col4: 'P',
            col5: { date: new Date('2030-10-03'), value: 5 },
            col6: { value: 12 },
        },
        {
            col1: 'E',
            col2: 'N',
            col3: 'O',
            col4: 'H',
            col5: { date: new Date('1980-06-15'), value: 1000 },
            col6: { value: 50.48 },
        },
        {
            col1: 'I',
            col2: 'J',
            col3: 'C',
            col4: 'L',
            col5: { date: new Date('1999-01-29'), value: 4 },
            col6: { value: 50.49 },
        },
        {
            col1: 'I',
            col2: 'J',
            col3: 'C',
            col4: 'L',
            col5: { date: new Date('1999-01-29'), value: 5 },
            col6: { value: 50.49 },
        },
    ];

    filter = '';

    sortableFilter = (
        key: string,
        item: { col1: string; col2: string; col3: string; col4: string; col5: { date: Date; value: number } },
        _index: number,
    ): boolean => {
        return (
            key.toLocaleLowerCase() === item.col1.toLocaleLowerCase() ||
            key.toLocaleLowerCase() === item.col2.toLocaleLowerCase() ||
            key.toLocaleLowerCase() === item.col3.toLocaleLowerCase() ||
            key.toLocaleLowerCase() === item.col4.toLocaleLowerCase() ||
            +key === item.col5.value ||
            new Date(key).getTime() === item.col5.date.getTime()
        );
    };
}
