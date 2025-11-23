import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Subject } from 'rxjs';

import { InfoMessageComponent } from './info-message.component';
import { InfoMessagesComponent } from './info-messages.component';

import { MagmaMessageContent, MagmaMessageInfo, MagmaMessageType, MagmaMessages } from '../../services/messages';

describe('InfoMessagesComponent', () => {
    let fixture: ComponentFixture<InfoMessagesComponent>;
    let component: InfoMessagesComponent;
    let messagesService: jasmine.SpyObj<MagmaMessages>;

    beforeEach(async () => {
        // Mock MagmaMessages service
        const messagesSpy = jasmine.createSpyObj('MagmaMessages', ['removeMessage', 'testDispose'], {
            messages: [],
            addMessage: (message: MagmaMessageContent, options: { type?: MagmaMessageType; time?: string } = {}) => {
                messagesSpy.messages.push({
                    message,
                    type: options.type || MagmaMessageType.info,
                    time: options.time || '3s',
                });
                messagesSpy.onAddMessage.next();
            },
            onAddMessage: new Subject<void>(),
        });

        await TestBed.configureTestingModule({
            imports: [InfoMessagesComponent, InfoMessageComponent],
            providers: [{ provide: MagmaMessages, useValue: messagesSpy }],
        }).compileComponents();

        fixture = TestBed.createComponent(InfoMessagesComponent);
        component = fixture.componentInstance;
        messagesService = TestBed.inject(MagmaMessages) as jasmine.SpyObj<MagmaMessages>;
        fixture.detectChanges();
    });

    it('should not display any messages initially', () => {
        const infoMessages = fixture.debugElement.queryAll(By.directive(InfoMessageComponent));
        expect(infoMessages.length).toBe(0);
    });

    it('should display messages after they are added', fakeAsync(() => {
        messagesService.addMessage('Message 1', { type: MagmaMessageType.info, time: '1s' });
        messagesService.addMessage('Message 2', { type: MagmaMessageType.info, time: '1s' });

        fixture.detectChanges();
        tick();

        const infoMessages = fixture.debugElement.queryAll(By.directive(InfoMessageComponent));
        expect(infoMessages.length).toBe(2);
    }));

    it('should call removeMessage and testDispose when destruct is called', () => {
        const testMessage: MagmaMessageInfo = { message: 'Test', type: MagmaMessageType.info, time: '1s' };
        messagesService.addMessage('Test', { type: MagmaMessageType.info, time: '1s' });
        fixture.detectChanges();

        component.destruct(testMessage);
        expect(messagesService.removeMessage).toHaveBeenCalledWith(testMessage);
        expect(messagesService.testDispose).toHaveBeenCalled();
    });

    it('should update the view after removing a message', () => {
        const testMessage: MagmaMessageInfo = { message: 'Test', type: MagmaMessageType.info, time: '1s' };
        // @ts-ignore: Access readonly property for testing
        messagesService.messages = [testMessage];
        messagesService.onAddMessage.next();
        fixture.detectChanges();

        component.destruct(testMessage);
        fixture.detectChanges();

        const infoMessages = fixture.debugElement.queryAll(By.directive(InfoMessageComponent));
        expect(infoMessages.length).toBe(0);
    });

    it('should trigger change detection when a message is added', fakeAsync(() => {
        spyOn(component['cd'], 'detectChanges');
        messagesService.onAddMessage.next();
        tick();
        expect(component['cd'].detectChanges).toHaveBeenCalled();
    }));
});
