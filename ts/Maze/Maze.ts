class Maze {
  // Note : (0,0) is bottom left, first rows then columns
  private _cells: MazeNode[][];
  private _colCount: number;
  private _rowCount: number;

  constructor(rowCount: number, colCount: number) {
    this._colCount = colCount;
    this._rowCount = rowCount;
    this._cells = new Array<Array<MazeNode>>();

    for (let rowIndex = 0; rowIndex < rowCount; ++rowIndex) {
      let row: MazeNode[] = new Array<MazeNode>();
      for (let colIndex = 0; colIndex < colCount; ++colIndex) {
        row.push(new MazeNode(new Communicator.Point2(colIndex, rowIndex)));
      }
      this._cells.push(row);
    }
  }

  public getRowCount(): number {
    return this._rowCount;
  }

  public getColCount(): number {
    return this._colCount;
  }

  public getNodeAtCoord(x: number, y: number): MazeNode | null {
    let node: MazeNode | null = null;

    if (x >= 0 && x < this._colCount && y >= 0 && y < this._rowCount) {
      node = this._cells[y][x];
    }

    return node;
  }
}
