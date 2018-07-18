// @flow
import type { HALEntity } from '../hal-resource-types';

export const pickLinkedEntities = (entities: HALEntity[], key: string): Promise<HALEntity[]> =>
    Promise.all(entities.filter(entity => entity[key]).map(entity => (entity[key]: any).getOne()));

export const pickLinkedEntitiesGroups = (
    entities: HALEntity[],
    key: string,
): Promise<HALEntity[][]> =>
    Promise.all(entities.filter(entity => entity[key]).map(entity => (entity[key]: any).getList()));
