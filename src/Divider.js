import Clock from "./Clock";

export default class Divider {
    constructor( divID ) {
        this.div = document.getElementById( divID );
        this.clocks = [];

        for ( let i = 1; i <= 6; i++ ) {
            const canvas = document.createElement( "canvas" );
            canvas.setAttribute( "id", `${ divID }clock${ i }` );
            canvas.className += "clock";
            this.div.appendChild( canvas );
        }

        for ( let i = 1; i <= 6; i++ ) {
            const clockID = `${ divID }clock${ i }`;
            this.clocks[ i ] = new Clock( clockID );
        }
    }

    resize( canvasWidth, canvasHeight ) {
        for ( let i = 1; i <= 6; i++ ) {
            this.clocks[ i ].resize( canvasWidth, canvasHeight );
        }
    }

    spin() {
        for ( let i = 1; i <= 6; i++ ) {
            this.clocks[ i ].moveToPos( "v" );
        }
    }
}
