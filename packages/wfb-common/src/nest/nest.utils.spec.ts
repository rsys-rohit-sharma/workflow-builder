import 'reflect-metadata';

import { MockAppModule } from './mock/mock.module';
import { getRoutesFromModule } from './nest.utils';

describe('getRoutesFromModule', () => {
    it('should return correct routes', () => {
        const routes = getRoutesFromModule(MockAppModule);

        expect(routes).toEqual(['/cats/route1', '/dogs/route1']);
        expect(routes.length).toBe(2);
    });
});
