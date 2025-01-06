import { Component } from '@angular/core';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-inputs',
    templateUrl: './demo-inputs.component.html',
    styleUrls: ['./demo-inputs.component.scss'],
    imports: [CodeTabsComponent],
})
export class DemoInputsComponent {
    text = `<label id="text">Label</label>
<input for="text" type="text" name="text" />`;

    password = `<label id="password">Label</label>
<input for="password" type="password" name="password" />`;

    radio = `<label id="radio1"><input for="radio1" type="radio" name="radio" /> Label</label>
<label id="radio2"><input for="radio2" type="radio" name="radio" /> Label</label>`;

    checkbox = `<label id="checkbox1"><input for="checkbox1" type="checkbox" name="checkbox" /> Label</label>
<label id="checkbox2"><input for="checkbox2" type="checkbox" name="checkbox" /> Label</label>`;

    file = `<label id="file">Label</label>
<input for="file" type="file" />`;

    textarea = `<label id="textarea">Label</label>
<textarea for="textarea" name="textarea"></textarea>
`;

    select = `<select for="select" name="select">
  <option>1</option>
  <option>2</option>
  <option>3</option>
</select>`;
}
