import { Injectable } from '@angular/core';

import { Observable, firstValueFrom } from 'rxjs';

import { flattenedListItems } from '../utils/array';

@Injectable({ providedIn: 'root' })
export class MagmaCache {
    private static cache: Record<
        string,
        { id: string; group: string[]; value?: any; wait?: true; observable?: Observable<any>; endDate?: Date }
    > = {};

    async request<T>(id: string, group: string | string[], observable: Observable<T>, endDate?: Date) {
        if (MagmaCache.cache[id]?.endDate && new Date().getTime() > MagmaCache.cache[id].endDate.getTime()) {
            this.clearById(id);
        }

        group = flattenedListItems(group);

        if (MagmaCache.cache[id] && !('wait' in MagmaCache.cache[id])) {
            return MagmaCache.cache[id].value as T;
        } else if (MagmaCache.cache[id] && 'wait' in MagmaCache.cache[id]) {
            MagmaCache.cache[id] = { id, group, endDate, wait: true, observable };
            return await firstValueFrom<T>(observable);
        } else {
            MagmaCache.cache[id] = { id, group, endDate, wait: true, observable };
            const value = await firstValueFrom<T>(observable);
            if (MagmaCache.cache[id].wait) {
                MagmaCache.cache[id] = { id, group, value };
            }
            return value;
        }
    }

    clearAll() {
        MagmaCache.cache = {};
    }

    clearById(id: string) {
        if (MagmaCache.cache[id]) {
            delete MagmaCache.cache[id];
        }
    }

    clearByGroupName(groupName: string) {
        Object.entries(MagmaCache.cache)
            .filter(([_id, value]) => value.group?.includes(groupName))
            .map(([id, _value]) => id)
            .forEach(id => this.clearById(id));
    }
}
