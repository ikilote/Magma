import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagmaEllipsisItemComponent } from './ellipsis-item.component';

describe('MagmaEllipsisItemComponent', () => {
    let component: MagmaEllipsisItemComponent;
    let fixture: ComponentFixture<MagmaEllipsisItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [MagmaEllipsisItemComponent] }).compileComponents();

        fixture = TestBed.createComponent(MagmaEllipsisItemComponent);
        component = fixture.componentInstance;
    });

    it('should inject MagmaClickEnterDirective and subscribe to clickEnter', () => {
        expect(component['sub']).toBeDefined();
    });

    it('should call host.close() when clickEnter emits', () => {
        // @ts-expect-error
        spyOn(component.action, 'emit');
        const mockHost = { close: jasmine.createSpy('close') };
        // @ts-expect-error
        component.host = mockHost;
        // @ts-expect-error
        component.clickEnter.clickEnter.emit();

        // @ts-expect-error
        expect(component.action.emit).toHaveBeenCalled();
        expect(mockHost.close).toHaveBeenCalled();
    });

    it('should unsubscribe from clickEnter on ngOnDestroy', () => {
        // @ts-expect-error
        spyOn(component.sub, 'unsubscribe');
        component.ngOnDestroy();
        // @ts-expect-error
        expect(component.sub.unsubscribe).toHaveBeenCalled();
    });
});
