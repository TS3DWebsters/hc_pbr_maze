enum Direction {
    Up,
    Down,
    Left,
    Right
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