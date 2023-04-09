import NodeElement from "./NodeElement";

export default function childExists(children: [NodeElement], combination: string) {
  for (let i = 0; i < children.length; i++) {
    if (children[i].combination === combination) return i;
  }
  return false;
}
