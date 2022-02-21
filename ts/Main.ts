/// <reference path="HWV/hoops_web_viewer.d.ts" />

class Main {
  private _containerId: string;
  private _hwv: Communicator.WebViewer;
  private _maze: Maze | null;

  constructor() {
    this._containerId = "viewer";

    this._hwv = new Communicator.WebViewer({
      containerId: this._containerId,
    });

    this._maze = null;

    this._hwv.setCallbacks({
      sceneReady: () => {
          this._hwv.view.setBackgroundColor(Communicator.Color.blue(), Communicator.Color.white());
          this._hwv.view.getNavCube().enable();
          this._initResizeEventHandler();

          this._hwv.view.clearLights();

          this._hwv.operatorManager.clear();
          this._hwv.operatorManager.push(Communicator.OperatorId.Orbit);
          this._hwv.operatorManager.push(Communicator.OperatorId.Zoom);
          this._hwv.operatorManager.push(Communicator.OperatorId.Pan);
          
          this._maze = new Maze(50, 30);

          let camera : Communicator.Camera = this._hwv.view.getCamera();
          camera.setNearLimit(0.1);
          camera.setPosition(new Communicator.Point3(0, 500, 500));
          this._hwv.view.setCamera(camera);

          MazeRenderer.createMazeMesh(this._maze, this._hwv, this._hwv.model.getAbsoluteRootNode());
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
