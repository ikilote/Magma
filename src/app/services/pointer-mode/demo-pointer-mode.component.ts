import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
    MagmaPointerModeService,
    MagmaTableModule,
    MagmaTabsModule,
} from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-pointer-mode',
    templateUrl: './demo-pointer-mode.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FormsModule,
        CodeTabsComponent,
        MagmaTabsModule,
        MagmaTableModule,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
    ],
})
export class DemoPointerModeComponent {
    readonly pointerMode = inject(MagmaPointerModeService);

    name = '';
    email = '';

    readonly codeTs = `import { MagmaPointerModeService } from '@ikilote/magma';

@Component({ ... })
export class MyComponent {
    readonly pointerMode = inject(MagmaPointerModeService);

    onMenuClick() {
        if (this.pointerMode.isKeyboard()) {
            // keyboard navigation: move focus programmatically
            this.mainContent.nativeElement.focus();
        }
        // pointer click: skip focus to avoid unwanted focus outline
    }
}`;
}
