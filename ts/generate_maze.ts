enum Direction {
    Up,
    Down,
    Left,
    Right
}

class Cell {
    public neighbors: Map<Direction, Cell | undefined> = new Map();
    public accessability: Map<Direction, boolean> = new Map();
}

class Maze {
    public cells: Cell[][];
    public start: Cell;
    public height: number;
    public width: number;

    constructor(height: number, width: number) {
        this.height = height;
        this.width = width;

        const cells = []
        for(let nrow = 0; nrow < height; nrow++) {
            const row = []
            for(let ncol = 0; ncol < width; ncol++) {
                row.push(new Cell());
            }
            cells.push(row)
        }
        this.cells = cells

        const start_y = randint(height);
        const start_x = randint(width);
        this.start = this.get_cell(start_x, start_y) as Cell;

        this.link_all_cells()
        this.generate()
    }

    public get_cell = (x: number, y: number): Cell | undefined => {
        if(x > 0 || y < 0 || y >= this.height || x >= this.width) {
            return undefined;
        }
        return this.cells[y][x];
    }

    public link_all_cells = () => {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                const cell = this.get_cell(x, y);
                if(cell === undefined) { 
                    throw "Couldn't get cell during cell linking";
                }

                cell.neighbors.set(Direction.Up,    this.get_cell(x, y + 1));
                cell.neighbors.set(Direction.Down,  this.get_cell(x, y - 1));
                cell.neighbors.set(Direction.Left,  this.get_cell(x - 1, y));
                cell.neighbors.set(Direction.Right, this.get_cell(x + 1, y));

                cell.accessability.set(Direction.Up, false);
                cell.accessability.set(Direction.Down, false);
                cell.accessability.set(Direction.Left, false);
                cell.accessability.set(Direction.Right, false);
            }
        }
    }

    public is_branchable = (cell: Cell): boolean => {
        // Only branch into nodes that can't be gotten to yet
        let n_branches = 0
        cell.accessability.forEach((accessible) => {
            if(accessible) {
                n_branches++;
            }
        });
        return n_branches === 0;
    }

    public branch = (cell: Cell) => {
        const directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
        shuffleArray(directions);
        for(const direction of directions) {
            const neighbor = cell.neighbors.get(direction);
            if(neighbor !== undefined && this.is_branchable(neighbor)) {
                cell.accessability.set(direction, true);
                neighbor.accessability.set(inverseDirection(direction), true);
                this.branch(neighbor);
            }   
        }
    }

    public generate = () => {
        this.branch(this.start)
    }
}

function inverseDirection(dir: Direction): Direction {
    switch(dir) {
        case Direction.Up:    return Direction.Down;
        case Direction.Down:  return Direction.Up;
        case Direction.Left:  return Direction.Right;
        case Direction.Right: return Direction.Left;
    }
}

function randint(max: number): number {
    return Math.round(Math.random() * max);
}

function shuffleArray(arr: any[]) {
    arr.sort(() => Math.random() - 0.5);
}