import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
    downloadFile,
    normalizeFileName,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-file',
    templateUrl: './demo-file.component.html',
    styleUrls: ['./demo-file.component.scss'],
    imports: [ReactiveFormsModule, CodeTabsComponent, MagmaInput, MagmaInputText, MagmaInputElement],
})
export class DemoFileComponent {
    codeTsDownloadFile = `@Component({ ... })
export class TestComponent {
  downloadFile() {
        downloadFile('data:@file/plain;base64,VGVzdCBmaWxlCg==', 'file.txt', 'text/plain');
    }
}`;
    codeTsBlobToBase64 = `@Component({ ... })
export class TestComponent {
  async blobToBase64(blob: Blob) {
    return await blobToBase64(blob);
  }
}`;
    codeTsUlrToBase64 = `@Component({ ... })
export class TestComponent {
  async ulrToBase64(url: string) {
    return await ulrToBase64(url);
  }
}`;
    codeTsNormalizeFileName = `@Component({ ... })
export class TestComponent {
    file = '';

    format(fileName: string) {
        this.file = normalizeFileName(fileName);
    }
}`;

    file = '';

    downloadFile() {
        downloadFile('data:@file/plain;base64,VGVzdCBmaWxlCg==', 'file.txt', 'text/plain');
    }

    format(fileName: string) {
        this.file = normalizeFileName(fileName);
    }
}
