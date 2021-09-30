import { combineReducers } from "redux";

export const todo = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return { id: action.id, text: action.text, completed: false };
    case "TOGGLE_TODO":
      if (state.id !== action.id) {
        return state;
      }
      return { id: state.id, text: state.text, completed: !state.completed };
    default:
      return state;
  }
};

export const todos = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, todo(state, action)];
    case "TOGGLE_TODO":
      return state.map((todoState) => todo(todoState, action));
    default:
      return state;
  }
};

export const visibilityFilter = (state = "SHOW_ALL", action) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
  }
};

export const counter = (state = 0, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return state + 1;
    default:
      return state;
  }
};

const Reducer = combineReducers({ todos, visibilityFilter, counter });

export default Reducer;
