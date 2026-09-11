import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Subject } from 'rxjs';

import { MagmaInfoMessageComponent } from './info-message.component';
import { MagmaInfoMessagesComponent } from './info-messages.component';

import { MagmaMessageContent, MagmaMessageInfo, MagmaMessageType, MagmaMessages } from '../../services/messages';

// ── Mock factory ──────────────────────────────────────────────────────────────

function makeMock() {
    const mock = {
        removeMessage: vi
            .fn()
            .mockImplementation((msg: MagmaMessageInfo) => {
                const index = mock.messages.indexOf(msg);
                if (index > -1) {
                    mock.messages.splice(index, 1);
                }
            })
            .mockName('MagmaMessages.removeMessage'),

        testDispose: vi.fn().mockName('MagmaMessages.testDispose'),

        clearMessages: vi
            .fn()
            .mockImplementation(() => {
                mock.messages.length = 0;
            })
            .mockName('MagmaMessages.clearMessages'),

        messagesForZones: vi
            .fn()
            .mockImplementation((zoneIds: Set<string>) =>
                mock.messages.filter((m: MagmaMessageInfo) => zoneIds.has(m.zone)),
            )
            .mockName('MagmaMessages.messagesForZones'),

        messages: [] as MagmaMessageInfo[],

        addMessage(
            message: MagmaMessageContent,
            options: { type?: MagmaMessageType; time?: string; zone?: string } = {},
        ) {
            mock.messages.push({
                message,
                type: options.type ?? MagmaMessageType.info,
                time: options.time ?? '3s',
                zone: options.zone ?? 'default',
            });
            mock.onAddMessage.next();
        },

        onAddMessage: new Subject<void>(),
    };
    return mock;
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('InfoMessagesComponent', () => {
    let fixture: ComponentFixture<MagmaInfoMessagesComponent>;
    let component: MagmaInfoMessagesComponent;
    let messagesService: ReturnType<typeof makeMock>;

    beforeEach(async () => {
        messagesService = makeMock();

        await TestBed.configureTestingModule({
            imports: [MagmaInfoMessagesComponent, MagmaInfoMessageComponent],
            providers: [{ provide: MagmaMessages, useValue: messagesService }],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaInfoMessagesComponent);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        messagesService.clearMessages();
        fixture?.destroy();
        TestBed.resetTestingModule();
    });

    // ── Initial state ─────────────────────────────────────────────────────────

    it('should not display any messages initially', () => {
        const infoMessages = fixture.debugElement.queryAll(By.directive(MagmaInfoMessageComponent));
        expect(infoMessages.length).toBe(0);
    });

    // ── Adding messages ───────────────────────────────────────────────────────

    it('should display messages after they are added', () => {
        messagesService.addMessage('Message 1', { type: MagmaMessageType.info, time: '1s' });
        messagesService.addMessage('Message 2', { type: MagmaMessageType.info, time: '1s' });
        fixture.changeDetectorRef.detectChanges();

        const infoMessages = fixture.debugElement.queryAll(By.directive(MagmaInfoMessageComponent));
        expect(infoMessages.length).toBe(2);
    });

    // ── destruct() ────────────────────────────────────────────────────────────

    it('should call removeMessage and testDispose when destruct is called', () => {
        const testMessage: MagmaMessageInfo = {
            message: 'Test',
            type: MagmaMessageType.info,
            time: '1s',
            zone: 'default',
        };
        messagesService.messages.push(testMessage);
        messagesService.onAddMessage.next();
        fixture.changeDetectorRef.detectChanges();

        component.destruct(testMessage);

        expect(messagesService.removeMessage).toHaveBeenCalledWith(testMessage);
        expect(messagesService.testDispose).toHaveBeenCalledWith('default');
    });

    it('should update the view after removing a message', () => {
        const testMessage: MagmaMessageInfo = {
            message: 'Test',
            type: MagmaMessageType.info,
            time: '1s',
            zone: 'default',
        };
        messagesService.messages.push(testMessage);
        messagesService.onAddMessage.next();
        fixture.changeDetectorRef.detectChanges();

        component.destruct(testMessage);
        fixture.changeDetectorRef.detectChanges();

        const infoMessages = fixture.debugElement.queryAll(By.directive(MagmaInfoMessageComponent));
        expect(infoMessages.length).toBe(0);
    });

    // ── Child component destruct event ────────────────────────────────────────

    it('should handle destruct event from mg-info-message component', () => {
        messagesService.addMessage('Test', { type: MagmaMessageType.info, time: '1s' });
        fixture.changeDetectorRef.detectChanges();

        const infoMessageDebug = fixture.debugElement.query(By.directive(MagmaInfoMessageComponent));
        expect(infoMessageDebug).toBeTruthy();

        infoMessageDebug.componentInstance.destruct.emit(messagesService.messages[0]);
        fixture.changeDetectorRef.detectChanges();

        expect(messagesService.removeMessage).toHaveBeenCalled();
        expect(messagesService.testDispose).toHaveBeenCalled();
    });

    // ── Change detection on onAddMessage ─────────────────────────────────────

    it('should trigger change detection when a message is added', () => {
        vi.spyOn(component['cd'], 'detectChanges');
        messagesService.onAddMessage.next();
        expect(component['cd'].detectChanges).toHaveBeenCalled();
    });
});
