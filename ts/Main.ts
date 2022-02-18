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
          this._initResizeEventHandler();

          this._maze = MazeGenerator.generateHardcoded();
          MazeRenderer.createMazeMesh(this._maze, this._hwv, this._hwv.model.getAbsoluteRootNode());
        },
      selectionArray: (selectionEvents:Communicator.Event.NodeSelectionEvent[]) => {
        const selectionIds = selectionEvents.map(sEvent => sEvent.getSelection().getNodeId());
        for(let selectionId in selectionIds){
          console.log(">>>> " + selectionId);
        }
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
