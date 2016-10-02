const expect = require('expect');

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

const createStore = (reducer) => {
  let state = 0;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  dispatch({});

  return {getState, dispatch, subscribe};
}

const store = createStore(counterReducer);

const render = () => console.log(store.getState());
store.subscribe(render);
render();

setInterval(() => {
  store.dispatch({type: 'increment'});
}, 1000);
