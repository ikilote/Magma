import { Component } from '@angular/core';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-inputs',
    templateUrl: './demo-inputs.component.html',
    styleUrl: './demo-inputs.component.scss',
    imports: [CodeTabsComponent],
})
export class DemoInputsComponent {
    text = `<label for="text">Label</label>
<input id="text" type="text" name="text" />`;

    password = `<label for="password">Label</label>
<input id="password" type="password" name="password" />`;

    radio = `<label for="radio1"><input id="radio1" type="radio" name="radio" /> Label</label>
<label for="radio2"><input id="radio2" type="radio" name="radio" /> Label</label>`;

    checkbox = `<label for="checkbox1"><input id="checkbox1" type="checkbox" name="checkbox" /> Label</label>
<label for="checkbox2"><input id="checkbox2" type="checkbox" name="checkbox" /> Label</label>`;

    file = `<label for="file">Label</label>
<input id="file" type="file" />`;

    textarea = `<label for="textarea">Label</label>
<textarea id="textarea" name="textarea"></textarea>
`;

    select = `<label for="select">Label</label>
<select id="select" name="select">
  <option>1</option>
  <option>2</option>
  <option>3</option>
</select>`;
}
