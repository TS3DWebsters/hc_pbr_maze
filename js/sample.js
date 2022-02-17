var modelStructureExplorer = null;

function initResizeEventHandler(hwv, containerId) {
    window.onresize = () => {
        hwv.resizeCanvas();
    };

    new ResizeObserver(() => {
        hwv.resizeCanvas();
    }).observe(document.getElementById("viewer"));

    hwv.resizeCanvas();
}

function startSample() {
    hwv = new Communicator.WebViewer({
        containerId: "viewer",
        model: "standard/sc_models/microengine",
        //model: "COM-3365/000061-1-",
    });

    modelStructureExplorer = new ModelStructureExplorer(hwv, "model_structure_explorer");
    operatorMixer = new OperatorMixer(hwv, "operator_mixer");
    dataDumper = new DataDumper(hwv, "data_dumper");

    hwv.setCallbacks({
        sceneReady: () => {
            hwv.view.setBackgroundColor(Communicator.Color.blue(), Communicator.Color.white());
            initResizeEventHandler(hwv, "viewer");
        },

        modelStructureReady: () => {
            document.getElementById("button_1").onclick = () => {
            };

            document.getElementById("button_2").onclick = () => {
            };

            document.getElementById("button_3").onclick = () => {
            };

            document.getElementById("button_4").onclick = () => {
            };

            document.getElementById("button_5").onclick = () => {
            };

            document.getElementById("button_6").onclick = () => {
            };

            document.getElementById("button_7").onclick = () => {
            };

            document.getElementById("button_8").onclick = () => {
            };

            document.getElementById("button_9").onclick = () => {
            };

            document.getElementById("button_10").onclick = () => {
            };

            document.getElementById("button_test").onclick = () => {
                Promise.resolve()
                    .then(function () {
                        return runTest(hwv);
                    })
                    .then(function (result) {
                        if (result) {
                            console.log("%c  Test PASSED :)  ", "background: green; color: white");
                        } else if (result === undefined) {
                            console.log(
                                "%c  Test did not return a value  ",
                                "background: red; color: white"
                            );
                        } else {
                            console.log("%c  Test FAILED :(  ", "background: red; color: white");
                        }
                    })
                    .catch((error) => {
                        console.log(
                            "%c  Test FAILED :(  " + error,
                            "background: red; color: white"
                        );
                    });
            };
        },
    });

    hwv.start();
}

/**
 * Note that unit test are also executed for IE which does not support let/const keywords.
 * Use var keyword everywhere for test implementation...
 */
function runTest(hwv) {
}

window.addEventListener("load", startSample, false);
