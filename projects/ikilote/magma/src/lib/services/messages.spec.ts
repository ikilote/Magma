import { Overlay, OverlayRef, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { MagmaMessageInfo, MagmaMessageType, MagmaMessages } from './messages';

describe('MagmaMessages', () => {
    let service: MagmaMessages;
    let mockOverlay: jasmine.SpyObj<Overlay>;
    let mockOverlayRef: jasmine.SpyObj<OverlayRef>;
    let mockScrollStrategy: jasmine.SpyObj<ScrollStrategy>;
    let mockPositionStrategy: any;

    beforeEach(() => {
        // Create mocks
        mockOverlayRef = jasmine.createSpyObj('OverlayRef', ['dispose', 'attach']);
        mockScrollStrategy = jasmine.createSpyObj('ScrollStrategy', ['enable', 'disable']);
        mockPositionStrategy = {
            global: jasmine.createSpy().and.returnValue({
                right: jasmine.createSpy().and.returnValue({}),
            }),
        };

        mockOverlay = jasmine.createSpyObj('Overlay', ['create', 'scrollStrategies', 'position']);
        mockOverlay.create.and.returnValue(mockOverlayRef);
        (mockOverlay.scrollStrategies as any) = { block: jasmine.createSpy().and.returnValue(mockScrollStrategy) };
        mockOverlay.position.and.returnValue(mockPositionStrategy);

        // Create service instance
        service = TestBed.inject(MagmaMessages);
        (service as any).overlay = mockOverlay;
    });

    describe('addMessage', () => {
        it('should create overlay when adding first message', () => {
            service.addMessage('Test message');
            expect(mockOverlay.create).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    hasBackdrop: false,
                    panelClass: 'overlay-message',
                    scrollStrategy: mockScrollStrategy,
                    positionStrategy: jasmine.any(Object),
                }),
            );
            expect(mockOverlayRef.attach).toHaveBeenCalledWith(jasmine.any(ComponentPortal));
        });

        it('should add message to messages array', () => {
            service.addMessage('Test message');
            expect(service.messages.length).toBe(1);
            expect(service.messages[0].message).toBe('Test message');
            expect(service.messages[0].type).toBe(MagmaMessageType.info);
            expect(service.messages[0].time).toBe('3s');
        });

        it('should add message with custom type and time', () => {
            service.addMessage('Test message', { type: MagmaMessageType.success, time: '5s' });
            expect(service.messages[0].type).toBe(MagmaMessageType.success);
            expect(service.messages[0].time).toBe('5s');
        });

        it('should emit onAddMessage event', () => {
            spyOn(service.onAddMessage, 'next');
            service.addMessage('Test message');
            expect(service.onAddMessage.next).toHaveBeenCalled();
        });

        it('should not create overlay when adding subsequent messages', () => {
            // First message creates overlay
            service.addMessage('First message');
            expect(mockOverlay.create).toHaveBeenCalledTimes(1);

            // Subsequent messages don't create overlay
            service.addMessage('Second message');
            expect(mockOverlay.create).toHaveBeenCalledTimes(1);
        });
    });

    describe('removeMessage', () => {
        it('should remove message from messages array', () => {
            const message: MagmaMessageInfo = {
                message: 'Test message',
                type: MagmaMessageType.info,
                time: '3s',
            };
            service.messages.push(message);
            service.removeMessage(message);
            expect(service.messages.length).toBe(0);
        });
    });

    describe('testDispose', () => {
        it('should dispose overlay if no messages exist', () => {
            // Add a message to create overlay
            service.addMessage('Test message');
            (service as any)._overlayRef = mockOverlayRef;

            // Remove the message and test dispose
            service.removeMessage(service.messages[0]);
            service.testDispose();
            expect(mockOverlayRef.dispose).toHaveBeenCalled();
            expect((service as any)._overlayRef).toBeUndefined();
        });

        it('should not dispose overlay if messages exist', () => {
            service.addMessage('Test message');
            (service as any)._overlayRef = mockOverlayRef;
            service.testDispose();
            expect(mockOverlayRef.dispose).not.toHaveBeenCalled();
        });
    });
});
