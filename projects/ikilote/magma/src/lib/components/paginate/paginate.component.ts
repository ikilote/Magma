import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DoCheck,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    booleanAttribute,
    computed,
    inject,
    input,
    numberAttribute,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Subject } from 'rxjs';

import { Subscriptions } from '../../utils/subscriptions';

interface Page {
    page?: number;
    view?: string;
    current?: boolean;
    separator?: boolean;
}
let counter = 0;

@Component({
    selector: 'mg-paginate',
    templateUrl: './paginate.component.html',
    styleUrls: ['./paginate.component.scss'],
    imports: [RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        role: 'navigation',
    },
})
export class MagmaPagination implements OnInit, DoCheck, OnChanges, OnDestroy {
    private static readonly onPageUpdate = new Subject<{
        id: string;
        page: number;
        component: MagmaPagination;
    }>();

    readonly cd = inject(ChangeDetectorRef);

    // input

    readonly linkId = input<string>();
    readonly showTotal = input(false, { transform: booleanAttribute });
    readonly textTotal = input('Total %');
    readonly textPage = input('Page %p / %t');

    readonly page = input(1, { transform: numberAttribute });
    readonly total = input(0, { transform: numberAttribute });
    readonly base = input<string>();
    readonly size = input(25, { transform: numberAttribute });
    readonly queryParams = input<{}>({});

    readonly start = input(3, { transform: numberAttribute });
    readonly middleStart = input(3, { transform: numberAttribute });
    readonly middleEnd = input(3, { transform: numberAttribute });
    readonly end = input(3, { transform: numberAttribute });

    // template

    pages: Page[] = [];
    currentPage = 1;

    private _test = 0;

    protected counter = counter++;
    protected readonly uid = computed<string>(() => `page-${this.counter}`);

    private readonly subs = Subscriptions.instance();

    constructor() {
        this.subs.push(
            MagmaPagination.onPageUpdate.subscribe(page => {
                if (this.linkId() === page.id && page.component !== this) {
                    this.update(page.page, false);
                    this.ngDoCheck();
                    this.cd.detectChanges();
                }
            }),
        );
    }

    ngOnInit(): void {
        this.currentPage = this.page();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['page']) {
            this.currentPage = changes['page'].currentValue;
        }
    }

    ngDoCheck(): void {
        const pages = [];
        let currentPage = +this.currentPage;
        let test = 0;

        const nbPages = this.size() ? Math.ceil(this.total() / this.size()) : 0;

        if (currentPage < 1) {
            currentPage = 1;
            this.currentPage = currentPage;
        } else if (currentPage > nbPages) {
            currentPage = nbPages;
            this.currentPage = currentPage;
        }

        const addPage = (pageNbr: number) => {
            const link: Page = {};
            link.current = currentPage === pageNbr;
            link.view = `${pageNbr}`;
            link.page = pageNbr;
            test += pageNbr;
            pages.push(link);
        };

        let i: number;
        const startPos = this.start();
        const middleStartPos = currentPage - this.middleStart();
        const middleEndPos = currentPage + this.middleEnd();
        const endPos = nbPages - this.end() + 1;

        for (i = 1; i <= Math.min(startPos, nbPages); i++) {
            addPage(i);
        }
        if (startPos + 1 < middleStartPos) {
            pages.push({ separator: true });
        }
        for (i = Math.max(startPos + 1, middleStartPos); i <= Math.min(middleEndPos, nbPages); i++) {
            addPage(i);
        }
        if (middleEndPos + 1 < endPos) {
            pages.push({ separator: true });
        }
        for (let i = Math.max(middleEndPos + 1, endPos); i <= nbPages; i++) {
            addPage(i);
        }

        if (this._test != test) {
            this._test = test;
            this.pages = pages;
        }
    }

    ngOnDestroy(): void {
        this.subs.clear();
    }

    update(page: number, event: boolean): void {
        if (this.currentPage !== page) {
            this.currentPage = page;
            this.pages.forEach(e => (e.current = e.page === page));
            if (event && this.linkId()) {
                MagmaPagination.onPageUpdate.next({ page, id: this.linkId()!, component: this });
            }
        }
    }

    pageQueryParams(page: number): {} {
        return { page, ...this.queryParams() };
    }
}
