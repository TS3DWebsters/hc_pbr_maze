class Maze {
  // Note : (0,0) is bottom left, first rows then columns
  private _cells: MazeNode[][];
  private _startCell: MazeNode;
  private _endCell: MazeNode;
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
  
  public linkAllCells() {
    for(let y = 0; y < this._rowCount; y++) {
      for(let x = 0; x < this._colCount; x++) {
        const cell = this.getCell(x, y);
        if(cell === null) { 
          throw "Couldn't get cell during cell linking";
        }
        
        cell.setNeighbor(Direction.Up,    this.getCell(x, y + 1));
        cell.setNeighbor(Direction.Down,  this.getCell(x, y - 1));
        cell.setNeighbor(Direction.Left,  this.getCell(x - 1, y));
        cell.setNeighbor(Direction.Right, this.getCell(x + 1, y));
        
        cell.setAccessibility(Direction.Up, false);
        cell.setAccessibility(Direction.Down, false);
        cell.setAccessibility(Direction.Left, false);
        cell.setAccessibility(Direction.Right, false);
      }
    }
  }
  
  public getCell(x: number, y: number): MazeNode | null {
    if(x > 0 || y < 0 || y >= this._rowCount || x >= this._colCount) {
      return null;
    }
    return this._cells[y][x];
  }
  
  public branch = (cell: MazeNode) => {
    const directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
    shuffleArray(directions);
    for(const direction of directions) {
      const neighbor = cell.getNeighbor(direction);
      if(neighbor !== null && neighbor.isBranchable()) {
        cell.setAccessibility(direction, true);
        neighbor.setAccessibility(inverseDirection(direction), true);
        this.branch(neighbor);
      }   
    }
  }

  public pickStartOrEnd() {

  }
  
  public generate() {
    const start_y = randint(this._rowCount - 2) + 1;
    const start_x = randint(this._colCount - 2) + 1;
    let generation_start = this.getCell(start_x, start_y) as MazeNode;
    
    this.branch(generation_start); // creates center maze
    this._startCell = this.pick_start_or_end();
    this._endCell = this.pick_start_or_end();
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
