/// <reference path="ts/HWV/hoops_web_viewer.d.ts" />
declare class Main {
    private _containerId;
    private _hwv;
    private _maze;
    constructor();
    private _initResizeEventHandler;
}
declare class Maze {
    private _cells;
    private _colCount;
    private _rowCount;
    constructor(rowCount: number, colCount: number);
    getRowCount(): number;
    getColCount(): number;
    getNodeAtCoord(x: number, y: number): MazeNode | null;
}
declare class MazeGenerator {
    static generateProcedurally(): Maze;
    static generateHardcoded(): Maze;
}
declare class MazeNode {
    private _coordinates;
    private _leftRelation;
    private _upRelation;
    private _downRelation;
    private _rightRelation;
    constructor(coordinates: Communicator.Point2);
    x(): number;
    y(): number;
    setLeftRelation(relation: MazeNodeRelation, index: MazeNodeIndex): void;
    setRightRelation(relation: MazeNodeRelation, index: MazeNodeIndex): void;
    setUpRelation(relation: MazeNodeRelation, index: MazeNodeIndex): void;
    setDownRelation(relation: MazeNodeRelation, index: MazeNodeIndex): void;
    getLeftRelation(): MazeNodeRelationSlot;
    getRightRelation(): MazeNodeRelationSlot;
    getUpRelation(): MazeNodeRelationSlot;
    getDownRelation(): MazeNodeRelationSlot;
}
declare enum MazeNodeIndex {
    First = 0,
    Second = 1
}
declare class MazeNodeRelation {
    private _node1;
    private _node2;
    private _pathIsFree;
    constructor(node1: MazeNode, node2: MazeNode, pathIsFree: boolean);
    getNode(nodeIndex: MazeNodeIndex): MazeNode;
    isPathFree(): boolean;
}
declare class MazeNodeRelationSlot {
    private _relation;
    private _nodeIndex;
    constructor();
    isPathFree(): boolean;
    getRelatedNode(): MazeNode | null;
    set(relation: MazeNodeRelation, index: MazeNodeIndex): void;
}
declare class MazeRenderer {
    static loadImage(viewer: Communicator.WebViewer, filename: string): Promise<[number, number]>;
    static setNodeTexture(viewer: Communicator.WebViewer, nodeId: Communicator.NodeId, imageId: Communicator.ImageId): void;
    static createMazeMesh(maze: Maze, viewer: Communicator.WebViewer, rootNodeId: Communicator.NodeId): Promise<void>;
}
