import { createSlice } from "@reduxjs/toolkit";
import Node from "./NodeElement";
import childExists from "./childExists";

const initialState = () => {
  const initialNode = new Node("-----------");
  const combinationsTree = JSON.parse(
    localStorage.getItem("combinationsTree") || JSON.stringify(initialNode)
  );

  const currentCombination = combinationsTree;

  return { combinationsTree, currentCombination };
};

export const combinationsSlice = createSlice({
  name: "combinations",
  initialState,
  reducers: {
    setCurrentCombination: (state: any, action) => {
      const childIndex = childExists(state.currentCombination.children, action.payload);

      if (childIndex) {
        state.currentCombination = state.currentCombination.children[childIndex];
      } else {
        const child = new Node(action.payload);
        state.currentCombination.children.push(child);
        state.currentCombination = child;

        localStorage.setItem("combinationsTree", JSON.stringify(state.combinationsTree));
      }
    },

    makeMove: (state: any, action) => {
      localStorage.setItem("combinationsTree", JSON.stringify(state.combinationsTree));
    },
  },
});

export const { makeMove, setCurrentCombination } = combinationsSlice.actions;

export default combinationsSlice.reducer;
