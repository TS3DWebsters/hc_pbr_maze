class MazeNodeRelationSlot {
  private _relation: MazeNodeRelation | null;
  private _nodeIndex: MazeNodeIndex | null;

  constructor() {
    this._relation = null;
    this._nodeIndex = null;
  }

  public isPathFree(): boolean {
    return this._relation != null ? this._relation.isPathFree() : false;
  }

  public getRelatedNode(): MazeNode | null {
    let node = null;

    if (this._relation != null && this._nodeIndex != null) {
      switch (this._nodeIndex) {
        case MazeNodeIndex.First:
          node = this._relation.getNode(MazeNodeIndex.Second);
          break;

        case MazeNodeIndex.Second:
          node = this._relation.getNode(MazeNodeIndex.First);
          break;
      }
    }

    return node;
  }

  public set(relation : MazeNodeRelation, index : MazeNodeIndex){
      this._relation = relation;
      this._nodeIndex = index;
  }
}
