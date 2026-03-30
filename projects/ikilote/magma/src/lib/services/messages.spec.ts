import { Overlay, OverlayRef, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { type Mocked, beforeEach, describe, expect, it, vi } from 'vitest';

import { MagmaMessageInfo, MagmaMessageType, MagmaMessages } from './messages';

describe('MagmaMessages', () => {
    let service: MagmaMessages;

    // Strongly typed mocks using Vitest's Mocked utility
    let mockOverlay: Mocked<Overlay>;
    let mockOverlayRef: Mocked<OverlayRef>;
    let mockScrollStrategy: Mocked<ScrollStrategy>;

    beforeEach(() => {
        // 1. Initialize base mocks
        mockOverlayRef = {
            dispose: vi.fn(),
            attach: vi.fn(),
        } as unknown as Mocked<OverlayRef>;

        mockScrollStrategy = {
            enable: vi.fn(),
            disable: vi.fn(),
        } as unknown as Mocked<ScrollStrategy>;

        // 2. Setup Overlay mock with Fluent API (method chaining)
        mockOverlay = {
            create: vi.fn().mockReturnValue(mockOverlayRef),
            scrollStrategies: {
                block: vi.fn().mockReturnValue(mockScrollStrategy),
            },
            position: vi.fn().mockReturnValue({
                global: vi.fn().mockReturnThis(), // Returns the same object for chaining
                right: vi.fn().mockReturnThis(),
                centerHorizontally: vi.fn().mockReturnThis(),
            }),
        } as unknown as Mocked<Overlay>;

        TestBed.configureTestingModule({
            providers: [
                MagmaMessages,
                // Inject the mock directly into the Angular dependency system
                { provide: Overlay, useValue: mockOverlay },
            ],
        });

        service = TestBed.inject(MagmaMessages);
    });

    afterEach(async () => {
        // Clean up overlay if it exists
        if (service['_overlayRef']) {
            service['_overlayRef'].dispose();
            service['_overlayRef'] = undefined;
        }

        // Clear service state
        service.messages.splice(0, service.messages.length);

        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    describe('addMessage', () => {
        it('should create overlay when adding first message', () => {
            service.addMessage('Test message');

            expect(mockOverlay.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    hasBackdrop: false,
                    panelClass: 'overlay-message',
                    scrollStrategy: mockScrollStrategy,
                }),
            );
            // Verify that a portal is attached to the overlay
            expect(mockOverlayRef.attach).toHaveBeenCalledWith(expect.any(ComponentPortal));
        });

        it('should add message to messages array with default values', () => {
            service.addMessage('Test message');

            expect(service.messages).toHaveLength(1);
            expect(service.messages[0]).toMatchObject({
                message: 'Test message',
                type: MagmaMessageType.info,
                time: '3s',
            });
        });

        it('should add message with custom type and time', () => {
            service.addMessage('Test message', { type: MagmaMessageType.success, time: '5s' });

            expect(service.messages[0].type).toBe(MagmaMessageType.success);
            expect(service.messages[0].time).toBe('5s');
        });

        it('should emit onAddMessage event', () => {
            // Using vi.spyOn to observe the Subject's next method
            const spy = vi.spyOn(service.onAddMessage, 'next');

            service.addMessage('Test message');
            expect(spy).toHaveBeenCalled();
        });

        it('should not create a new overlay when adding subsequent messages', () => {
            service.addMessage('First message');
            service.addMessage('Second message');

            // Overlay.create should only be called once for the lifetime of the messages
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
            expect(service.messages).toHaveLength(0);
        });
    });

    describe('clearMessages', () => {
        it('should remove all messages from messages array', () => {
            const message1: MagmaMessageInfo = {
                message: 'Test message 1',
                type: MagmaMessageType.info,
                time: '3s',
            };
            const message2: MagmaMessageInfo = {
                message: 'Test message 2',
                type: MagmaMessageType.error,
                time: '10s',
            };
            service.messages.push(message1);
            service.messages.push(message2);
            expect(service.messages).toHaveLength(2);

            service.clearMessages();
            expect(service.messages).toHaveLength(0);
        });

        it('should remove all messages from messages when array is empty', () => {
            expect(service.messages).toHaveLength(0);

            service.clearMessages();
            expect(service.messages).toHaveLength(0);
        });
    });

    describe('testDispose', () => {
        it('should dispose overlay if no messages exist', () => {
            // Simulate an existing overlay by adding a message
            service.addMessage('Test message');

            // Clear messages manually to trigger disposal logic
            service.messages.forEach(msg => service.removeMessage(msg));
            service.testDispose();

            expect(mockOverlayRef.dispose).toHaveBeenCalled();
            // Access private property to verify cleanup
            expect((service as any)._overlayRef).toBeUndefined();
        });

        it('should not dispose overlay if messages are still present', () => {
            service.addMessage('Test message');
            service.testDispose();

            expect(mockOverlayRef.dispose).not.toHaveBeenCalled();
        });
    });
});
