import { createUser } from './create-user';

describe('createUser', () => {
  it('should work', () => {
    expect(createUser()).toEqual('create-user');
  });
});
