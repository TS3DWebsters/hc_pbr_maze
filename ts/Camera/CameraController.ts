/*class CameraController{
    private _camera : Communicator.Camera;
    private _maze : Maze;
    private _directionAvailability : Array<[Direction, boolean]>;

    private _originNode : MazeNode;
    private _destinationNode : MazeNode;
    private _currentDirection : Direction;

    private _currentMovementType : CameraMovementType;
    
    // Ratio [0..1] for interpolation between origin node and target node, or during rotation.
    private _moveRatio : number;

    constructor(camera : Communicator.Camera, maze : Maze){
        this._camera = camera;
        this._maze = maze;

        this._directionAvailability = new Array<[Direction, boolean]>();
        this._directionAvailability.push([Direction.Up, false]);
        this._directionAvailability.push([Direction.Right, false]);
        this._directionAvailability.push([Direction.Left, false]);
        this._directionAvailability.push([Direction.Down, false]);

        this._currentMovementType = CameraMovementType.Walk;

        let startNode : MazeNode = this._maze.getStartNode();
        this._originNode = startNode;
        this._destinationNode = startNode;
        this._currentDirection = Direction.Count;

        // flag the current movement as finished to trigger next move search.
        this._moveRatio = 1;    
        
        this._camera.setPosition(startNode.getWorld3dCenter());
        
        this._findNextMovement();
    }

    public run() : void {
        
    }

    private _updateAvailableDirections() : void{
                
        for(let directionIndex : Direction = 0; directionIndex < Direction.Count; ++directionIndex){
            let isAvailable:boolean = this._destinationNode.getAccessibility(this._directionAvailability[directionIndex][0]);
            this._directionAvailability[directionIndex][1] = isAvailable;
        }
    }

    private _findNextMovement() : void{

        // Update the availability array from target node.
        this._updateAvailableDirections();
        
        // Shuffle the direction availabilities and sort them
        // in order to have available direction first.
        shuffleArray(this._directionAvailability);
        this._directionAvailability.sort((a,b) => {
            if(a[1] && !b[1]) return 1;
            if(!a[1] && b[1]) return -1;
            return 0;
        });

        // no direction available ? = cell surrounded by walls, should not happen
        if(!this._directionAvailability[0][1])
            throw "Camera is stuck";

        // We take care of not going to where we come, expected if the camera is stuck.
        let oppositeCurrentDirection = inverseDirection(this._currentDirection);

        // The first available direction is not from where we come, go for it!
        if(this._directionAvailability[0][0] != oppositeCurrentDirection) {
            this._initializeNewDirection(this._directionAvailability[0][0]);
        } else {
            // Here the first available direction is from where we come :
            // 1) If another direction is available, go for it.
            // 2) If no other direction is available, the camera is in a dead end, go from where we come

            if(this._directionAvailability[1][1]){
                // other direction is available
                this._initializeNewDirection(this._directionAvailability[1][0]);
            } else {
                // dead end
                this._initializeNewDirection(this._directionAvailability[0][0]);
            }
        }
    }

    private _initializeNewDirection(newDirection : Direction) : void{
        
        // First init
        if(this._currentDirection == Direction.Count){
            this._currentDirection = newDirection;
        }

        let nextNode = this._destinationNode.getNeighbor(newDirection);

        if(newDirection == this._currentDirection){
            // Continue to go forward

        } else {
            // Rotate
        }

        this._currentDirection = newDirection;

        switch(this._currentDirection){
            case Direction.Up :
                this._camera.setTarget()
        }
    }

    private _update() : void {
    }
}*/