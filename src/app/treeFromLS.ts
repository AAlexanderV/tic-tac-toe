import NodeElement from "./NodeElement";

function treeFromLS() {
  const root = JSON.parse(
    localStorage.getItem("combinationsTree") || JSON.stringify(new NodeElement("---------"))
  );

  return root;
}

export default treeFromLS();
