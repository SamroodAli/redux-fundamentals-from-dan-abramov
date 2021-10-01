import { createStore } from "redux";
import Reducer from "./reducers";
import ReactDOM from "react-dom";
import "./styles.css";
import { Component } from "react";
import { Provider, connect } from "react-redux";

const Todo = ({ completed, onClick, text }) => (
  <li
    style={{ textDecoration: completed ? "line-through" : "none" }}
    onClick={onClick}
  >
    {text}
  </li>
);

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case "SHOW_ACTIVE":
      return todos.filter((todo) => !todo.completed);
    case "SHOW_COMPLETED":
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
};

const TodoList = ({ todos, onTodoClick }) => {
  return todos.map((todo) => (
    <Todo key={todo.id} onClick={() => onTodoClick(todo.id)} {...todo} />
  ));
};

const Link = ({ active, onClick, children }) => {
  if (active) {
    return <span>{children}</span>;
  }
  return (
    <button
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </button>
  );
};

class FilterLink extends Component {
  onClick = () => {
    this.props.onClick(this.props.filter);
  };

  render() {
    const active = this.props.visibilityFilter === this.props.filter;
    return (
      <Link active={active} onClick={this.onClick}>
        {this.props.children}
      </Link>
    );
  }
}

const AddTodo = ({ onClick }) => {
  let input;
  return (
    <>
      <input ref={(node) => (input = node)} />
      <button onClick={() => onClick(input)}>Add Todo</button>
    </>
  );
};

const AddTotoContainer = connect(null, (dispatch) => {
  return {
    onClick: (input) => {
      store.dispatch({
        type: "ADD_TODO",
        id: store.getState().counter,
        text: input.value
      });
      input.value = "";
    }
  };
})(AddTodo);

const NavLinks = ({ filters, currentFilter, onClick, store }) => {
  return filters.map((item) => (
    <FilterLink
      filter={item.value}
      key={item.value}
      currentFilter={currentFilter}
      onClick={onClick}
    >
      {item.text}
    </FilterLink>
  ));
};

const mapStateToPropsForNavLinks = ({ visibilityFilter }) => {
  return {
    currentFilter: visibilityFilter,
    filters: [
      { value: "SHOW_ALL", text: "All" },
      { value: "SHOW_COMPLETED", text: "Completed" },
      { value: "SHOW_ACTIVE", text: "Active" }
    ]
  };
};

const mapDispatchToPropsForNavLinks = (dispatch) => {
  return {
    onClick: (filter) => {
      dispatch({
        type: "SET_VISIBILITY_FILTER",
        filter
      });
    }
  };
};

const NavLinksContainer = connect(
  mapStateToPropsForNavLinks,
  mapDispatchToPropsForNavLinks
)(NavLinks);

const mapStateToPropsForTodos = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  };
};

const mapDispatchToPropsforTodos = (dispatch) => {
  return {
    onTodoClick: (id) => dispatch({ type: "TOGGLE_TODO", id })
  };
};

const TodoListContainer = connect(
  mapStateToPropsForTodos,
  mapDispatchToPropsforTodos
)(TodoList);

const App = () => {
  return (
    <div>
      <AddTotoContainer />
      <NavLinksContainer />
      <TodoListContainer />
    </div>
  );
};

const store = createStore(Reducer);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

store.subscribe(() => {
  console.log(store.getState());
});
