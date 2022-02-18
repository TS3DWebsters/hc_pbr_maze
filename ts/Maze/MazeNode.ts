/// <reference path="../HWV/hoops_web_viewer.d.ts" />

class MazeNode
{
    private _coordinates : Communicator.Point2;
    private _leftRelation : MazeNodeRelationSlot;
    private _upRelation : MazeNodeRelationSlot;
    private _downRelation : MazeNodeRelationSlot;
    private _rightRelation : MazeNodeRelationSlot;
    
    constructor(coordinates : Communicator.Point2){
        this._coordinates = coordinates;
        this._leftRelation = new MazeNodeRelationSlot();
        this._upRelation = new MazeNodeRelationSlot();
        this._downRelation = new MazeNodeRelationSlot();
        this._rightRelation = new MazeNodeRelationSlot();
   }

    public x() : number{
        return this._coordinates.x;
    }

    public y() : number{
        return this._coordinates.y;
    }

    public setLeftRelation(relation : MazeNodeRelation, index : MazeNodeIndex) : void {
        this._leftRelation.set(relation, index);
    }

    public setRightRelation(relation : MazeNodeRelation, index : MazeNodeIndex) : void{
        this._rightRelation.set(relation, index);
    }

    public setUpRelation(relation : MazeNodeRelation, index : MazeNodeIndex) : void{
        this._upRelation.set(relation, index);
    }

    public setDownRelation(relation : MazeNodeRelation, index : MazeNodeIndex) : void{
        this._downRelation.set(relation, index);
    }

    public getLeftRelation() : MazeNodeRelationSlot{
        return this._leftRelation;
    }

    public getRightRelation() : MazeNodeRelationSlot{
        return this._rightRelation;
    }
    
    public getUpRelation() : MazeNodeRelationSlot{
        return this._upRelation;
    }
    
    public getDownRelation() : MazeNodeRelationSlot{
        return this._downRelation;
    }
}