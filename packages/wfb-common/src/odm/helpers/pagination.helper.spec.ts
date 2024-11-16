import { getResponseWithNextPageToken } from './pagination.helper';

describe('getResponseWithNextPageToken', () => {
    it('should return the response with the next page token', () => {
        const response = [{ createdAt: 1627832400000 }, { createdAt: 1627832500000 }, { createdAt: 1627832600000 }];
        const intendedSizePlusOne = 3;
        const comparisonProperty = 'createdAt';

        const result = getResponseWithNextPageToken(response, intendedSizePlusOne, comparisonProperty);

        expect(result.data).toEqual([response[0], response[1]]);
        expect(result.nextPageToken).toBe(1627832600000);
    });

    it('should return the response without the next page token default comparison property', () => {
        const response = [{ createdAt: 1627832400000 }, { createdAt: 1627832500000 }];
        const intendedSizePlusOne = 3;

        const result = getResponseWithNextPageToken(response, intendedSizePlusOne);

        expect(result.data).toEqual(response);
        expect(result.nextPageToken).toBeNull();
    });
});
