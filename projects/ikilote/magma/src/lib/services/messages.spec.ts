import { Overlay, OverlayRef, ScrollStrategy } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import { type Mocked, beforeEach, describe, expect, it, vi } from 'vitest';

import { MagmaMessageInfo, MagmaMessageType, MagmaMessages } from './messages';

describe('MagmaMessages', () => {
    let service: MagmaMessages;

    let mockOverlay: Mocked<Overlay>;
    let mockOverlayRef: Mocked<OverlayRef>;
    let mockScrollStrategy: Mocked<ScrollStrategy>;

    beforeEach(() => {
        mockOverlayRef = {
            dispose: vi.fn(),
            attach: vi.fn().mockReturnValue({ setInput: vi.fn() }),
        } as unknown as Mocked<OverlayRef>;

        mockScrollStrategy = {
            enable: vi.fn(),
            disable: vi.fn(),
        } as unknown as Mocked<ScrollStrategy>;

        mockOverlay = {
            create: vi.fn().mockReturnValue(mockOverlayRef),
            scrollStrategies: {
                noop: vi.fn().mockReturnValue(mockScrollStrategy),
                block: vi.fn().mockReturnValue(mockScrollStrategy),
            },
            position: vi.fn().mockReturnValue({
                global: vi.fn().mockReturnThis(),
                top: vi.fn().mockReturnThis(),
                bottom: vi.fn().mockReturnThis(),
                left: vi.fn().mockReturnThis(),
                right: vi.fn().mockReturnThis(),
                centerHorizontally: vi.fn().mockReturnThis(),
                centerVertically: vi.fn().mockReturnThis(),
            }),
        } as unknown as Mocked<Overlay>;

        TestBed.configureTestingModule({
            providers: [MagmaMessages, { provide: Overlay, useValue: mockOverlay }],
        });

        service = TestBed.inject(MagmaMessages);
    });

    afterEach(async () => {
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
                }),
            );
        });

        it('should add message to messages array with default values', () => {
            service.addMessage('Test message');

            expect(service.messages).toHaveLength(1);
            expect(service.messages[0]).toMatchObject({
                message: 'Test message',
                type: MagmaMessageType.info,
                time: '3s',
                zone: 'default',
            });
        });

        it('should add message with custom type and time', () => {
            service.addMessage('Test message', { type: MagmaMessageType.success, time: '5s' });

            expect(service.messages[0].type).toBe(MagmaMessageType.success);
            expect(service.messages[0].time).toBe('5s');
        });

        it('should emit onAddMessage event', () => {
            const spy = vi.spyOn(service.onAddMessage, 'next');

            service.addMessage('Test message');
            expect(spy).toHaveBeenCalled();
        });

        it('should not create a new overlay when adding subsequent messages', () => {
            service.addMessage('First message');
            service.addMessage('Second message');

            expect(mockOverlay.create).toHaveBeenCalledTimes(1);
        });

        it('should warn and not add message for unregistered zone', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            service.addMessage('Test', { zone: 'unknown-zone' });

            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('unknown-zone'));
            expect(service.messages).toHaveLength(0);
        });
    });

    describe('addZone', () => {
        it('should register a named zone', () => {
            service.addZone('top-right', { position: { top: '10px', right: '10px' } });
            service.addMessage('Test', { zone: 'top-right' });

            expect(service.messages[0].zone).toBe('top-right');
        });
    });

    describe('removeMessage', () => {
        it('should remove message from messages array', () => {
            const message: MagmaMessageInfo = {
                message: 'Test message',
                type: MagmaMessageType.info,
                time: '3s',
                zone: 'default',
            };
            service.messages.push(message);

            service.removeMessage(message);
            expect(service.messages).toHaveLength(0);
        });

        it('should be a no-op if message is not in the array', () => {
            const message: MagmaMessageInfo = {
                message: 'Ghost',
                type: MagmaMessageType.info,
                time: '3s',
                zone: 'default',
            };

            expect(() => service.removeMessage(message)).not.toThrow();
            expect(service.messages).toHaveLength(0);
        });
    });

    describe('clearMessages', () => {
        it('should remove all messages from messages array', () => {
            const message1: MagmaMessageInfo = {
                message: 'Test message 1',
                type: MagmaMessageType.info,
                time: '3s',
                zone: 'default',
            };
            const message2: MagmaMessageInfo = {
                message: 'Test message 2',
                type: MagmaMessageType.error,
                time: '10s',
                zone: 'default',
            };
            service.messages.push(message1);
            service.messages.push(message2);
            expect(service.messages).toHaveLength(2);

            service.clearMessages();
            expect(service.messages).toHaveLength(0);
        });

        it('should be a no-op when messages array is already empty', () => {
            expect(service.messages).toHaveLength(0);

            service.clearMessages();
            expect(service.messages).toHaveLength(0);
        });
    });

    describe('testDispose', () => {
        it('should dispose overlay bucket if no messages remain', () => {
            service.addMessage('Test message');
            service.messages.forEach(msg => service.removeMessage(msg));

            service.testDispose();

            expect(mockOverlayRef.dispose).toHaveBeenCalled();
        });

        it('should not dispose overlay if messages are still present', () => {
            service.addMessage('Test message');

            service.testDispose();

            expect(mockOverlayRef.dispose).not.toHaveBeenCalled();
        });

        it('should be a no-op when the zone is not registered', () => {
            // Call testDispose for a zone that was never registered via addZone.
            expect(() => service.testDispose('unregistered-zone')).not.toThrow();
            expect(mockOverlayRef.dispose).not.toHaveBeenCalled();
        });

        it('should be a no-op when no bucket exists for the zone', () => {
            // Register zone but never add a message (no bucket created).
            service.addZone('no-bucket-zone', { position: { top: '5px', left: '5px' } });

            expect(() => service.testDispose('no-bucket-zone')).not.toThrow();
            expect(mockOverlayRef.dispose).not.toHaveBeenCalled();
        });

        it('should not dispose bucket when another zone sharing the same position still has messages', () => {
            // Two zones with the same position share one bucket.
            const sharedPos = { top: '10px', right: '10px' };
            service.addZone('zone-a', { position: sharedPos });
            service.addZone('zone-b', { position: sharedPos });

            service.addMessage('From A', { zone: 'zone-a' });
            service.addMessage('From B', { zone: 'zone-b' });

            // Remove only zone-a's message.
            const msgA = service.messages.find(m => m.zone === 'zone-a')!;
            service.removeMessage(msgA);

            // zone-b still has a message in the same bucket — must NOT dispose.
            service.testDispose('zone-a');

            expect(mockOverlayRef.dispose).not.toHaveBeenCalled();
        });
    });

    describe('messagesForZones', () => {
        it('should return messages matching the given zone ids', () => {
            service.addZone('zone-a', { position: { top: '0px' } });
            service.addZone('zone-b', { position: { bottom: '0px' } });
            service.addMessage('A', { zone: 'zone-a' });
            service.addMessage('B', { zone: 'zone-b' });
            service.addMessage('Default');

            const result = service.messagesForZones(new Set(['zone-a']));
            expect(result).toHaveLength(1);
            expect(result[0].message).toBe('A');
        });

        it('should return empty array when no messages match', () => {
            service.addMessage('Default');

            const result = service.messagesForZones(new Set(['zone-x']));
            expect(result).toHaveLength(0);
        });
    });
});
