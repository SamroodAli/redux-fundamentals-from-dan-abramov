import { createStore } from "redux";
import Store from "./reducers";
import ReactDOM from "react-dom";
import "./styles.css";
import { Component } from "react";

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
  componentDidMount() {
    this.unsubscribe = this.props.store.subscribe(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onClick = () => {
    this.props.onClick(this.props.filter);
  };

  render() {
    const state = this.props.store.getState();
    const props = this.props;
    const active = state.visibilityFilter === props.filter;
    return (
      <Link active={active} onClick={this.onClick}>
        {this.props.children}
      </Link>
    );
  }
}
const AddTodo = ({ store }) => {
  let input;
  return (
    <>
      <input ref={(node) => (input = node)} />
      <button
        onClick={() => {
          store.dispatch({
            type: "ADD_TODO",
            id: store.getState().counter,
            text: input.value
          });
          input.value = "";
        }}
      >
        Add Todo
      </button>
    </>
  );
};

const NavLinks = ({ filters, currentFilter, onClick, store }) => {
  return filters.map((item) => (
    <FilterLink
      store={store}
      filter={item.value}
      key={item.value}
      currentFilter={currentFilter}
      onClick={onClick}
    >
      {item.text}
    </FilterLink>
  ));
};

const NavLinksContainer = ({ store }) => {
  const { visibilityFilter } = store.getState();
  const filters = [
    { value: "SHOW_ALL", text: "All" },
    { value: "SHOW_COMPLETED", text: "Completed" },
    { value: "SHOW_ACTIVE", text: "Active" }
  ];

  return (
    <NavLinks
      store={store}
      filters={filters}
      currentFilter={visibilityFilter}
      onClick={(filter) => {
        store.dispatch({
          type: "SET_VISIBILITY_FILTER",
          filter
        });
      }}
    />
  );
};

class TodoListContainer extends Component {
  componentDidMount() {
    this.unsubscribe = this.props.store.subscribe = () => {
      this.forceUpdate();
    };
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const store = this.props.store;
    const state = store.getState();
    return (
      <TodoList
        todos={getVisibleTodos(state.todos, state.visibilityFilter)}
        onTodoClick={(id) => store.dispatch({ type: "TOGGLE_TODO", id })}
      />
    );
  }
}

const App = ({ store }) => {
  return (
    <div>
      <AddTodo store={store} />
      <NavLinksContainer store={store} />
      <TodoListContainer store={store} />
    </div>
  );
};

ReactDOM.render(
  <App store={createStore(Store)} />,
  document.getElementById("root")
);
