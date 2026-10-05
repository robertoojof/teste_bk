import { Entity } from '../../entity';

type StubProps = {
  prop1: string;

  prop2: number;
};

function validateUuid(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {
  it('Should set props and id', () => {
    const props = { prop1: 'value1', prop2: 2 };
    const entity = new StubEntity(props);

    expect(entity.props).toEqual(props);
    expect(entity._id).not.toBeNull();
    expect(validateUuid(entity._id)).toBeTruthy();
  });

  it('Should use the provided id instead of generating a new one', () => {
    const props = { prop1: 'value1', prop2: 2 };
    const id = '123e4567-e89b-12d3-a456-426614174000';
    const entity = new StubEntity(props, id);

    expect(entity._id).toBe(id);
  });

  it('Should convert to JSON', () => {
    const props = { prop1: 'value1', prop2: 2 };
    const entity = new StubEntity(props);

    const json = entity.toJSON();

    expect(json).toEqual({
      ...props,
      id: entity._id,
    });
  });
});
