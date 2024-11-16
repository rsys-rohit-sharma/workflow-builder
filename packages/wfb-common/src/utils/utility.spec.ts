import { WfbRequest } from '../types';
import {
    commaSeparatedStringToArray,
    elapsedTime,
    getHeaders,
    getSchemaPaths,
    getUniqueStrings,
    stripNulls,
} from './utility';

describe('utility', () => {
    describe('elapsedTime', () => {
        jest.useFakeTimers();
        it('should calculate elapsed time correctly', () => {
            const startHrTime: [number, number] = process.hrtime();

            // Simulate some time passing
            // For example, you can use Jest's fake timers
            jest.advanceTimersByTime(1000); // advance time by 1000 milliseconds

            const result = elapsedTime(startHrTime);

            // Assuming the elapsed time is within a reasonable range
            expect(result).toBeGreaterThanOrEqual(1000);
            expect(result).toBeLessThanOrEqual(1100); // Allow some margin for execution time differences
        });
    });

    describe('getHeaders', () => {
        it('should return the correct headers', () => {
            const context = {
                accountId: '123',
                userId: '123',
                userRole: '123',
                host: 'https://api.example.com',
                feHost: 'https://example.com',
            };

            const result = getHeaders(context);

            expect(result).toEqual({
                'x-smtip-f-host': 'https://example.com',
                'x-smtip-host': 'https://api.example.com',
                'x-smtip-tenant-user-role': '123',
                'x-smtip-tid': '123',
                'x-smtip-uid': '123',
            });
        });
    });

    describe('getSchemaPaths', () => {
        it('should return the correct schema path for a given request', () => {
            const mockRequest = {
                method: 'GET',
                baseUrl: '/api',
                path: '/v1/resource',
            } as WfbRequest;

            const result = getSchemaPaths(mockRequest);
            expect(result).toBe('GET_/api/v1/resource');
        });

        it('should handle requests with no baseUrl correctly', () => {
            const mockRequest = {
                method: 'POST',
                baseUrl: '',
                path: '/v1/resource',
            } as WfbRequest;

            const result = getSchemaPaths(mockRequest);
            expect(result).toBe('POST_/v1/resource');
        });

        it('should handle requests with complex paths correctly', () => {
            const mockRequest = {
                method: 'PUT',
                baseUrl: '/api/v2',
                path: '/resource/subresource',
            } as WfbRequest;

            const result = getSchemaPaths(mockRequest);
            expect(result).toBe('PUT_/api/v2/resource/subresource');
        });
    });

    describe('commaSeparatedStringToArray', () => {
        it('should convert comma-separated string to an array of trimmed strings', () => {
            const input = 'apple, banana,   orange,   mango';
            const result = commaSeparatedStringToArray(input);
            expect(result).toEqual(['apple', 'banana', 'orange', 'mango']);
        });

        it('should handle empty string input', () => {
            const input = '';
            const result = commaSeparatedStringToArray(input);
            expect(result).toEqual([]);
        });

        it('should handle input with leading and trailing spaces', () => {
            const input = '  apple, banana,   orange,   mango  ';
            const result = commaSeparatedStringToArray(input);
            expect(result).toEqual(['apple', 'banana', 'orange', 'mango']);
        });

        it('should handle input with multiple consecutive commas', () => {
            const input = 'apple,,,banana,,,,orange';
            const result = commaSeparatedStringToArray(input);
            expect(result).toEqual(['apple', 'banana', 'orange']);
        });
    });

    describe('getUniqueStrings', () => {
        it('should return an array with unique strings', () => {
            const arr = ['apple', 'banana', 'orange', 'apple', 'mango', 'banana'];
            const result = getUniqueStrings(arr);
            expect(result).toEqual(['apple', 'banana', 'orange', 'mango']);
        });

        it('should return an empty array if input array is empty', () => {
            const arr: string[] = [];
            const result = getUniqueStrings(arr);
            expect(result).toEqual([]);
        });

        it('should return the same array if all elements are unique', () => {
            const arr = ['apple', 'banana', 'orange', 'mango'];
            const result = getUniqueStrings(arr);
            expect(result).toEqual(arr);
        });
    });

    describe('stripNulls', () => {
        it('should remove null and undefined values from the object', () => {
            const obj = {
                name: 'John',
                age: 30,
                address: null,
                phone: undefined,
                hobbies: ['reading', null, 'swimming'],
                details: {
                    email: 'john@example.com',
                    city: null,
                },
            };

            const result = stripNulls(obj);

            expect(result).toEqual({
                name: 'John',
                age: 30,
                hobbies: ['reading', 'swimming'],
                details: {
                    email: 'john@example.com',
                },
            });
        });

        it('should handle nested objects and arrays', () => {
            const obj = {
                name: 'John',
                address: {
                    street: '123 Main St',
                    city: null,
                    country: 'USA',
                },
                friends: [
                    {
                        name: 'John',
                        age: 25,
                        address: null,
                    },
                    {
                        name: 'Doe',
                        age: 28,
                        address: {
                            street: '456 Elm St',
                            city: 'New York',
                            country: null,
                        },
                    },
                ],
            };

            const result = stripNulls(obj);

            expect(result).toEqual({
                name: 'John',
                address: {
                    street: '123 Main St',
                    country: 'USA',
                },
                friends: [
                    {
                        name: 'John',
                        age: 25,
                    },
                    {
                        name: 'Doe',
                        age: 28,
                        address: {
                            street: '456 Elm St',
                            city: 'New York',
                        },
                    },
                ],
            });
        });

        it('should handle empty objects and arrays', () => {
            const obj = {
                emptyObj: {},
                emptyArr: [],
            };

            const result = stripNulls(obj);

            expect(result).toEqual({
                emptyObj: {},
                emptyArr: [],
            });
        });
    });
});
