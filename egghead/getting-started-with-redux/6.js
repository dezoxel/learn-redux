const expect = require('expect');
const {createStore} = require('redux');

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

const render = () => console.log(store.getState());
store.subscribe(render);
render();

setInterval(() => {
  store.dispatch({type: 'increment'});
}, 1000);
