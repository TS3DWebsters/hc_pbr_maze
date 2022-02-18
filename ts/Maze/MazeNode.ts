/// <reference path="../HWV/hoops_web_viewer.d.ts" />

class MazeNode
{
    private _coordinates = Communicator.Point2;
    private _neighbors: Map<Direction, MazeNode | null> = new Map();
    private _accessability: Map<Direction, boolean>;
    
    constructor(coordinates : Communicator.Point2){
        this._coordinates = coordinates;
        this._accessability = new Map([
            [Direction.Up, false],
            [Direction.Down, false],
            [Direction.Left, false],
            [Direction.Right, false]
        ]);
    }
    
    public x() : number{
        return this._coordinates.x;
    }
    
    public y() : number{
        return this._coordinates.y;
    }
    
    public setNeighbor(dir: Direction, cell: MazeNode | null) {
        this._neighbors.set(dir, cell)
    }
    
    public getNeighbor(dir: Direction): MazeNode | null {
        const neighbor = this._neighbors.get(dir);
        if(neighbor === undefined) {
            return null;
        }
        return neighbor;
    }
    
    public setAccessibility(dir: Direction, access: boolean) {
        this._accessability.set(dir, access);
    }
    
    public getAccessibility(dir: Direction): boolean {
        const access = this._accessability.get(dir);
        if(access === undefined) {
            return false;
        }
        return access;
    }
    
    public isEdgeCell(): boolean {
        let n_neighbors = 0;
        this._neighbors.forEach((neighbor) => {
            if(neighbor !== undefined) {
                n_neighbors++;
            }
        });
        return n_neighbors !== 4;
    }
    
    public isConnected(): boolean {
        let n_branches = 0;
        this._accessability.forEach((accessible) => {
            if(accessible) {
                n_branches++;
            }
        });
        return n_branches !== 0;
    }
    
    public isBranchable(): boolean {
        // Only branch into nodes that aren't edge_nodes and that can't be gotten to yet
        if(this.isEdgeCell() || this.isConnected()) {
            return false;
        }
        return true;
    }
}