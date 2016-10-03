const todoReducer = (todo, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (todo.id !== action.id) {
        return todo;
      }

      return Object.assign({}, todo, {completed: !todo.completed});
    default:
      return todo;
  }
};

const todosReducer = (todos = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...todos,
        todoReducer(null, action)
      ];
    case 'TOGGLE_TODO':
      return todos.map(todo => todoReducer(todo, action));
    default:
      return todos;
  }
};

const visibilityFilterReducer = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const testAddTodo = () => {
  const stateBefore = [];
  const action = {
    type: 'ADD_TODO',
    id: 1,
    text: 'learn redux'
  };

  const stateAfter = [{
    id: 1,
    text: 'learn redux',
    completed: false
  }];

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(todosReducer(stateBefore, action)).toEqual(stateAfter);
}

const testToggleTodo = () => {
  const stateBefore = [{
    id: 1,
    text: 'learn redux',
    completed: false
  }, {
    id: 2,
    text: 'keep going',
    completed: false
  }];

  const action = {type: 'TOGGLE_TODO', id: 2};

  const stateAfter = [{
    id: 1,
    text: 'learn redux',
    completed: false
  }, {
    id: 2,
    text: 'keep going',
    completed: true
  }];

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(todosReducer(stateBefore, action)).toEqual(stateAfter);
};

testAddTodo();
testToggleTodo();
console.log('Tests passed');

const {createStore, combineReducers} = Redux;

const store = createStore(combineReducers({
  todos: todosReducer,
  visibilityFilter: visibilityFilterReducer
}));

store.subscribe(() => {
  console.log('Current state:');
  console.log(store.getState());
  console.log('--------------');
});

console.log('Initial state:');
console.log(store.getState());
console.log('--------------');

console.log('ADD_TODO');
store.dispatch({type: 'ADD_TODO', id: 0, text: 'learn redux'});

console.log('ADD_TODO');
store.dispatch({type: 'ADD_TODO', id: 1, text: 'keep going'});

console.log('TOGGLE_TODO');
store.dispatch({type: 'TOGGLE_TODO', id: 1});

console.log('SET_VISIBILITY_FILTER');
store.dispatch({type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_COMPLETED'});
