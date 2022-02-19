/// <reference path="HWV/hoops_web_viewer.d.ts" />

class Main {
  private _containerId: string;
  private _hwv: Communicator.WebViewer;
  private _maze: Maze | null;
  //private _cameraController: CameraController | null;

  constructor() {
    this._containerId = "viewer";

    this._hwv = new Communicator.WebViewer({
      containerId: this._containerId,
    });

    this._maze = null;
    //this._cameraController = null;

    this._hwv.setCallbacks({
      sceneReady: () => {
          this._hwv.view.setBackgroundColor(Communicator.Color.blue(), Communicator.Color.white());
          this._hwv.view.getNavCube().enable();
          this._initResizeEventHandler();

          /*this._hwv.operatorManager.clear();
          this._hwv.operatorManager.push(Communicator.OperatorId.KeyboardWalk);
          let operator = this._hwv.operatorManager.getOperator(Communicator.OperatorId.KeyboardWalk);
          operator.setWalkSpeed(50.0);
          operator.setZoomSpeed(50.0);*/

          this._hwv.view.clearLights();

          this._maze = new Maze(30, 20);
          MazeRenderer.createMazeMesh(this._maze, this._hwv, this._hwv.model.getAbsoluteRootNode());
        
          let startNode = this._maze.getStartNode();
          let startPosition = startNode.getWorld3dCenter();

          let camera = this._hwv.view.getCamera();
          camera.setTarget(new Communicator.Point3(0, 0, 1));
          camera.setPosition(startPosition);
          this._hwv.view.setCamera(camera);

          //this._cameraController = new CameraController(this._hwv.view.getCamera(), this._maze);
          //this._cameraController.run();
        },
    });

    this._hwv.start();
  }

  private _initResizeEventHandler() {
    window.addEventListener("resize", () => {
      this._hwv.resizeCanvas();
    });

    this._hwv.resizeCanvas();
  }
}
