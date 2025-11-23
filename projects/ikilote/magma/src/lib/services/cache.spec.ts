import { Observable, delay, of } from 'rxjs';

import { MagmaCache } from './cache';

describe('MagmaCache', () => {
    let cache: MagmaCache;
    const mockObservable = <T>(value: T, delayMs = 0): Observable<T> => of(value).pipe(delay(delayMs));

    beforeEach(() => {
        cache = new MagmaCache();
        // Reset cache before each test
        (MagmaCache as any).cache = {};
    });

    describe('request', () => {
        it('should return cached value if not expired and not waiting', async () => {
            const id = 'test1';
            const group = ['group1'];
            const value = { data: 'cached' };
            (MagmaCache as any).cache[id] = { id, group, value }; // mock
            const result = await cache.request(id, group, mockObservable(value));
            expect(result).toEqual(value);
        });

        it('should clear and re-fetch if cache is expired', async () => {
            const id = 'test2';
            const group = ['group1'];
            const value = { data: 'new' };
            const expiredDate = new Date(Date.now() - 1000);
            (MagmaCache as any).cache[id] = { id, group, value, endDate: expiredDate }; // mock
            const spy = spyOn(cache, 'clearById').and.callThrough();
            const result = await cache.request(id, group, mockObservable(value));
            expect(spy).toHaveBeenCalledWith(id);
            expect(result).toEqual(value);
        });

        it('should wait and return observable result if cache is marked as waiting', async () => {
            const id = 'test3';
            const group = ['group1'];
            const value = { data: 'waiting' };
            (MagmaCache as any).cache[id] = { id, group, wait: true, observable: mockObservable(value) }; // mock
            const result = await cache.request(id, group, mockObservable(value));
            expect(result).toEqual(value);
        });

        it('should fetch, cache, and return value if not in cache', async () => {
            const id = 'test4';
            const group = ['group1'];
            const value = { data: 'fresh' };
            const result = await cache.request(id, group, mockObservable(value));
            expect(result).toEqual(value);
            expect((MagmaCache as any).cache[id].value).toEqual(value);
        });

        it('should handle groups as a string', async () => {
            const id = 'test5';
            const group = 'group1,group2';
            const value = { data: 'flattened' };
            const result = await cache.request(id, group, mockObservable(value));
            expect(result).toEqual(value);
            expect((MagmaCache as any).cache[id].group).toEqual(['group1', 'group2']);
        });
    });

    describe('clearAll', () => {
        it('should clear the entire cache', () => {
            (MagmaCache as any).cache = {
                test6: { id: 'test6', group: ['group1'], value: { data: 'item1' } },
                test7: { id: 'test7', group: ['group2'], value: { data: 'item2' } },
            };
            cache.clearAll();
            expect((MagmaCache as any).cache).toEqual({});
        });
    });

    describe('clearById', () => {
        it('should remove the cached item by id', () => {
            const id = 'test6';
            (MagmaCache as any).cache[id] = { id, group: ['group1'], value: { data: 'to-be-cleared' } }; // mock
            cache.clearById(id);
            expect((MagmaCache as any).cache[id]).toBeUndefined();
        });

        it('should do nothing if id does not exist', () => {
            const id = 'test7';
            cache.clearById(id);
            expect((MagmaCache as any).cache[id]).toBeUndefined();
        });
    });

    describe('clearByGroupName', () => {
        it('should remove all cached items in the specified group', () => {
            const groupName = 'group2';
            (MagmaCache as any).cache = {
                // mock
                test8: { id: 'test8', group: [groupName], value: { data: 'group-item1' } },
                test9: { id: 'test9', group: [groupName], value: { data: 'group-item2' } },
                test10: { id: 'test10', group: ['other-group'], value: { data: 'other-item' } },
            };
            cache.clearByGroupName(groupName);
            expect((MagmaCache as any).cache['test8']).toBeUndefined();
            expect((MagmaCache as any).cache['test9']).toBeUndefined();
            expect((MagmaCache as any).cache['test10']).toBeDefined();
        });

        it('should do nothing if no items are in the specified group', () => {
            const groupName = 'empty-group';
            (MagmaCache as any).cache = {
                // mock
                test11: { id: 'test11', group: ['other-group'], value: { data: 'other-item' } },
            };
            cache.clearByGroupName(groupName);
            expect((MagmaCache as any).cache['test11']).toBeDefined();
        });
    });
});
