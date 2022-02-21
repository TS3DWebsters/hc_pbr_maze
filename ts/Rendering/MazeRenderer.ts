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
      
      const sandColorImageId : Communicator.ImageId = await MazeRenderer.loadImage(viewer, "data/textures/sand_color.jpg");
      const brickColorImageId : Communicator.ImageId = await MazeRenderer.loadImage(viewer, "data/textures/brick_color.jpg");
      //const ceilColorImageId : Communicator.ImageId = await MazeRenderer.loadImage(viewer, "data/textures/ceil_color.jpg");
      
      let meshesRootNodeId = viewer.model.createNode(rootNodeId, "MeshesRoot");
      
      // Filepaths of scs files
      const floorTileFilepath: string = "data/models/floor.scs";
      const wallStraightTileFilepath: string = "data/models/wall_straight.scs";
      const ceilTileFilepath: string = "data/models/ceil.scs";
      const wallJunction1Filepath: string = "data/models/wall_junction1.scs";
      const wallJunction2Filepath: string = "data/models/wall_junction2.scs";
      const wallJunction3Filepath: string = "data/models/wall_junction3.scs";
      const wallJunction4Filepath: string = "data/models/wall_junction4.scs";
      const wallJunction2CornerFilepath: string = "data/models/wall_junction2_corner.scs";
      
      // Load scs models
      viewer.model.setEnableAutomaticUnitScaling(false);
      let floorTilesNodesIds: Communicator.NodeId[] = await viewer.model.loadSubtreeFromScsFile(meshesRootNodeId, floorTileFilepath);
      let wallStraightNodesIds: Communicator.NodeId[] = await viewer.model.loadSubtreeFromScsFile(meshesRootNodeId, wallStraightTileFilepath);
      let cellTilesNodesIds: Communicator.NodeId[] = await viewer.model.loadSubtreeFromScsFile(meshesRootNodeId, ceilTileFilepath);
      let wallJunction1NodesIds: Communicator.NodeId[] = await viewer.model.loadSubtreeFromScsFile(meshesRootNodeId, wallJunction1Filepath);
      let wallJunction2NodesIds: Communicator.NodeId[] = await viewer.model.loadSubtreeFromScsFile(meshesRootNodeId, wallJunction2Filepath);
      let wallJunction3NodesIds: Communicator.NodeId[] = await viewer.model.loadSubtreeFromScsFile(meshesRootNodeId, wallJunction3Filepath);
      let wallJunction4NodesIds: Communicator.NodeId[] = await viewer.model.loadSubtreeFromScsFile(meshesRootNodeId, wallJunction4Filepath);
      let wallJunction2CornerNodesIds: Communicator.NodeId[] = await viewer.model.loadSubtreeFromScsFile(meshesRootNodeId, wallJunction2CornerFilepath);

      viewer.model.setNodesVisibility([meshesRootNodeId], false);

      // Results should contain only one NodeId
      if (floorTilesNodesIds.length != 1) throw "Invalid floor tile model";
      if (wallStraightNodesIds.length != 1) throw "Invalid wall straight model";
      if (cellTilesNodesIds.length != 1) throw "Invalid ceil tile model";
      if(wallJunction1NodesIds.length != 1) throw "Invalid wall junction 1 model";
      if(wallJunction2NodesIds.length != 1) throw "Invalid wall junction 2 model";
      if(wallJunction3NodesIds.length != 1) throw "Invalid wall junction 3 model";
      if(wallJunction4NodesIds.length != 1) throw "Invalid wall junction 4 model";
      if(wallJunction2CornerNodesIds.length != 1) throw "Invalid wall junction 2 corner model";
      
      let floorTileModelNodeId = floorTilesNodesIds[0];
      let wallStraightModelNodeId = wallStraightNodesIds[0];
      let ceilTileModelNodeId = cellTilesNodesIds[0];
      let wallJunction1ModelNodeId = wallJunction1NodesIds[0];
      let wallJunction2ModelNodeId = wallJunction2NodesIds[0];
      let wallJunction3ModelNodeId = wallJunction3NodesIds[0];
      let wallJunction4ModelNodeId = wallJunction4NodesIds[0];
      let wallJunction2CornerModelNodeId = wallJunction2CornerNodesIds[0];
            
      // Get mesh ids 
      let floorTileMeshIds = await viewer.model.getMeshIds([floorTileModelNodeId]);
      let wallStraightMeshIds = await viewer.model.getMeshIds([wallStraightModelNodeId]);
      let ceilTileMeshIds = await viewer.model.getMeshIds([ceilTileModelNodeId]);
      let wallJunction1MeshIds = await viewer.model.getMeshIds([wallJunction1ModelNodeId]);
      let wallJunction2MeshIds = await viewer.model.getMeshIds([wallJunction2ModelNodeId]);
      let wallJunction3MeshIds = await viewer.model.getMeshIds([wallJunction3ModelNodeId]);
      let wallJunction4MeshIds = await viewer.model.getMeshIds([wallJunction4ModelNodeId]);
      let wallJunction2CornerMeshIds = await viewer.model.getMeshIds([wallJunction2CornerModelNodeId]);
      
      // We still expect only one meshId
      if(floorTileMeshIds.length != 1) throw "Invalid floor tile model";
      if(wallStraightMeshIds.length != 1) throw "Invalid wall straight model";
      if(ceilTileMeshIds.length != 1) throw "Invalid ceil tile model";
      if(wallJunction1MeshIds.length != 1) throw "Invalid wall junction 1 model";
      if(wallJunction2MeshIds.length != 1) throw "Invalid wall junction 2 model";
      if(wallJunction3MeshIds.length != 1) throw "Invalid wall junction 3 model";
      if(wallJunction4MeshIds.length != 1) throw "Invalid wall junction 4 model";
      if(wallJunction2CornerMeshIds.length != 1) throw "Invalid wall junction 2 corner model";
      
      // UNOPTIMIZED : For each cell instanciate a floor tile and a ceil tile.
      for (let rowIndex: number = 0; rowIndex < maze.getRowCount(); ++rowIndex) {
        for (let colIndex: number = 0; colIndex < maze.getColCount(); ++colIndex) {
          MazeRenderer._instanciate(viewer, floorTileMeshIds[0], CELL_SIZE * colIndex, 0, CELL_SIZE * rowIndex, 0, sandColorImageId);
          //MazeRenderer._instanciate(viewer, ceilTileMeshIds[0], CELL_SIZE * colIndex, CELL_HEIGHT, CELL_SIZE * rowIndex, 0, ceilColorImageId)
        }
      }
      
      // Each cell check for up wall, left wall, bottom left junction.
      // Last row and last column check for respectively for botton and right walls.
      // First row will also check for top right junction
      // First column will also check for bottom left junction
      // Top left cell will check for top left junction

      for(let rowIndex : number = 0; rowIndex < maze.getRowCount(); ++rowIndex){
        for(let colIndex : number = 0; colIndex < maze.getColCount(); ++colIndex){
          let node : MazeNode | null = maze.getNodeAtCoord(colIndex, rowIndex); 
          if(node != null){
            let leftSlot = node.getAccessibility(Direction.Left);
            if(!leftSlot){
              MazeRenderer._instanciate(viewer, wallStraightMeshIds[0], CELL_SIZE*colIndex - CELL_SIZE*0.5, 0, CELL_SIZE*rowIndex, 90, brickColorImageId);
            }
            
            let upSlot = node.getAccessibility(Direction.Up);
            if(!upSlot){
              MazeRenderer._instanciate(viewer, wallStraightMeshIds[0], CELL_SIZE*colIndex, 0, CELL_SIZE*rowIndex - CELL_SIZE * 0.5, 0, brickColorImageId);
            }    

            // Instanciate bottom left junction

            MazeRenderer._instanciateDownRightJunction(
              viewer,
              maze, 
              colIndex, 
              rowIndex,
              wallJunction1MeshIds[0],
              wallJunction2MeshIds[0],
              wallJunction2CornerMeshIds[0],
              wallJunction3MeshIds[0],
              wallJunction4MeshIds[0],
              brickColorImageId);

            if(rowIndex == 0) {
              MazeRenderer._instanciateUpRightJunction(
                viewer,
                maze, 
                colIndex, 
                rowIndex,
                wallJunction1MeshIds[0],
                wallJunction2MeshIds[0],
                wallJunction2CornerMeshIds[0],
                wallJunction3MeshIds[0],
                wallJunction4MeshIds[0],
                brickColorImageId);             
            }

            if(colIndex == 0){
              MazeRenderer._instanciateDownLeftJunction(
                viewer,
                maze, 
                colIndex, 
                rowIndex,
                wallJunction1MeshIds[0],
                wallJunction2MeshIds[0],
                wallJunction2CornerMeshIds[0],
                wallJunction3MeshIds[0],
                wallJunction4MeshIds[0],
                brickColorImageId);               
            }

            if(rowIndex == 0 && colIndex == 0){
              MazeRenderer._instanciateUpLeftJunction(
                viewer,
                maze, 
                colIndex, 
                rowIndex,
                wallJunction1MeshIds[0],
                wallJunction2MeshIds[0],
                wallJunction2CornerMeshIds[0],
                wallJunction3MeshIds[0],
                wallJunction4MeshIds[0],
                brickColorImageId);               
            }

            // ========= 

            if(rowIndex == maze.getRowCount() - 1){
              let downSlot = node.getAccessibility(Direction.Down);
              if(!downSlot){
                MazeRenderer._instanciate(viewer, wallStraightMeshIds[0], CELL_SIZE*colIndex, 0, CELL_SIZE*rowIndex + CELL_SIZE * 0.5, 0, brickColorImageId);
              }   
            }
            
            if(colIndex == maze.getColCount() - 1){
              let rightSlot = node.getAccessibility(Direction.Right);
              if(!rightSlot){
                MazeRenderer._instanciate(viewer, wallStraightMeshIds[0], CELL_SIZE*colIndex + CELL_SIZE * 0.5, 0, CELL_SIZE*rowIndex, 90, brickColorImageId);
              }   
            }
          }            
        }
      }
    }

    private static _instanciate(viewer : Communicator.WebViewer, meshId : Communicator.MeshId, transX : number, transY : number, transZ : number, rotYDeg : number, imageId : Communicator.ImageId){

      let matrix : Communicator.Matrix = Communicator.Matrix.yAxisRotation(rotYDeg);
      matrix = matrix.setTranslationComponent(transX, transY, transZ);

      let meshInstanceData : Communicator.MeshInstanceData = new Communicator.MeshInstanceData(meshId, matrix);
      viewer.model.createMeshInstance(meshInstanceData).then(nodeId => {
        MazeRenderer.setNodeTexture(viewer, nodeId, imageId);
      });   
    }

    private static _instanciateJunctions(
      viewer : Communicator.WebViewer, 
      x : number, 
      z : number, 
      leftHasWall : boolean, 
      upHasWall : boolean, 
      rightHasWall : boolean, 
      downHasWall : boolean,
      wallJunction1MeshId : Communicator.MeshId,
      wallJunction2MeshId : Communicator.MeshId,
      wallJunction2CornerMeshId : Communicator.MeshId,
      wallJunction3MeshId : Communicator.MeshId,
      wallJunction4MeshId : Communicator.MeshId,
      imageId : Communicator.ImageId
      ){
      // J4

      if(leftHasWall && rightHasWall && upHasWall && downHasWall){
        MazeRenderer._instanciate(viewer, wallJunction4MeshId, x, 0, z, 0, imageId);    
      }

      // J2 straight

      if(leftHasWall && rightHasWall && !upHasWall && !downHasWall){
        MazeRenderer._instanciate(viewer, wallJunction2MeshId, x, 0, z, 90, imageId);    
      }

      if(!leftHasWall && !rightHasWall && upHasWall && downHasWall){
        MazeRenderer._instanciate(viewer, wallJunction2MeshId, x, 0, z, 0, imageId);    
      }

      // J2 corner

      if(leftHasWall && upHasWall && ! rightHasWall && ! downHasWall){
        MazeRenderer._instanciate(viewer, wallJunction2CornerMeshId, x, 0, z, 0, imageId);    
      }

      if(!leftHasWall && upHasWall && rightHasWall && ! downHasWall){
        MazeRenderer._instanciate(viewer, wallJunction2CornerMeshId, x, 0, z, 90, imageId);    
      }

      if(!leftHasWall && !upHasWall && rightHasWall && downHasWall){
        MazeRenderer._instanciate(viewer, wallJunction2CornerMeshId, x, 0, z, 180, imageId);    
      }

      if(leftHasWall && !upHasWall && !rightHasWall && downHasWall){
        MazeRenderer._instanciate(viewer, wallJunction2CornerMeshId, x, 0, z, -90, imageId);    
      }

      // J1
      
      if(leftHasWall && !rightHasWall && !upHasWall && !downHasWall){
        MazeRenderer._instanciate(viewer, wallJunction1MeshId, x, 0, z, -90, imageId);    
      }

      if(!leftHasWall && rightHasWall && !upHasWall && !downHasWall){
        MazeRenderer._instanciate(viewer, wallJunction1MeshId, x, 0, z, 90, imageId);    
      }

      if(!leftHasWall && !rightHasWall && upHasWall && !downHasWall){
        MazeRenderer._instanciate(viewer, wallJunction1MeshId, x, 0, z, 0, imageId);    
      }  
  
      if(!leftHasWall && !rightHasWall && !upHasWall && downHasWall){
        MazeRenderer._instanciate(viewer, wallJunction1MeshId, x, 0, z, 180, imageId);    
      }

      // J3

      if(leftHasWall && upHasWall && rightHasWall && !downHasWall){
        MazeRenderer._instanciate(viewer, wallJunction3MeshId, x, 0, z, 90, imageId); 
      }

      if(!leftHasWall && upHasWall && rightHasWall && downHasWall){
        MazeRenderer._instanciate(viewer, wallJunction3MeshId, x, 0, z, 180, imageId); 
      }

      if(leftHasWall && !upHasWall && rightHasWall && downHasWall){
        MazeRenderer._instanciate(viewer, wallJunction3MeshId, x, 0, z, -90, imageId); 
      }
      
      if(leftHasWall && upHasWall && !rightHasWall && downHasWall){
        MazeRenderer._instanciate(viewer, wallJunction3MeshId, x, 0, z, 0, imageId); 
      }
    }

    private static _instanciateDownRightJunction(
      viewer: Communicator.WebViewer,
      maze:Maze,
      colIndex:number,
      rowIndex:number,
      wallJunction1MeshId : Communicator.MeshId,
      wallJunction2MeshId : Communicator.MeshId,
      wallJunction2CornerMeshId : Communicator.MeshId,
      wallJunction3MeshId : Communicator.MeshId,
      wallJunction4MeshId : Communicator.MeshId,
      imageId : Communicator.ImageId
      ) : void{

      let node : MazeNode | null = maze.getNodeAtCoord(colIndex, rowIndex); 

      if(node == null)
        return;

      let rightNode = node.getNeighbor(Direction.Right);
      let downNode = node.getNeighbor(Direction.Down);
      
      let upHasWall =  ! node.getAccessibility(Direction.Right);
      let leftHasWall = ! node.getAccessibility(Direction.Down);
      let downHasWall = downNode != null && !downNode.getAccessibility(Direction.Right); 
      let rightHasWall = rightNode != null && !rightNode.getAccessibility(Direction.Down);

      let junctionX = CELL_SIZE * colIndex + CELL_SIZE * 0.5;
      let junctionZ = CELL_SIZE * rowIndex + CELL_SIZE * 0.5;
      MazeRenderer._instanciateJunctions(
        viewer, 
        junctionX, 
        junctionZ, 
        leftHasWall, 
        upHasWall, 
        rightHasWall, 
        downHasWall, 
        wallJunction1MeshId,
        wallJunction2MeshId,
        wallJunction2CornerMeshId,
        wallJunction3MeshId,
        wallJunction4MeshId,
        imageId
        );
    }

    private static _instanciateUpRightJunction(
      viewer: Communicator.WebViewer,
      maze:Maze,
      colIndex:number,
      rowIndex:number,
      wallJunction1MeshId : Communicator.MeshId,
      wallJunction2MeshId : Communicator.MeshId,
      wallJunction2CornerMeshId : Communicator.MeshId,
      wallJunction3MeshId : Communicator.MeshId,
      wallJunction4MeshId : Communicator.MeshId,
      imageId : Communicator.ImageId
      ) : void{

      let node : MazeNode | null = maze.getNodeAtCoord(colIndex, rowIndex); 

      if(node == null)
        return;

      let rightNode = node.getNeighbor(Direction.Right);
      let upNode = node.getNeighbor(Direction.Up);
      
      let downHasWall = ! node.getAccessibility(Direction.Right);
      let leftHasWall = ! node.getAccessibility(Direction.Up);
      let upHasWall = upNode != null && !upNode.getAccessibility(Direction.Right); 
      let rightHasWall = rightNode != null && !rightNode.getAccessibility(Direction.Up);

      let junctionX = CELL_SIZE * colIndex + CELL_SIZE * 0.5;
      let junctionZ = CELL_SIZE * rowIndex - CELL_SIZE * 0.5;
      MazeRenderer._instanciateJunctions(
        viewer, 
        junctionX, 
        junctionZ, 
        leftHasWall, 
        upHasWall, 
        rightHasWall, 
        downHasWall, 
        wallJunction1MeshId,
        wallJunction2MeshId,
        wallJunction2CornerMeshId,
        wallJunction3MeshId,
        wallJunction4MeshId,
        imageId
        );
    }

    private static _instanciateDownLeftJunction(
      viewer: Communicator.WebViewer,
      maze:Maze,
      colIndex:number,
      rowIndex:number,
      wallJunction1MeshId : Communicator.MeshId,
      wallJunction2MeshId : Communicator.MeshId,
      wallJunction2CornerMeshId : Communicator.MeshId,
      wallJunction3MeshId : Communicator.MeshId,
      wallJunction4MeshId : Communicator.MeshId,
      imageId : Communicator.ImageId
      ) : void{

      let node : MazeNode | null = maze.getNodeAtCoord(colIndex, rowIndex); 

      if(node == null)
        return;

      let leftNode = node.getNeighbor(Direction.Left);
      let downNode = node.getNeighbor(Direction.Down);
      
      let upHasWall = ! node.getAccessibility(Direction.Left);
      let rightHasWall = ! node.getAccessibility(Direction.Down);
      let downHasWall = downNode != null && !downNode.getAccessibility(Direction.Left); 
      let leftHasWall = leftNode != null && !leftNode.getAccessibility(Direction.Down);

      let junctionX = CELL_SIZE * colIndex - CELL_SIZE * 0.5;
      let junctionZ = CELL_SIZE * rowIndex + CELL_SIZE * 0.5;
      MazeRenderer._instanciateJunctions(
        viewer, 
        junctionX, 
        junctionZ, 
        leftHasWall, 
        upHasWall, 
        rightHasWall, 
        downHasWall, 
        wallJunction1MeshId,
        wallJunction2MeshId,
        wallJunction2CornerMeshId,
        wallJunction3MeshId,
        wallJunction4MeshId,
        imageId
        );
    }

    private static _instanciateUpLeftJunction(
      viewer: Communicator.WebViewer,
      maze:Maze,
      colIndex:number,
      rowIndex:number,
      wallJunction1MeshId : Communicator.MeshId,
      wallJunction2MeshId : Communicator.MeshId,
      wallJunction2CornerMeshId : Communicator.MeshId,
      wallJunction3MeshId : Communicator.MeshId,
      wallJunction4MeshId : Communicator.MeshId,
      imageId : Communicator.ImageId
      ) : void{

      let node : MazeNode | null = maze.getNodeAtCoord(colIndex, rowIndex); 

      if(node == null)
        return;

      let leftNode = node.getNeighbor(Direction.Left);
      let upNode = node.getNeighbor(Direction.Up);
      
      let downHasWall = ! node.getAccessibility(Direction.Left);
      let rightHasWall = ! node.getAccessibility(Direction.Up);
      let upHasWall = upNode != null && !upNode.getAccessibility(Direction.Left); 
      let leftHasWall = leftNode != null && !leftNode.getAccessibility(Direction.Up);

      let junctionX = CELL_SIZE * colIndex - CELL_SIZE * 0.5;
      let junctionZ = CELL_SIZE * rowIndex - CELL_SIZE * 0.5;
      MazeRenderer._instanciateJunctions(
        viewer, 
        junctionX, 
        junctionZ, 
        leftHasWall, 
        upHasWall, 
        rightHasWall, 
        downHasWall, 
        wallJunction1MeshId,
        wallJunction2MeshId,
        wallJunction2CornerMeshId,
        wallJunction3MeshId,
        wallJunction4MeshId,
        imageId
        );
    }
  }
