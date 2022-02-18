class MazeNodeRelation {
  private _node1: MazeNode;
  private _node2: MazeNode;
  private _pathIsFree: boolean;

  constructor(node1: MazeNode, node2: MazeNode, pathIsFree: boolean) {
    this._node1 = node1;
    this._node2 = node2;
    this._pathIsFree = pathIsFree;
  }

  public getNode(nodeIndex: MazeNodeIndex) : MazeNode
  {
    switch (nodeIndex) {
      case MazeNodeIndex.First:
        return this._node1;

      case MazeNodeIndex.Second:
        return this._node2;
    }
  }

  public isPathFree() : boolean{
      return this._pathIsFree;
  }
}
