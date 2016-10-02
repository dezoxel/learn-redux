const {createStore} = Redux;

const Counter = ({value, onIncrement, onDecrement}) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
)

const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
    default:
      return state;
  }
}

const store = createStore(counterReducer);

const render = () => {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() => store.dispatch({type: 'increment'})}
      onDecrement={() => store.dispatch({type: 'decrement'})}
    />,
    document.getElementById('root')
  );
};
store.subscribe(render);
render();

