// REDUCERS --------------------------------------------------------------------
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

// TESTS -----------------------------------------------------------------------
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

// BOOTSTRAP -------------------------------------------------------------------
const {createStore, combineReducers} = Redux;
const {Component} = React;

const store = createStore(combineReducers({
  todos: todosReducer,
  visibilityFilter: visibilityFilterReducer
}));

// VIEW ------------------------------------------------------------------------
let newTodoId = 0;
const addTodo = (text) => {
  store.dispatch({type: 'ADD_TODO', id: newTodoId++, text});
};

class TodoApp extends Component {
  onAddTodo() {
    this.props.onAddTodo(this.input.value);
    this.input.value = '';
  }

  render() {
    return (
      <div>
        <input ref={node => {this.input = node}} />

        <button onClick={this.onAddTodo.bind(this)}>Add todo</button>

        <ul>
          {this.props.todos.map(todo =>
            <li key={todo.id}>{todo.text}</li>
          )}
        </ul>
      </div>
    );
  }
}

const render = () => {
  ReactDOM.render(
    <TodoApp
      todos={store.getState().todos}
      onAddTodo={addTodo}>
    </TodoApp>,
    document.getElementById('root')
  );
};

store.subscribe(render);
render();
