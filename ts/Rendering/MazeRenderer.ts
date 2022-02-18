class MazeRenderer {
  
  public static async loadImage(viewer : Communicator.WebViewer, filename : string) {
    const p : Promise<XMLHttpRequest> = new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open(`GET`, filename, true);
      request.responseType = `arraybuffer`;
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
    const request = await p;
    const imageOptions = {
      format: Communicator.ImageFormat.Jpeg,
      data: new Uint8Array(request.response),
    };
    return viewer.model.createImage(imageOptions);
  }
  
  public static setNodeTexture(viewer : Communicator.WebViewer, nodeId : Communicator.NodeId, imageId : Communicator.ImageId) {
    if (nodeId !== null) {
      const textureOptions = {
        imageId: imageId,
        modifiers: Communicator.TextureModifier.Decal
      };
      viewer.model.setNodesTexture([nodeId], textureOptions);
    }
  }
  
  public static async createMazeMesh(
    maze: Maze,
    viewer: Communicator.WebViewer,
    rootNodeId: Communicator.NodeId
    ) {
      
      const rockColorImageId : Communicator.ImageId = await MazeRenderer.loadImage(viewer, "data/textures/rock_color.jpg");
      const brickColorImageId : Communicator.ImageId = await MazeRenderer.loadImage(viewer, "data/textures/brick_color.jpg");
      
      let meshesRootNodeId = viewer.model.createNode(rootNodeId, "MeshesRoot");
      
      const cellSize: number = 2;
      
      // Filepaths of scs files
      const floorTileFilepath: string = "data/models/floor.scs";
      const wallStraightTileFilepath: string = "data/models/wall_straight.scs";
      
      // Load scs models
      viewer.model.setEnableAutomaticUnitScaling(false);
      let floorTilesNodesIds: Communicator.NodeId[] = await viewer.model.loadSubtreeFromScsFile(meshesRootNodeId, floorTileFilepath);
      let wallStraightNodesIds: Communicator.NodeId[] = await viewer.model.loadSubtreeFromScsFile(meshesRootNodeId, wallStraightTileFilepath);
      
      // Results should contain only one NodeId
      if (floorTilesNodesIds.length != 1) throw "Invalid floor tile model";
      if (wallStraightNodesIds.length != 1) throw "Invalid wall straight model";
      
      let floorTileModelNodeId = floorTilesNodesIds[0];
      let wallStraightModelNodeId = wallStraightNodesIds[0];
      
      // Create a root for all model instances
      let floorTileRootNodeId = viewer.model.createNode(rootNodeId,"FloorTiles");
      
      // Get mesh ids 
      let floorTileMeshIds = await viewer.model.getMeshIds([floorTileModelNodeId]);
      let wallStraightMeshIds = await viewer.model.getMeshIds([wallStraightModelNodeId]);
      
      // We still expect only one meshId
      if(floorTileMeshIds.length != 1) throw "Invalid floor tile model";
      if(wallStraightMeshIds.length != 1) throw "Invalid wall straight model";
      
      // UNOPTIMIZED : For each cell instanciate a floor tile.
      for (let rowIndex: number = 0; rowIndex < maze.getRowCount(); ++rowIndex) {
        for (let colIndex: number = 0; colIndex < maze.getColCount(); ++colIndex) {
          
          // compute the model matrix to move the tile at good position;
          let netMatrix = viewer.model.getNodeNetMatrix(floorTileRootNodeId);
          netMatrix.m[12] = cellSize * colIndex;
          netMatrix.m[13] = 0;
          netMatrix.m[14] = cellSize * rowIndex;
          
          // Create the MeshInstanceData of floor tile
          let meshInstanceData : Communicator.MeshInstanceData = new Communicator.MeshInstanceData(floorTileMeshIds[0], netMatrix, "Floor Tile Instance", null, null, null, Communicator.MeshInstanceCreationFlags.DoNotUseVertexColors);
          viewer.model.createMeshInstance(meshInstanceData).then(nodeId => {
            MazeRenderer.setNodeTexture(viewer, nodeId, rockColorImageId); 
          });
        }
      }
      
      // Each cell check for up and left wall.
      // Last row and last column check for respectively for botton and right walls.
      
      for(let rowIndex : number = 0; rowIndex < maze.getRowCount(); ++rowIndex){
        for(let colIndex : number = 0; colIndex < maze.getColCount(); ++colIndex){
          let node : MazeNode | null = maze.getNodeAtCoord(colIndex, rowIndex); 
          if(node != null){
            let leftSlot = node.getAccessibility(Direction.Left);
            if(!leftSlot){
              let modelMatrix : Communicator.Matrix = Communicator.Matrix.yAxisRotation(90);
              modelMatrix = modelMatrix.setTranslationComponent(cellSize*colIndex - cellSize*0.5, 0, cellSize*rowIndex);
              
              let meshInstanceData : Communicator.MeshInstanceData = new Communicator.MeshInstanceData(wallStraightMeshIds[0], modelMatrix, "Straight Wall Instance", null, null, null, Communicator.MeshInstanceCreationFlags.DoNotUseVertexColors);
              viewer.model.createMeshInstance(meshInstanceData).then(nodeId => {
                MazeRenderer.setNodeTexture(viewer, nodeId, brickColorImageId);
              });
            }
            
            let upSlot = node.getAccessibility(Direction.Up);
            if(!upSlot){
              let modelMatrix : Communicator.Matrix = Communicator.Matrix.yAxisRotation(0);
              modelMatrix = modelMatrix.setTranslationComponent(cellSize*colIndex, 0, cellSize*rowIndex - cellSize * 0.5);
              
              let meshInstanceData : Communicator.MeshInstanceData = new Communicator.MeshInstanceData(wallStraightMeshIds[0], modelMatrix, "Straight Wall Instance", null, null, null, Communicator.MeshInstanceCreationFlags.DoNotUseVertexColors);
              viewer.model.createMeshInstance(meshInstanceData).then(nodeId => {
                MazeRenderer.setNodeTexture(viewer, nodeId, brickColorImageId);
              });
            }    
            
            if(rowIndex == maze.getRowCount() - 1){
              let downSlot = node.getAccessibility(Direction.Down);
              if(!downSlot){
                let modelMatrix : Communicator.Matrix = Communicator.Matrix.yAxisRotation(0);
                modelMatrix = modelMatrix.setTranslationComponent(cellSize*colIndex, 0, cellSize*rowIndex + cellSize * 0.5);
                
                let meshInstanceData : Communicator.MeshInstanceData = new Communicator.MeshInstanceData(wallStraightMeshIds[0], modelMatrix, "Straight Wall Instance", null, null, null, Communicator.MeshInstanceCreationFlags.DoNotUseVertexColors);
                viewer.model.createMeshInstance(meshInstanceData).then(nodeId => {
                  MazeRenderer.setNodeTexture(viewer, nodeId, brickColorImageId);
                });
              }   
            }
            
            if(colIndex == maze.getColCount() - 1){
              let rightSlot = node.getAccessibility(Direction.Right);
              if(!rightSlot){
                let modelMatrix : Communicator.Matrix = Communicator.Matrix.yAxisRotation(90);
                modelMatrix = modelMatrix.setTranslationComponent(cellSize*colIndex + cellSize * 0.5, 0, cellSize*rowIndex);
                
                let meshInstanceData : Communicator.MeshInstanceData = new Communicator.MeshInstanceData(wallStraightMeshIds[0], modelMatrix, "Straight Wall Instance", null, null, null, Communicator.MeshInstanceCreationFlags.DoNotUseVertexColors);
                viewer.model.createMeshInstance(meshInstanceData).then(nodeId => {
                  MazeRenderer.setNodeTexture(viewer, nodeId, brickColorImageId);
                });
              }   
            }
          }            
        }
      }
    }
  }
