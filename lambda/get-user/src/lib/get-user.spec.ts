import { getUser } from './get-user';

describe('getUser', () => {
  it('should work', () => {
    expect(getUser()).toEqual('get-user');
  });
});
