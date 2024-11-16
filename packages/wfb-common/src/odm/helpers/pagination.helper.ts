/**
 * Handles pagination logic and sets the nextPageToken based on the last item.
 * NOTE: this assumes that you have used size = IntendedPageSize + 1 in the query.
 * last item is popped from the response array to check if there are more items.
 * @param response - The array of items fetched from the database.
 * @param intendedSizePlusOne
 * @param comparisonProperty - The property to compare to set the nextPageToken. Default is 'createdAt'.
 * @returns An object containing the paginated data and the nextPageToken.
 * `NextPageToken` is the value of the comparisonProperty of the extra item which was popped out. The nextPageToken should be used with gte,lte operators for fetching the next page.
 * T is the type of the items in the response array.
 */
//! this function will be unable to handle case where 2 records have the same timestamp. Will Address it later.
export function getResponseWithNextPageToken<
    T extends { createdAt: number } | { modifiedAt: number } | { lastActivityAt: number },
>(
    response: T[],
    intendedSizePlusOne: number,
    comparisonProperty: 'createdAt' | 'modifiedAt' | 'lastActivityAt' = 'createdAt',
): { data: T[]; nextPageToken: number | null } {
    let newNextPageToken: number | null = null;

    const hasMoreItems = response.length === intendedSizePlusOne;
    if (hasMoreItems) {
        const lastItem = response[intendedSizePlusOne - 1];
        newNextPageToken = lastItem[comparisonProperty];
        response = response.slice(0, intendedSizePlusOne - 1);
    }

    return {
        data: response,
        nextPageToken: newNextPageToken,
    };
}
