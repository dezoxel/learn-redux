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

const toggleTodo = (id) => {
  store.dispatch({type: 'TOGGLE_TODO', id});
};

const onFilter = (filter) => {
  store.dispatch({type: 'SET_VISIBILITY_FILTER', filter});
};

const FilterLink = ({filter, currentFilter, onFilter, children}) => {
  if (filter === currentFilter) {
    return <span>{children}</span>;
  }

  return (
    <a href='#' onClick={e => {
      e.preventDefault();
      onFilter(filter);
    }}>{children}</a>
  );
};

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed);
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed);
    default:
      return [];
  }
};

class TodoApp extends Component {
  onAdd() {
    this.props.onAdd(this.input.value);
    this.input.value = '';
  }

  render() {
    const {todos, visibilityFilter} = this.props;
    const visibleTodos = getVisibleTodos(todos, visibilityFilter);
    return (
      <div>
        <p>
          Show:
          {' '}
          <FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter} onFilter={onFilter}>All</FilterLink>
          {' '}
          <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter} onFilter={onFilter}>Active</FilterLink>
          {' '}
          <FilterLink filter='SHOW_COMPLETED' currentFilter={visibilityFilter} onFilter={onFilter}>Completed</FilterLink>
        </p>
        <input ref={node => {this.input = node}} />

        <button onClick={this.onAdd.bind(this)}>Add todo</button>

        <ul>
          {visibleTodos.map(todo =>
            <li key={todo.id} onClick={() => this.props.onToggle(todo.id)}
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.text}
            </li>
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
      visibilityFilter={store.getState().visibilityFilter}
      onAdd={addTodo}
      onToggle={toggleTodo}
      >
    </TodoApp>,
    document.getElementById('root')
  );
};

store.subscribe(render);
render();
