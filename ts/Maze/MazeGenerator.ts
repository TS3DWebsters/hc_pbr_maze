class MazeGenerator {
  public static generateProcedurally(): Maze {
    // TODO : Zachary
    return new Maze(0, 0);
  }

  public static generateHardcoded(): Maze {
    let rowCount = 30;
    let colCount = 50;
    let maze = new Maze(rowCount, colCount);

    // Each node will create its down / right relations and fill according left / up of related nodes.
    for (let row = 0; row < rowCount; ++row) {
      for (let col = 0; col < colCount; ++col) {
        let currentNode: MazeNode | null = maze.getNodeAtCoord(col, row);

        if (currentNode != null) {
          let rightNode: MazeNode | null = maze.getNodeAtCoord(col + 1, row);
          let downNode: MazeNode | null = maze.getNodeAtCoord(col, row + 1);

          // Note about random wall draw
          // 25% chances => [0,74] = free, [75,100] = wall

          if (rightNode != null) {

            let random: number = Math.floor(Math.random() * 100);
            let hasWall: boolean = random >= 75;

            let relation: MazeNodeRelation = new MazeNodeRelation(
              currentNode,
              rightNode,
              !hasWall
            );
          
            currentNode.setRightRelation(relation, MazeNodeIndex.First);
            rightNode.setLeftRelation(relation, MazeNodeIndex.Second);
        }

        if(downNode != null){
            let random: number = Math.floor(Math.random() * 100);
            let hasWall: boolean = random >= 75;

            let relation: MazeNodeRelation = new MazeNodeRelation(
              currentNode,
              downNode,
              !hasWall
            );
          
            currentNode.setDownRelation(relation, MazeNodeIndex.First);
            downNode.setUpRelation(relation, MazeNodeIndex.Second);
        }
        }
        else{
            throw "Current node is not supposed to be null";
        }
      }
    }

    return maze;
  }
}
