let expect = require('expect');

const counter = (state = 0, action) => {
  switch (action.type) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
    default:
      return state;
  }
}

expect(counter(0, {type: 'increment'})).toEqual(1);
expect(counter(1, {type: 'increment'})).toEqual(2);
expect(counter(2, {type: 'decrement'})).toEqual(1);
expect(counter(1, {type: 'decrement'})).toEqual(0);
expect(counter(1, {type: 'hello world'})).toEqual(1);
expect(counter(undefined, {})).toEqual(0);

console.log('tests passed!');
