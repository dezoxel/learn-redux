const addCounter = (list) => {
  return [...list, 0];
};

const removeCounter = (list, index) => {
  return [
    ...list.slice(0, index),
    ...list.slice(index + 1)
  ];
};

const incrementCounter = (list, index) => {
  return [
    ...list.slice(0, index),
    list[index] + 1,
    ...list.slice(index + 1)
  ];
};

const toggleTodo = (todo) => {
  return Object.assign({}, todo, {completed: !todo.completed});
};

const testAddCounter = () => {
  const listBefore = [];
  const listAfter = [0];

  deepFreeze(listBefore);

  expect(addCounter(listBefore)).toEqual(listAfter);
}

const testRemoveCounter = () => {
  const listBefore = [1, 2, 3];
  const listAfter = [1, 3];

  deepFreeze(listBefore);

  expect(removeCounter(listBefore, 1)).toEqual(listAfter);
};

const testIncrementCounter = () => {
  const listBefore = [1, 2, 3];
  const listAfter = [1, 3, 3];

  deepFreeze(listBefore);

  expect(incrementCounter(listBefore, 1)).toEqual(listAfter);
};

const testToggleTodo = () => {
  const todoBefore = {
    id: 1,
    text: 'learn redux',
    completed: false
  };

  const todoAfter = {
    id: 1,
    text: 'learn redux',
    completed: true
  };

  deepFreeze(todoBefore);

  expect(toggleTodo(todoBefore)).toEqual(todoAfter);
};

testAddCounter();
testRemoveCounter();
testIncrementCounter();
testToggleTodo();

console.log('Tests passed');