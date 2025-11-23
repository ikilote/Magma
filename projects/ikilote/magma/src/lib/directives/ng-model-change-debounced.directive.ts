import { Directive, OnDestroy, effect, inject, input, numberAttribute, output } from '@angular/core';
import { NgModel } from '@angular/forms';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';

@Directive({
    selector: '[ngModelChangeDebounced]',
})
export class MagmaNgModelChangeDebouncedDirective implements OnDestroy {
    /** Inject NgModel to access the control */
    protected readonly ngModel = inject(NgModel);

    /** Input for the debounce time (default: 500ms) */
    readonly ngModelChangeDebounceTime = input(500, { transform: numberAttribute });
    /** Output to emit the debounced value */
    readonly ngModelChangeDebounced = output<any>();

    // Subject to relay value changes and allow dynamic debounce
    private valueChanges$ = new Subject<any>();
    // Subscription to manage the debounced stream
    private debouncedSubscription!: Subscription;

    constructor() {
        // Forward valueChanges to our subject
        this.ngModel.control.valueChanges
            .pipe(
                skip(1), // Skip the initial value
                distinctUntilChanged(), // Only emit when the value has changed
            )
            .subscribe(this.valueChanges$);

        // Initialize the debounced subscription
        this.setupDebouncedSubscription();

        // React to changes in ngModelChangeDebounceTime
        effect(() => {
            this.setupDebouncedSubscription();
        });
    }

    /**
     *  Set up the debounced subscription with the current debounce time
     */
    private setupDebouncedSubscription() {
        // Unsubscribe from the previous debounced subscription if it exists
        if (this.debouncedSubscription) {
            this.debouncedSubscription.unsubscribe();
        }

        // Create a new debounced subscription with the current debounce time
        this.debouncedSubscription = this.valueChanges$
            .pipe(debounceTime(this.ngModelChangeDebounceTime()))
            .subscribe(value => {
                this.ngModelChangeDebounced.emit(value);
            });
    }

    /**
     * Clean up subscriptions to avoid memory leaks
     */
    ngOnDestroy() {
        this.debouncedSubscription.unsubscribe();
        this.valueChanges$.complete();
    }
}
