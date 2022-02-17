/// <reference path="hoops_web_viewer.d.ts" />
var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        this._containerId = "viewer";
        this._hwv = new Communicator.WebViewer({
            containerId: this._containerId,
        });
        this._hwv.setCallbacks({
            sceneReady: function () {
                _this._hwv.view.setBackgroundColor(Communicator.Color.blue(), Communicator.Color.white());
                _this._initResizeEventHandler();
                _this._hwv.model.loadSubtreeFromScsFile(_this._hwv.model.getAbsoluteRootNode(), "data/models/floor.scs");
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

//# sourceMappingURL=hcpbrmaze.js.map
