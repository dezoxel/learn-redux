const {createStore, combineReducers} = Redux;
const {Component} = React;

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

// HELPERS ---------------------------------------------------------------------
let newTodoId = 0;

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

// PRESENTATIONAL COMPONENTS ---------------------------------------------------
const Link = ({active, onClick, children}) => {
  if (active) {
    return <span>{children}</span>;
  }

  return <a href='#' onClick={e => {e.preventDefault(); onClick(); }}>{children}</a>;
};

const Todo = ({onClick, completed, text}) => (
  <li onClick={onClick} style={{ textDecoration: completed ? 'line-through' : 'none' }}>{text}</li>
);

const TodoList = ({onTodoClick, todos}) => (
  <ul>
    {todos.map(todo =>
      <Todo key={todo.id} text={todo.text} completed={todo.completed} onClick={() => onTodoClick(todo.id)} />
    )}
  </ul>
);

const FilterPanel = ({store}) => (
  <p>
    Show:
    {' '}
    <FilterLink filter='SHOW_ALL' store={store}>All</FilterLink>
    {' '}
    <FilterLink filter='SHOW_ACTIVE' store={store}>Active</FilterLink>
    {' '}
    <FilterLink filter='SHOW_COMPLETED' store={store}>Completed</FilterLink>
  </p>
);

const TodoApp = ({store}) => (
  <div>
    <FilterPanel store={store} />
    <AddTodo store={store} />
    <VisibleTodoList store={store} />
  </div>
);

// CONTAINER COMPONENTS --------------------------------------------------------
class FilterLink extends Component {
  componentDidMount() {
    const {store} = this.props;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const {filter, children, store} = this.props;
    const currentFilter = store.getState().visibilityFilter;

    const onFilter = (filter) => store.dispatch({type: 'SET_VISIBILITY_FILTER', filter});

    return <Link active={filter === currentFilter} onClick={() => onFilter(filter)}>{children}</Link>;
  }
};

class VisibleTodoList extends Component {
  componentDidMount() {
    const {store} = this.props;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const {store} = this.props;
    const {todos, visibilityFilter} = store.getState();
    const visibleTodos = getVisibleTodos(todos, visibilityFilter);

    const toggleTodo = (id) => store.dispatch({type: 'TOGGLE_TODO', id});

    return <TodoList todos={visibleTodos} onTodoClick={id => toggleTodo(id)}/>;
  }
}

class AddTodo extends Component {
  componentDidMount() {
    const {store} = this.props;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    let input;
    const {store} = this.props;

    const onAdd = () => {
      store.dispatch({type: 'ADD_TODO', id: newTodoId++, text: input.value});
      input.value = '';
    };

    return (
      <div>
        <input ref={node => {input = node}} />
        <button onClick={() => onAdd()}>Add todo</button>
      </div>
    );
  }
};

// BOOTSTRAP -------------------------------------------------------------------
const render = () => {
  const store = createStore(combineReducers({
    todos: todosReducer,
    visibilityFilter: visibilityFilterReducer
  }));

  ReactDOM.render(<TodoApp store={store} />, document.getElementById('root'));
};

render();

