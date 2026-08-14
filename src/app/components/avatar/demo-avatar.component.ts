import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Avatar, Style } from '@dicebear/core';
import definition from '@dicebear/styles/avataaars.json' with { type: 'json' };
import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';
import {
    FormBuilderExtended,
    MagmaAvatar,
    MagmaInput,
    MagmaInputElement,
    MagmaInputSelect,
    MagmaInputText,
    MagmaTableModule,
    MagmaTabsModule,
} from '@ikilote/magma';

import { CSSVar, CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-avatar',
    templateUrl: './demo-avatar.component.html',
    styleUrl: './demo-avatar.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ReactiveFormsModule,
        CodeTabsComponent,
        MagmaAvatar,
        MagmaInput,
        MagmaInputElement,
        MagmaInputSelect,
        MagmaInputText,
        MagmaTabsModule,
        MagmaTableModule,
    ],
})
export class DemoAvatarComponent {
    readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        src: FormControl<string>;
        initials: FormControl<string>;
        size: FormControl<string>;
        alt: FormControl<string>;
    }>;

    readonly sizeOptions = [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
        { value: 'extra', label: 'Extra' },
    ];

    codeHtml = '';
    codeTs = `import { MagmaAvatar } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    imports: [MagmaAvatar],
})
export class MyComponent {}`;

    codeCss: CSSVar[] = [
        { name: '--avatar-size-small', value: '28px' },
        { name: '--avatar-size-medium', value: '40px' },
        { name: '--avatar-size-large', value: '56px' },
        { name: '--avatar-color', value: 'hsl(210, 50%, 20%)' },
        { name: '--avatar-radius', value: '50%' },
    ];

    style = new Style(definition);
    avatar = new Avatar(this.style, { seed: 'Bob' }).toDataUri();
    avatarA = new Avatar(this.style, { seed: 'Julie' }).toDataUri();
    avatarB = new Avatar(this.style, { seed: 'Jules' }).toDataUri();
    avatarC = new Avatar(this.style, { seed: 'Alice' }).toDataUri();
    avatarD = new Avatar(this.style, { seed: 'Charles' }).toDataUri();

    constructor() {
        const svg = this.avatarA;

        this.ctrlForm = this.fb.groupWithError({
            src: { default: this.avatar },
            initials: { default: 'JD' },
            size: { default: 'medium' },
            alt: { default: 'User avatar' },
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    codeGeneration() {
        const json: Json2htmlRef = {
            tag: 'mg-avatar',
            attrs: {},
        };
        const attrs: Json2htmlAttr = json.attrs!;

        if (this.ctrlForm.value.src) {
            attrs['[src]'] = `'${this.ctrlForm.value.src}'`;
        }
        if (this.ctrlForm.value.initials) {
            attrs['initials'] = this.ctrlForm.value.initials;
        }
        if (this.ctrlForm.value.size !== 'medium') {
            attrs['size'] = this.ctrlForm.value.size;
        }
        if (this.ctrlForm.value.alt) {
            attrs['alt'] = this.ctrlForm.value.alt;
        }

        this.codeHtml = new Json2html(json).toString();
    }
}
