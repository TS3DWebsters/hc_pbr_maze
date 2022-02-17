/// <reference path="hoops_web_viewer.d.ts" />

class Main {
  private _containerId: string;
  private _hwv: Communicator.WebViewer;

  constructor() {
    this._containerId = "viewer";

    this._hwv = new Communicator.WebViewer({
      containerId: this._containerId,
    });

    this._hwv.setCallbacks({
      sceneReady: () => {
          this._hwv.view.setBackgroundColor(Communicator.Color.blue(), Communicator.Color.white());
          this._initResizeEventHandler();

          this._hwv.model.loadSubtreeFromScsFile(this._hwv.model.getAbsoluteRootNode(), "data/models/floor.scs");
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
