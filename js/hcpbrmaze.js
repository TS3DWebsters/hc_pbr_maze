/// <reference path="HWV/hoops_web_viewer.d.ts" />
var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        this._containerId = "viewer";
        this._hwv = new Communicator.WebViewer({
            containerId: this._containerId,
        });
        this._maze = null;
        this._hwv.setCallbacks({
            sceneReady: function () {
                _this._hwv.view.setBackgroundColor(Communicator.Color.blue(), Communicator.Color.white());
                _this._initResizeEventHandler();
                _this._maze = MazeGenerator.generateHardcoded();
                MazeRenderer.createMazeMesh(_this._maze, _this._hwv, _this._hwv.model.getAbsoluteRootNode());
            },
            selectionArray: function (selectionEvents) {
                var selectionIds = selectionEvents.map(function (sEvent) { return sEvent.getSelection().getNodeId(); });
                for (var selectionId in selectionIds) {
                    console.log(">>>> " + selectionId);
                }
            },
        });
        this._hwv.start();
    }
    Main.prototype._initResizeEventHandler = function () {
        var _this = this;
        window.addEventListener("resize", function () {
            _this._hwv.resizeCanvas();
        });
        this._hwv.resizeCanvas();
    };
    return Main;
}());
var Maze = /** @class */ (function () {
    function Maze(rowCount, colCount) {
        this._colCount = colCount;
        this._rowCount = rowCount;
        this._cells = new Array();
        for (var rowIndex = 0; rowIndex < rowCount; ++rowIndex) {
            var row = new Array();
            for (var colIndex = 0; colIndex < colCount; ++colIndex) {
                row.push(new MazeNode(new Communicator.Point2(colIndex, rowIndex)));
            }
            this._cells.push(row);
        }
    }
    Maze.prototype.getRowCount = function () {
        return this._rowCount;
    };
    Maze.prototype.getColCount = function () {
        return this._colCount;
    };
    Maze.prototype.getNodeAtCoord = function (x, y) {
        var node = null;
        if (x >= 0 && x < this._colCount && y >= 0 && y < this._rowCount) {
            node = this._cells[y][x];
        }
        return node;
    };
    return Maze;
}());
var MazeGenerator = /** @class */ (function () {
    function MazeGenerator() {
    }
    MazeGenerator.generateProcedurally = function () {
        // TODO : Zachary
        return new Maze(0, 0);
    };
    MazeGenerator.generateHardcoded = function () {
        var rowCount = 30;
        var colCount = 50;
        var maze = new Maze(rowCount, colCount);
        // Each node will create its down / right relations and fill according left / up of related nodes.
        for (var row = 0; row < rowCount; ++row) {
            for (var col = 0; col < colCount; ++col) {
                var currentNode = maze.getNodeAtCoord(col, row);
                if (currentNode != null) {
                    var rightNode = maze.getNodeAtCoord(col + 1, row);
                    var downNode = maze.getNodeAtCoord(col, row + 1);
                    // Note about random wall draw
                    // 25% chances => [0,74] = free, [75,100] = wall
                    if (rightNode != null) {
                        var random = Math.floor(Math.random() * 100);
                        var hasWall = random >= 75;
                        var relation = new MazeNodeRelation(currentNode, rightNode, !hasWall);
                        currentNode.setRightRelation(relation, MazeNodeIndex.First);
                        rightNode.setLeftRelation(relation, MazeNodeIndex.Second);
                    }
                    if (downNode != null) {
                        var random = Math.floor(Math.random() * 100);
                        var hasWall = random >= 75;
                        var relation = new MazeNodeRelation(currentNode, downNode, !hasWall);
                        currentNode.setDownRelation(relation, MazeNodeIndex.First);
                        downNode.setUpRelation(relation, MazeNodeIndex.Second);
                    }
                }
                else {
                    throw "Current node is not supposed to be null";
                }
            }
        }
        return maze;
    };
    return MazeGenerator;
}());
/// <reference path="../HWV/hoops_web_viewer.d.ts" />
var MazeNode = /** @class */ (function () {
    function MazeNode(coordinates) {
        this._coordinates = coordinates;
        this._leftRelation = new MazeNodeRelationSlot();
        this._upRelation = new MazeNodeRelationSlot();
        this._downRelation = new MazeNodeRelationSlot();
        this._rightRelation = new MazeNodeRelationSlot();
    }
    MazeNode.prototype.x = function () {
        return this._coordinates.x;
    };
    MazeNode.prototype.y = function () {
        return this._coordinates.y;
    };
    MazeNode.prototype.setLeftRelation = function (relation, index) {
        this._leftRelation.set(relation, index);
    };
    MazeNode.prototype.setRightRelation = function (relation, index) {
        this._rightRelation.set(relation, index);
    };
    MazeNode.prototype.setUpRelation = function (relation, index) {
        this._upRelation.set(relation, index);
    };
    MazeNode.prototype.setDownRelation = function (relation, index) {
        this._downRelation.set(relation, index);
    };
    MazeNode.prototype.getLeftRelation = function () {
        return this._leftRelation;
    };
    MazeNode.prototype.getRightRelation = function () {
        return this._rightRelation;
    };
    MazeNode.prototype.getUpRelation = function () {
        return this._upRelation;
    };
    MazeNode.prototype.getDownRelation = function () {
        return this._downRelation;
    };
    return MazeNode;
}());
var MazeNodeIndex;
(function (MazeNodeIndex) {
    MazeNodeIndex[MazeNodeIndex["First"] = 0] = "First";
    MazeNodeIndex[MazeNodeIndex["Second"] = 1] = "Second";
})(MazeNodeIndex || (MazeNodeIndex = {}));
var MazeNodeRelation = /** @class */ (function () {
    function MazeNodeRelation(node1, node2, pathIsFree) {
        this._node1 = node1;
        this._node2 = node2;
        this._pathIsFree = pathIsFree;
    }
    MazeNodeRelation.prototype.getNode = function (nodeIndex) {
        switch (nodeIndex) {
            case MazeNodeIndex.First:
                return this._node1;
            case MazeNodeIndex.Second:
                return this._node2;
        }
    };
    MazeNodeRelation.prototype.isPathFree = function () {
        return this._pathIsFree;
    };
    return MazeNodeRelation;
}());
var MazeNodeRelationSlot = /** @class */ (function () {
    function MazeNodeRelationSlot() {
        this._relation = null;
        this._nodeIndex = null;
    }
    MazeNodeRelationSlot.prototype.isPathFree = function () {
        return this._relation != null ? this._relation.isPathFree() : false;
    };
    MazeNodeRelationSlot.prototype.getRelatedNode = function () {
        var node = null;
        if (this._relation != null && this._nodeIndex != null) {
            switch (this._nodeIndex) {
                case MazeNodeIndex.First:
                    node = this._relation.getNode(MazeNodeIndex.Second);
                    break;
                case MazeNodeIndex.Second:
                    node = this._relation.getNode(MazeNodeIndex.First);
                    break;
            }
        }
        return node;
    };
    MazeNodeRelationSlot.prototype.set = function (relation, index) {
        this._relation = relation;
        this._nodeIndex = index;
    };
    return MazeNodeRelationSlot;
}());
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var MazeRenderer = /** @class */ (function () {
    function MazeRenderer() {
    }
    MazeRenderer.loadImage = function (viewer, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var p, request, imageOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        p = new Promise(function (resolve, reject) {
                            var request = new XMLHttpRequest();
                            request.open("GET", filename, true);
                            request.responseType = "arraybuffer";
                            request.onload = function () {
                                if (request.readyState === 4) {
                                    if (request.status === 200) {
                                        resolve(request);
                                    }
                                }
                            };
                            request.onerror = function (event) {
                                reject(event);
                            };
                            request.send();
                        });
                        return [4 /*yield*/, p];
                    case 1:
                        request = _a.sent();
                        imageOptions = {
                            format: Communicator.ImageFormat.Jpeg,
                            data: new Uint8Array(request.response),
                        };
                        return [2 /*return*/, viewer.model.createImage(imageOptions)];
                }
            });
        });
    };
    MazeRenderer.setNodeTexture = function (viewer, nodeId, imageId) {
        if (nodeId !== null) {
            var textureOptions = {
                imageId: imageId,
                modifiers: Communicator.TextureModifier.Decal
            };
            viewer.model.setNodesTexture([nodeId], textureOptions);
        }
    };
    MazeRenderer.createMazeMesh = function (maze, viewer, rootNodeId) {
        return __awaiter(this, void 0, void 0, function () {
            var rockColorImageId, brickColorImageId, meshesRootNodeId, cellSize, floorTileFilepath, wallStraightTileFilepath, floorTilesNodesIds, wallStraightNodesIds, floorTileModelNodeId, wallStraightModelNodeId, floorTileRootNodeId, floorTileMeshIds, wallStraightMeshIds, rowIndex, colIndex, netMatrix, meshInstanceData, rowIndex, colIndex, node, leftSlot, modelMatrix, meshInstanceData, upSlot, modelMatrix, meshInstanceData, downSlot, modelMatrix, meshInstanceData, rightSlot, modelMatrix, meshInstanceData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MazeRenderer.loadImage(viewer, "data/textures/rock_color.jpg")];
                    case 1:
                        rockColorImageId = _a.sent();
                        return [4 /*yield*/, MazeRenderer.loadImage(viewer, "data/textures/brick_color.jpg")];
                    case 2:
                        brickColorImageId = _a.sent();
                        meshesRootNodeId = viewer.model.createNode(rootNodeId, "MeshesRoot");
                        cellSize = 2;
                        floorTileFilepath = "data/models/floor.scs";
                        wallStraightTileFilepath = "data/models/wall_straight.scs";
                        // Load scs models
                        viewer.model.setEnableAutomaticUnitScaling(false);
                        return [4 /*yield*/, viewer.model.loadSubtreeFromScsFile(meshesRootNodeId, floorTileFilepath)];
                    case 3:
                        floorTilesNodesIds = _a.sent();
                        return [4 /*yield*/, viewer.model.loadSubtreeFromScsFile(meshesRootNodeId, wallStraightTileFilepath)];
                    case 4:
                        wallStraightNodesIds = _a.sent();
                        // Results should contain only one NodeId
                        if (floorTilesNodesIds.length != 1)
                            throw "Invalid floor tile model";
                        if (wallStraightNodesIds.length != 1)
                            throw "Invalid wall straight model";
                        floorTileModelNodeId = floorTilesNodesIds[0];
                        wallStraightModelNodeId = wallStraightNodesIds[0];
                        floorTileRootNodeId = viewer.model.createNode(rootNodeId, "FloorTiles");
                        return [4 /*yield*/, viewer.model.getMeshIds([floorTileModelNodeId])];
                    case 5:
                        floorTileMeshIds = _a.sent();
                        return [4 /*yield*/, viewer.model.getMeshIds([wallStraightModelNodeId])];
                    case 6:
                        wallStraightMeshIds = _a.sent();
                        // We still expect only one meshId
                        if (floorTileMeshIds.length != 1)
                            throw "Invalid floor tile model";
                        if (wallStraightMeshIds.length != 1)
                            throw "Invalid wall straight model";
                        // UNOPTIMIZED : For each cell instanciate a floor tile.
                        for (rowIndex = 0; rowIndex < maze.getRowCount(); ++rowIndex) {
                            for (colIndex = 0; colIndex < maze.getColCount(); ++colIndex) {
                                netMatrix = viewer.model.getNodeNetMatrix(floorTileRootNodeId);
                                netMatrix.m[12] = cellSize * colIndex;
                                netMatrix.m[13] = 0;
                                netMatrix.m[14] = cellSize * rowIndex;
                                meshInstanceData = new Communicator.MeshInstanceData(floorTileMeshIds[0], netMatrix, "Floor Tile Instance", null, null, null, Communicator.MeshInstanceCreationFlags.DoNotUseVertexColors);
                                viewer.model.createMeshInstance(meshInstanceData).then(function (nodeId) {
                                    MazeRenderer.setNodeTexture(viewer, nodeId, rockColorImageId);
                                });
                            }
                        }
                        // Each cell check for up and left wall.
                        // Last row and last column check for respectively for botton and right walls.
                        for (rowIndex = 0; rowIndex < maze.getRowCount(); ++rowIndex) {
                            for (colIndex = 0; colIndex < maze.getColCount(); ++colIndex) {
                                node = maze.getNodeAtCoord(colIndex, rowIndex);
                                if (node != null) {
                                    leftSlot = node.getLeftRelation();
                                    if (!leftSlot.isPathFree()) {
                                        modelMatrix = Communicator.Matrix.yAxisRotation(90);
                                        modelMatrix = modelMatrix.setTranslationComponent(cellSize * colIndex - cellSize * 0.5, 0, cellSize * rowIndex);
                                        meshInstanceData = new Communicator.MeshInstanceData(wallStraightMeshIds[0], modelMatrix, "Straight Wall Instance", null, null, null, Communicator.MeshInstanceCreationFlags.DoNotUseVertexColors);
                                        viewer.model.createMeshInstance(meshInstanceData).then(function (nodeId) {
                                            MazeRenderer.setNodeTexture(viewer, nodeId, brickColorImageId);
                                        });
                                    }
                                    upSlot = node.getUpRelation();
                                    if (!upSlot.isPathFree()) {
                                        modelMatrix = Communicator.Matrix.yAxisRotation(0);
                                        modelMatrix = modelMatrix.setTranslationComponent(cellSize * colIndex, 0, cellSize * rowIndex - cellSize * 0.5);
                                        meshInstanceData = new Communicator.MeshInstanceData(wallStraightMeshIds[0], modelMatrix, "Straight Wall Instance", null, null, null, Communicator.MeshInstanceCreationFlags.DoNotUseVertexColors);
                                        viewer.model.createMeshInstance(meshInstanceData).then(function (nodeId) {
                                            MazeRenderer.setNodeTexture(viewer, nodeId, brickColorImageId);
                                        });
                                    }
                                    if (rowIndex == maze.getRowCount() - 1) {
                                        downSlot = node.getDownRelation();
                                        if (!downSlot.isPathFree()) {
                                            modelMatrix = Communicator.Matrix.yAxisRotation(0);
                                            modelMatrix = modelMatrix.setTranslationComponent(cellSize * colIndex, 0, cellSize * rowIndex + cellSize * 0.5);
                                            meshInstanceData = new Communicator.MeshInstanceData(wallStraightMeshIds[0], modelMatrix, "Straight Wall Instance", null, null, null, Communicator.MeshInstanceCreationFlags.DoNotUseVertexColors);
                                            viewer.model.createMeshInstance(meshInstanceData).then(function (nodeId) {
                                                MazeRenderer.setNodeTexture(viewer, nodeId, brickColorImageId);
                                            });
                                        }
                                    }
                                    if (colIndex == maze.getColCount() - 1) {
                                        rightSlot = node.getRightRelation();
                                        if (!rightSlot.isPathFree()) {
                                            modelMatrix = Communicator.Matrix.yAxisRotation(90);
                                            modelMatrix = modelMatrix.setTranslationComponent(cellSize * colIndex + cellSize * 0.5, 0, cellSize * rowIndex);
                                            meshInstanceData = new Communicator.MeshInstanceData(wallStraightMeshIds[0], modelMatrix, "Straight Wall Instance", null, null, null, Communicator.MeshInstanceCreationFlags.DoNotUseVertexColors);
                                            viewer.model.createMeshInstance(meshInstanceData).then(function (nodeId) {
                                                MazeRenderer.setNodeTexture(viewer, nodeId, brickColorImageId);
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return MazeRenderer;
}());

//# sourceMappingURL=hcpbrmaze.js.map
