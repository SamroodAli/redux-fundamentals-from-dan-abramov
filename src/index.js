import { createStore } from "redux";
import Reducer from "./reducers";
import ReactDOM from "react-dom";
import "./styles.css";
import { Provider, connect } from "react-redux";

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

const mapStateToPropsForNavLinks = (state, ownProps) => {
  return {
    active: state.visibilityFilter === ownProps.filter
  };
};

const mapDispatchToPropsForNavLinks = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch({
        type: "SET_VISIBILITY_FILTER",
        filter: ownProps.filter
      });
    }
  };
};

const FilterLink = ({ active, onClick, children }) => {
  return (
    <Link active={active} onClick={onClick}>
      {children}
    </Link>
  );
};

const FilterLinksContainer = connect(
  mapStateToPropsForNavLinks,
  mapDispatchToPropsForNavLinks
)(FilterLink);

const NavLinks = () => {
  const filters = [
    { value: "SHOW_ALL", text: "All" },
    { value: "SHOW_COMPLETED", text: "Completed" },
    { value: "SHOW_ACTIVE", text: "Active" }
  ];

  return filters.map((item) => (
    <FilterLinksContainer key={item.value} filter={item.value}>
      {item.text}
    </FilterLinksContainer>
  ));
};

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

const AddTodo = ({ dispatch }) => {
  let input;
  return (
    <>
      <input ref={(node) => (input = node)} />
      <button
        onClick={() => {
          dispatch({
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

const AddTotoContainer = connect()(AddTodo);

const App = () => {
  return (
    <div>
      <AddTotoContainer />
      <NavLinks />
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
