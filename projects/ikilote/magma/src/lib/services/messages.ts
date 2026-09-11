import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Service, Type, inject } from '@angular/core';

import { Subject } from 'rxjs';

import { MagmaOverlayPosition, overlayPositionKey } from '../utils/position';

// ── Types ────────────────────────────────────────────────────────────────────

export enum MagmaMessageType {
    info = 'info',
    success = 'success',
    warn = 'warn',
    error = 'error',
    tip = 'tip',
}

export type MagmaMessageContent = string | { component: Type<unknown>; input?: Record<string, unknown> };

export interface MagmaMessageInfo {
    message: MagmaMessageContent;
    type: MagmaMessageType;
    time: string;
    /** Zone this message belongs to. */
    zone: string;
}

/** Configuration for a named message zone. */
export interface MagmaMessageZoneConfig {
    /** CDK global position for this zone's overlay. */
    position: MagmaOverlayPosition;
}

/** Internal overlay bucket: one CDK overlay shared by all zones with the same position. */
interface OverlayBucket {
    overlayRef: OverlayRef;
    /** Zone ids whose position maps to this bucket. */
    zoneIds: Set<string>;
}

// ── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_ZONE = 'default';
const DEFAULT_POSITION: MagmaOverlayPosition = { bottom: '10px', right: '10px' };

// ── Service ──────────────────────────────────────────────────────────────────

/**
 * Service to display stacked floating messages via CDK Overlay.
 *
 * Supports multiple named **zones**, each with its own screen position.
 * Zones that share the same position are grouped into a single overlay
 * to avoid layout conflicts.
 *
 * @example — default usage (backward-compatible)
 * ```ts
 * messages.addMessage('Saved!', { type: MagmaMessageType.success });
 * ```
 *
 * @example — named zones
 * ```ts
 * messages.addZone('top-right', { position: { top: '10px', right: '10px' } });
 * messages.addMessage('New notification', { zone: 'top-right' });
 * ```
 */
@Service()
export class MagmaMessages {
    private readonly overlay = inject(Overlay);

    /** All messages across all zones. */
    readonly messages: MagmaMessageInfo[] = [];

    /** Emits whenever a message is added. */
    readonly onAddMessage = new Subject<void>();

    /** zone id → position config */
    private readonly zones = new Map<string, MagmaMessageZoneConfig>();

    /** positionKey → overlay bucket */
    private readonly buckets = new Map<string, OverlayBucket>();

    // ── Public API ────────────────────────────────────────────────────────────

    /**
     * Register a named display zone with its screen position.
     * If a zone with the same id already exists, its config is updated.
     * Zones sharing an identical position will reuse the same overlay.
     */
    addZone(id: string, config: MagmaMessageZoneConfig): void {
        this.zones.set(id, config);
    }

    /**
     * Add a floating message.
     *
     * @param message  Text or dynamic component to display.
     * @param options  Optional type, duration and target zone.
     */
    addMessage(
        message: MagmaMessageContent,
        options: { type?: MagmaMessageType; time?: string; zone?: string } = {},
    ): void {
        const zone = options.zone ?? DEFAULT_ZONE;

        // Ensure the target zone exists (auto-create 'default' on first use).
        if (!this.zones.has(zone)) {
            if (zone === DEFAULT_ZONE) {
                this.zones.set(DEFAULT_ZONE, { position: DEFAULT_POSITION });
            } else {
                console.warn(`MagmaMessages: zone "${zone}" is not registered. Call addZone() first.`);
                return;
            }
        }

        const info: MagmaMessageInfo = {
            message,
            type: options.type ?? MagmaMessageType.info,
            time: options.time ?? '3s',
            zone,
        };

        this.messages.push(info);
        this.ensureBucket(zone);
        this.onAddMessage.next();
    }

    /** Remove a single message. Disposes the overlay bucket if it becomes empty. */
    removeMessage(message: MagmaMessageInfo): void {
        const idx = this.messages.indexOf(message);
        if (idx !== -1) {
            this.messages.splice(idx, 1);
        }
    }

    /** Remove all messages. */
    clearMessages(): void {
        if (this.messages.length) {
            this.messages.splice(0, this.messages.length);
        }
    }

    /**
     * Dispose the overlay bucket for the given zone if no messages remain in it.
     * Called by the component after each removal.
     */
    testDispose(zone: string = DEFAULT_ZONE): void {
        const hasRemaining = this.messages.some(m => m.zone === zone);
        if (hasRemaining) {
            return;
        }

        const config = this.zones.get(zone);
        if (!config) {
            return;
        }

        const key = overlayPositionKey(config.position);
        const bucket = this.buckets.get(key);
        if (!bucket) {
            return;
        }

        // Only dispose if no message from ANY zone in this bucket remains.
        const bucketHasMessages = this.messages.some(m => {
            const mConfig = this.zones.get(m.zone);
            return mConfig && overlayPositionKey(mConfig.position) === key;
        });

        if (!bucketHasMessages) {
            bucket.overlayRef.dispose();
            this.buckets.delete(key);
        }
    }

    /**
     * Messages belonging to a specific zone (used by `MagmaInfoMessagesComponent`).
     */
    messagesForZones(zoneIds: Set<string>): MagmaMessageInfo[] {
        return this.messages.filter(m => zoneIds.has(m.zone));
    }

    // ── Private ───────────────────────────────────────────────────────────────

    /**
     * Ensure an overlay bucket exists for the given zone.
     * If a bucket already exists at the same position, re-use it and register
     * the zone in its set so the component filters correctly.
     */
    private ensureBucket(zoneId: string): void {
        const config = this.zones.get(zoneId)!;
        const key = overlayPositionKey(config.position);

        if (this.buckets.has(key)) {
            this.buckets.get(key)!.zoneIds.add(zoneId);
            return;
        }

        // Build CDK position strategy from MagmaOverlayPosition.
        const pos = config.position;
        let strategy = this.overlay.position().global();
        if (pos.top !== undefined) strategy = strategy.top(pos.top);
        if (pos.bottom !== undefined) strategy = strategy.bottom(pos.bottom);
        if (pos.left !== undefined) strategy = strategy.left(pos.left);
        if (pos.right !== undefined) strategy = strategy.right(pos.right);
        if (pos.centerHorizontally !== undefined) strategy = strategy.centerHorizontally(pos.centerHorizontally);
        if (pos.centerVertically !== undefined) strategy = strategy.centerVertically(pos.centerVertically);

        const overlayRef = this.overlay.create({
            hasBackdrop: false,
            panelClass: 'overlay-message',
            scrollStrategy: this.overlay.scrollStrategies.noop(),
            positionStrategy: strategy,
        });

        // Lazy-import to avoid circular deps at module load time.
        import('../components/info-messages/info-messages.component').then(({ MagmaInfoMessagesComponent }) => {
            const portal = new ComponentPortal(MagmaInfoMessagesComponent);
            const ref = overlayRef.attach(portal);
            ref.setInput('zoneIds', new Set([zoneId]));
            ref.setInput('position', pos);

            const bucket = this.buckets.get(key);
            if (bucket) {
                // Bucket was already created by a concurrent call; update component input.
                bucket.zoneIds.add(zoneId);
                ref.setInput('zoneIds', new Set(bucket.zoneIds));
            }
        });

        const bucket: OverlayBucket = {
            overlayRef,
            zoneIds: new Set([zoneId]),
        };
        this.buckets.set(key, bucket);
    }
}
