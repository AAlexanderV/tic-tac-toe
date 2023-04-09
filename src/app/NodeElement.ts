export default class NodeElement {
  public combination: string;
  public status: string;
  public children: [];

  public constructor(combination: string) {
    this.combination = combination;
    this.status = "green";
    this.children = [];
  }
}
