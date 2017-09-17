import ClockClock from "./ClockClock";

const ChunCC = {};
document.addEventListener( "DOMContentLoaded", () => {
    ChunCC.clockclock = new ClockClock();
    setInterval( () => {
        ChunCC.clockclock.update();
    }, 1000 );
} );

window.addEventListener( "resize", () => {
    ChunCC.clockclock.resize();
    ChunCC.clockclock.renderFresh();
} );