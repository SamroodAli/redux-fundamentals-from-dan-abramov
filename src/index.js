import { createStore } from "redux";
import Reducer from "./reducers";
import ReactDOM from "react-dom";
import "./styles.css";
import { Component } from "react";
import { createContext, useContext } from "react";
const Store = createContext();

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
    const store = this.context;
    this.unsubscribe = store.subscribe(() => {
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
    const state = this.context.getState();
    const active = state.visibilityFilter === this.props.filter;
    return (
      <Link active={active} onClick={this.onClick}>
        {this.props.children}
      </Link>
    );
  }
}
FilterLink.contextType = Store;

const AddTodo = () => {
  let input;
  const store = useContext(Store);
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
      filter={item.value}
      key={item.value}
      currentFilter={currentFilter}
      onClick={onClick}
    >
      {item.text}
    </FilterLink>
  ));
};

const NavLinksContainer = () => {
  const store = useContext(Store);
  const { visibilityFilter } = store.getState();
  const filters = [
    { value: "SHOW_ALL", text: "All" },
    { value: "SHOW_COMPLETED", text: "Completed" },
    { value: "SHOW_ACTIVE", text: "Active" }
  ];

  return (
    <NavLinks
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
    const store = this.context;
    this.unsubscribe = store.subscribe = () => {
      this.forceUpdate();
    };
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const store = this.context;
    const { todos, visibilityFilter } = store.getState();
    return (
      <TodoList
        todos={getVisibleTodos(todos, visibilityFilter)}
        onTodoClick={(id) => store.dispatch({ type: "TOGGLE_TODO", id })}
      />
    );
  }
}

TodoListContainer.contextType = Store;

const App = () => {
  return (
    <div>
      <AddTodo />
      <NavLinksContainer />
      <TodoListContainer />
    </div>
  );
};

ReactDOM.render(
  <Store.Provider value={createStore(Reducer)}>
    <App />
  </Store.Provider>,
  document.getElementById("root")
);
