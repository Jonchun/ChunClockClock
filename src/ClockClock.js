import ClockNumber24 from "./ClockNumber24";
import ChunTicker from "./ChunTicker";

export default class ClockClock {
    constructor( options = {} ) {
        const elementID = ( typeof options.elementID === "undefined" ) ? "clockclock" : options.elementID;

        this.app = new PIXI.Application( window.innerWidth, window.innerHeight, {
            powerPreference: "high-performance",
            view: document.getElementById( elementID ),
            antialias: true,
            autoStart: true,
        } );
        this.app.renderer.backgroundColor = 0xffffff;

        this.app.logicTicker = new ChunTicker( 34 );

        this.app.clockFaces = new PIXI.Graphics();
        this.app.clockHands = new PIXI.Graphics();
        this.app.stage.addChild( this.app.clockFaces );
        this.app.stage.addChild( this.app.clockHands );

        this.topMargin = 0;
        this.leftMargin = 0;

        this.resize();

        this.twentyfourHour = ( typeof options.twentyfourHour === "undefined" ) ? false : options.twentyfourHour;

        const clockNumber1Options = {
            radius: this.radius,
            topMargin: this.topMargin,
            leftMargin: this.leftMargin,
            clockMargin: this.clockMargin,
        };

        const clockNumber2Options = {
            radius: this.radius,
            topMargin: this.topMargin,
            leftMargin: this.leftMargin,
            clockMargin: this.clockMargin,
            xOffset: ( this.app.vertical ) ? 0 : 2,
            yOffset: ( this.app.vertical ) ? 1 : 0,
        };

        this.ClockNumber1 = new ClockNumber24( this.app, 2, clockNumber1Options );
        this.ClockNumber2 = new ClockNumber24( this.app, 2, clockNumber2Options );

        this.update();

        this.ClockNumber1.renderFresh( clockNumber1Options );
        this.ClockNumber2.renderFresh( clockNumber2Options );

        this.app.ticker.add( this.draw, this );
    }

    update() {
        const currentTime = new Date();
        this.hour = currentTime.getHours();
        this.minute = currentTime.getMinutes();

        if ( !this.twentyfourHour && this.hour === 0 ) {
            this.hour = 12;
        }
        if ( !this.twentyfourHour && this.hour > 12 ) {
            this.hour -= 12;
        }
        this.ClockNumber1.toNumber( this.hour );
        this.ClockNumber2.toNumber( this.minute );
    }

    resize() {
        this.app.renderer.resize( window.innerWidth, window.innerHeight );
        this.app.innerWidth = window.innerWidth - 10;
        this.app.innerHeight = window.innerHeight - 10;

        this.app.vertical = ( ( this.app.innerWidth / this.app.innerHeight ) < 1.4 );

        let maxClockWidth = Math.floor( this.app.innerWidth / 17 );
        let maxClockHeight = Math.floor( this.app.innerHeight / 6 );

        if ( this.app.vertical ) {
            maxClockWidth = Math.floor( this.app.innerWidth / 8 );
            maxClockHeight = Math.floor( this.app.innerHeight / 12 );
        }

        this.radius = ( maxClockWidth < maxClockHeight ) ? maxClockWidth * 0.5 : maxClockHeight * 0.5;
        this.clockMargin = Math.floor( this.radius * 0.05 );
        this.clockMargin = ( this.clockMargin === 0 ) ? 1 : this.clockMargin;
        this.radius -= this.clockMargin;

        const maxDigitWidth = ( ( 4 * 2 * ( this.radius + this.clockMargin ) ) );
        const maxDigitHeight = ( ( 6 * 2 * ( this.radius + this.clockMargin ) ) );
        let maxWidth;
        let maxHeight;

        if ( this.app.vertical ) {
            maxWidth = 2 * maxDigitWidth;
            maxHeight = 2 * maxDigitHeight;
        } else {
            maxWidth = 4 * maxDigitWidth;
            maxHeight = 1 * maxDigitHeight;
        }

        this.leftMargin = Math.floor( ( this.app.innerWidth - maxWidth ) / 2 ) + 5;
        this.topMargin = Math.floor( ( this.app.innerHeight - maxHeight ) / 2 ) + 5;
    }

    renderFresh() {
        const clockNumber1Options = {
            radius: this.radius,
            topMargin: this.topMargin,
            leftMargin: this.leftMargin,
            clockMargin: this.clockMargin,
        };

        const clockNumber2Options = {
            radius: this.radius,
            topMargin: this.topMargin,
            leftMargin: this.leftMargin,
            clockMargin: this.clockMargin,
            xOffset: ( this.app.vertical ) ? 0 : 2,
            yOffset: ( this.app.vertical ) ? 1 : 0,
        };

        this.app.clockFaces.clear();
        this.app.clockHands.clear();
        this.ClockNumber1.renderFresh( clockNumber1Options );
        this.ClockNumber2.renderFresh( clockNumber2Options );
    }

    draw() {
        if ( this.ClockNumber1.movingInterval !== false || this.ClockNumber2.movingInterval !== false ) {
            this.app.clockHands.clear();
            this.ClockNumber1.render();
            this.ClockNumber2.render();
        }
    }
}
