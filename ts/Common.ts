const CELL_SIZE : number = 3;
const CELL_HEIGHT : number = 2.5;

enum Direction {
    Up,
    Down,
    Left,
    Right,
    Count
}

enum CameraMovementType{
    Walk,
    Rotate
}

function inverseDirection(dir: Direction): Direction {
    switch(dir) {
        case Direction.Up:    return Direction.Down;
        case Direction.Down:  return Direction.Up;
        case Direction.Left:  return Direction.Right;
        case Direction.Right: return Direction.Left;
    }
    return Direction.Count;
}

function randint(max: number): number {
    return Math.round(Math.random() * max);
}

function shuffleArray(arr: any[]) {
    arr.sort(() => Math.random() - 0.5);
}