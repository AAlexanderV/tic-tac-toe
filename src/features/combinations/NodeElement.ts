export default class NodeElement {
  public combination: string;
  public lose: boolean;
  public children: [];

  public constructor(combination: string) {
    this.combination = combination;
    this.lose = false;
    this.children = [];
  }
}
