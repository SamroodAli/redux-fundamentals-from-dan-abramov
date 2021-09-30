import { todos } from "../reducers";
import deepfreeze from "deepfreeze";

test("add todo should add a todo to state tree", () => {
  const stateBefore = [];

  const action = {
    type: "ADD_TODO",
    id: 0,
    text: "Learn Redux"
  };

  const stateAfter = [
    {
      id: 0,
      text: "Learn Redux",
      completed: false
    }
  ];
  deepfreeze(stateBefore);
  deepfreeze(action);
  expect(todos(stateBefore, action)).toEqual(stateAfter);
});

test("toggle todo from false to true ", () => {
  const stateBefore = [
    {
      id: 0,
      text: "I am finished",
      completed: false
    }
  ];

  const stateAfter = [
    {
      id: 0,
      text: "I am finished",
      completed: true
    }
  ];

  const action = {
    type: "TOGGLE_TODO",
    id: 0
  };

  deepfreeze(stateBefore);
  deepfreeze(stateAfter);
  expect(todos(stateBefore, action)).toEqual(stateAfter);
});
