import Clock from "./Clock";

export default class ClockDigit24 {
    constructor( app, options ) {
        this.clocks = [];
        this.movingInterval = false;
        this.currentValue = undefined;

        this.xOffset = ( typeof options.xOffset === "undefined" ) ? 0 : options.xOffset;
        this.yOffset = ( typeof options.yOffset === "undefined" ) ? 0 : options.yOffset;

        this.radius = ( typeof options.radius === "undefined" ) ? 75 : options.radius;

        this.topMargin = ( typeof options.topMargin === "undefined" ) ? 0 : options.topMargin;
        this.leftMargin = ( typeof options.leftMargin === "undefined" ) ? 0 : options.leftMargin;
        this.clockMargin = ( typeof options.clockMargin === "undefined" ) ? 0 : options.clockMargin;

        for ( let i = 1; i <= 24; i++ ) {
            const coords = this.getClockPos( i );
            const clockOptions = {
                xPos: coords[ 0 ],
                yPos: coords[ 1 ],
                radius: this.radius,
            };
            this.clocks[ i ] = new Clock( app, clockOptions );
        }
    }

    render() {
        for ( let i = 1; i <= 24; i++ ) {
            this.clocks[ i ].render();
        }
    }

    renderFresh( options ) {
        this.radius = options.radius;
        this.topMargin = options.topMargin;
        this.leftMargin = options.leftMargin;
        this.clockMargin = options.clockMargin;
        this.xOffset = ( typeof options.xOffset === "undefined" ) ? this.xOffset : options.xOffset;
        this.yOffset = ( typeof options.yOffset === "undefined" ) ? this.yOffset : options.yOffset;

        for ( let i = 1; i <= 24; i++ ) {
            const coords = this.getClockPos( i );
            const clockOptions = {
                xPos: coords[ 0 ],
                yPos: coords[ 1 ],
                radius: this.radius,
            };
            this.clocks[ i ].renderFresh( clockOptions );
        }
    }

    resize( canvasWidth, canvasHeight ) {
        for ( let i = 1; i <= 24; i++ ) {
            this.clocks[ i ].resize( canvasWidth, canvasHeight );
        }
    }

    getClockPos( i ) {
        let row = Math.floor( i / 4 );
        let col = ( i % 4 );
        row = ( col === 0 ) ? row - 1 : row;
        col = ( col === 0 ) ? 4 : col;

        const maxDigitWidth = ( ( 4 * 2 * ( this.radius + this.clockMargin ) ) );
        const maxDigitHeight = ( ( 6 * 2 * ( this.radius + this.clockMargin ) ) );
        const radiusWithMargin = this.radius + this.clockMargin;

        const x = ( col * radiusWithMargin * 2 ) - radiusWithMargin;
        const xOffset = this.xOffset * maxDigitWidth;
        const y = ( row * ( this.radius + this.clockMargin ) * 2 ) + radiusWithMargin;
        const yOffset = ( this.yOffset * maxDigitHeight );

        return [ x + xOffset + this.leftMargin, y + yOffset + this.topMargin ];
    }

    checkMoving() {
        let check = 0;
        for ( let i = 1; i <= 24; i++ ) {
            if ( this.clocks[ i ].intervalStarted === false ) {
                check += 1;
            }
        }
        if ( check === 24 ) {
            clearInterval( this.movingInterval );
            this.movingInterval = false;
        }
    }

    toDigit( digit ) {
        if ( this.currentValue === digit ) {
            /* Don't bother updating if number is the same */
            return false;
        }
        if ( this.movingInterval ) {
            console.log( "Error: Still moving" );
            return false;
        }
        const self = this;
        this.movingInterval = setInterval( () => {
            self.checkMoving();
        }, 500 );

        switch ( digit ) {
        case 1:
            this.toOne();
            break;
        case 2:
            this.toTwo();
            break;
        case 3:
            this.toThree();
            break;
        case 4:
            this.toFour();
            break;
        case 5:
            this.toFive();
            break;
        case 6:
            this.toSix();
            break;
        case 7:
            this.toSeven();
            break;
        case 8:
            this.toEight();
            break;
        case 9:
            this.toNine();
            break;
        case 0:
        default:
            this.toZero();
        }
        this.currentValue = digit;
        return true;
    }

    toZero() {
        this.clocks[ 1 ].moveToPos( "br" );
        this.clocks[ 2 ].moveToPos( "h" );
        this.clocks[ 3 ].moveToPos( "h" );
        this.clocks[ 4 ].moveToPos( "bl" );

        this.clocks[ 5 ].moveToPos( "v" );
        this.clocks[ 6 ].moveToPos( "br" );
        this.clocks[ 7 ].moveToPos( "bl" );
        this.clocks[ 8 ].moveToPos( "v" );

        this.clocks[ 9 ].moveToPos( "v" );
        this.clocks[ 10 ].moveToPos( "v" );
        this.clocks[ 11 ].moveToPos( "v" );
        this.clocks[ 12 ].moveToPos( "v" );

        this.clocks[ 13 ].moveToPos( "v" );
        this.clocks[ 14 ].moveToPos( "v" );
        this.clocks[ 15 ].moveToPos( "v" );
        this.clocks[ 16 ].moveToPos( "v" );

        this.clocks[ 17 ].moveToPos( "v" );
        this.clocks[ 18 ].moveToPos( "tr" );
        this.clocks[ 19 ].moveToPos( "tl" );
        this.clocks[ 20 ].moveToPos( "v" );

        this.clocks[ 21 ].moveToPos( "tr" );
        this.clocks[ 22 ].moveToPos( "h" );
        this.clocks[ 23 ].moveToPos( "h" );
        this.clocks[ 24 ].moveToPos( "tl" );
    }

    toOne() {
        this.clocks[ 1 ].moveToPos( "br" );
        this.clocks[ 2 ].moveToPos( "h" );
        this.clocks[ 3 ].moveToPos( "bl" );
        this.clocks[ 4 ].moveToPos( "e" );

        this.clocks[ 5 ].moveToPos( "tr" );
        this.clocks[ 6 ].moveToPos( "bl" );
        this.clocks[ 7 ].moveToPos( "v" );
        this.clocks[ 8 ].moveToPos( "e" );

        this.clocks[ 9 ].moveToPos( "e" );
        this.clocks[ 10 ].moveToPos( "v" );
        this.clocks[ 11 ].moveToPos( "v" );
        this.clocks[ 12 ].moveToPos( "e" );

        this.clocks[ 13 ].moveToPos( "e" );
        this.clocks[ 14 ].moveToPos( "v" );
        this.clocks[ 15 ].moveToPos( "v" );
        this.clocks[ 16 ].moveToPos( "e" );

        this.clocks[ 17 ].moveToPos( "br" );
        this.clocks[ 18 ].moveToPos( "tl" );
        this.clocks[ 19 ].moveToPos( "tr" );
        this.clocks[ 20 ].moveToPos( "bl" );

        this.clocks[ 21 ].moveToPos( "tr" );
        this.clocks[ 22 ].moveToPos( "h" );
        this.clocks[ 23 ].moveToPos( "h" );
        this.clocks[ 24 ].moveToPos( "tl" );
    }

    toTwo() {
        this.clocks[ 1 ].moveToPos( "br" );
        this.clocks[ 2 ].moveToPos( "h" );
        this.clocks[ 3 ].moveToPos( "h" );
        this.clocks[ 4 ].moveToPos( "bl" );

        this.clocks[ 5 ].moveToPos( "tr" );
        this.clocks[ 6 ].moveToPos( "h" );
        this.clocks[ 7 ].moveToPos( "bl" );
        this.clocks[ 8 ].moveToPos( "v" );

        this.clocks[ 9 ].moveToPos( "br" );
        this.clocks[ 10 ].moveToPos( "h" );
        this.clocks[ 11 ].moveToPos( "tl" );
        this.clocks[ 12 ].moveToPos( "v" );

        this.clocks[ 13 ].moveToPos( "v" );
        this.clocks[ 14 ].moveToPos( "br" );
        this.clocks[ 15 ].moveToPos( "h" );
        this.clocks[ 16 ].moveToPos( "tl" );

        this.clocks[ 17 ].moveToPos( "v" );
        this.clocks[ 18 ].moveToPos( "tr" );
        this.clocks[ 19 ].moveToPos( "h" );
        this.clocks[ 20 ].moveToPos( "bl" );

        this.clocks[ 21 ].moveToPos( "tr" );
        this.clocks[ 22 ].moveToPos( "h" );
        this.clocks[ 23 ].moveToPos( "h" );
        this.clocks[ 24 ].moveToPos( "tl" );
    }

    toThree() {
        this.clocks[ 1 ].moveToPos( "br" );
        this.clocks[ 2 ].moveToPos( "h" );
        this.clocks[ 3 ].moveToPos( "h" );
        this.clocks[ 4 ].moveToPos( "bl" );

        this.clocks[ 5 ].moveToPos( "tr" );
        this.clocks[ 6 ].moveToPos( "h" );
        this.clocks[ 7 ].moveToPos( "bl" );
        this.clocks[ 8 ].moveToPos( "v" );

        this.clocks[ 9 ].moveToPos( "br" );
        this.clocks[ 10 ].moveToPos( "h" );
        this.clocks[ 11 ].moveToPos( "tl" );
        this.clocks[ 12 ].moveToPos( "v" );

        this.clocks[ 13 ].moveToPos( "tr" );
        this.clocks[ 14 ].moveToPos( "h" );
        this.clocks[ 15 ].moveToPos( "bl" );
        this.clocks[ 16 ].moveToPos( "v" );

        this.clocks[ 17 ].moveToPos( "br" );
        this.clocks[ 18 ].moveToPos( "h" );
        this.clocks[ 19 ].moveToPos( "tl" );
        this.clocks[ 20 ].moveToPos( "v" );

        this.clocks[ 21 ].moveToPos( "tr" );
        this.clocks[ 22 ].moveToPos( "h" );
        this.clocks[ 23 ].moveToPos( "h" );
        this.clocks[ 24 ].moveToPos( "tl" );
    }

    toFour() {
        this.clocks[ 1 ].moveToPos( "br" );
        this.clocks[ 2 ].moveToPos( "bl" );
        this.clocks[ 3 ].moveToPos( "br" );
        this.clocks[ 4 ].moveToPos( "bl" );

        this.clocks[ 5 ].moveToPos( "v" );
        this.clocks[ 6 ].moveToPos( "v" );
        this.clocks[ 7 ].moveToPos( "v" );
        this.clocks[ 8 ].moveToPos( "v" );

        this.clocks[ 9 ].moveToPos( "v" );
        this.clocks[ 10 ].moveToPos( "tr" );
        this.clocks[ 11 ].moveToPos( "tl" );
        this.clocks[ 12 ].moveToPos( "v" );

        this.clocks[ 13 ].moveToPos( "tr" );
        this.clocks[ 14 ].moveToPos( "h" );
        this.clocks[ 15 ].moveToPos( "bl" );
        this.clocks[ 16 ].moveToPos( "v" );

        this.clocks[ 17 ].moveToPos( "e" );
        this.clocks[ 18 ].moveToPos( "e" );
        this.clocks[ 19 ].moveToPos( "v" );
        this.clocks[ 20 ].moveToPos( "v" );

        this.clocks[ 21 ].moveToPos( "e" );
        this.clocks[ 22 ].moveToPos( "e" );
        this.clocks[ 23 ].moveToPos( "tr" );
        this.clocks[ 24 ].moveToPos( "tl" );
    }

    toFive() {
        this.clocks[ 1 ].moveToPos( "br" );
        this.clocks[ 2 ].moveToPos( "h" );
        this.clocks[ 3 ].moveToPos( "h" );
        this.clocks[ 4 ].moveToPos( "bl" );

        this.clocks[ 5 ].moveToPos( "v" );
        this.clocks[ 6 ].moveToPos( "br" );
        this.clocks[ 7 ].moveToPos( "h" );
        this.clocks[ 8 ].moveToPos( "tl" );

        this.clocks[ 9 ].moveToPos( "v" );
        this.clocks[ 10 ].moveToPos( "tr" );
        this.clocks[ 11 ].moveToPos( "h" );
        this.clocks[ 12 ].moveToPos( "bl" );

        this.clocks[ 13 ].moveToPos( "tr" );
        this.clocks[ 14 ].moveToPos( "h" );
        this.clocks[ 15 ].moveToPos( "bl" );
        this.clocks[ 16 ].moveToPos( "v" );

        this.clocks[ 17 ].moveToPos( "br" );
        this.clocks[ 18 ].moveToPos( "h" );
        this.clocks[ 19 ].moveToPos( "tl" );
        this.clocks[ 20 ].moveToPos( "v" );

        this.clocks[ 21 ].moveToPos( "tr" );
        this.clocks[ 22 ].moveToPos( "h" );
        this.clocks[ 23 ].moveToPos( "h" );
        this.clocks[ 24 ].moveToPos( "tl" );
    }

    toSix() {
        this.clocks[ 1 ].moveToPos( "br" );
        this.clocks[ 2 ].moveToPos( "h" );
        this.clocks[ 3 ].moveToPos( "h" );
        this.clocks[ 4 ].moveToPos( "bl" );

        this.clocks[ 5 ].moveToPos( "v" );
        this.clocks[ 6 ].moveToPos( "br" );
        this.clocks[ 7 ].moveToPos( "h" );
        this.clocks[ 8 ].moveToPos( "tl" );

        this.clocks[ 9 ].moveToPos( "v" );
        this.clocks[ 10 ].moveToPos( "tr" );
        this.clocks[ 11 ].moveToPos( "h" );
        this.clocks[ 12 ].moveToPos( "bl" );

        this.clocks[ 13 ].moveToPos( "v" );
        this.clocks[ 14 ].moveToPos( "br" );
        this.clocks[ 15 ].moveToPos( "bl" );
        this.clocks[ 16 ].moveToPos( "v" );

        this.clocks[ 17 ].moveToPos( "v" );
        this.clocks[ 18 ].moveToPos( "tr" );
        this.clocks[ 19 ].moveToPos( "tl" );
        this.clocks[ 20 ].moveToPos( "v" );

        this.clocks[ 21 ].moveToPos( "tr" );
        this.clocks[ 22 ].moveToPos( "h" );
        this.clocks[ 23 ].moveToPos( "h" );
        this.clocks[ 24 ].moveToPos( "tl" );
    }

    toSeven() {
        this.clocks[ 1 ].moveToPos( "br" );
        this.clocks[ 2 ].moveToPos( "h" );
        this.clocks[ 3 ].moveToPos( "h" );
        this.clocks[ 4 ].moveToPos( "bl" );

        this.clocks[ 5 ].moveToPos( "tr" );
        this.clocks[ 6 ].moveToPos( "h" );
        this.clocks[ 7 ].moveToPos( "bl" );
        this.clocks[ 8 ].moveToPos( "v" );

        this.clocks[ 9 ].moveToPos( "e" );
        this.clocks[ 10 ].moveToPos( "e" );
        this.clocks[ 11 ].moveTo( 0, 225 );
        this.clocks[ 12 ].moveTo( 0, 225 );
        this.clocks[ 13 ].moveToPos( "e" );
        this.clocks[ 14 ].moveTo( 180, 45 );
        this.clocks[ 15 ].moveTo( 180, 45 );
        this.clocks[ 16 ].moveToPos( "e" );

        this.clocks[ 17 ].moveToPos( "e" );
        this.clocks[ 18 ].moveToPos( "v" );
        this.clocks[ 19 ].moveToPos( "v" );
        this.clocks[ 20 ].moveToPos( "e" );

        this.clocks[ 21 ].moveToPos( "e" );
        this.clocks[ 22 ].moveToPos( "tr" );
        this.clocks[ 23 ].moveToPos( "tl" );
        this.clocks[ 24 ].moveToPos( "e" );
    }

    toEight() {
        this.clocks[ 1 ].moveToPos( "br" );
        this.clocks[ 2 ].moveToPos( "h" );
        this.clocks[ 3 ].moveToPos( "h" );
        this.clocks[ 4 ].moveToPos( "bl" );

        this.clocks[ 5 ].moveToPos( "v" );
        this.clocks[ 6 ].moveToPos( "br" );
        this.clocks[ 7 ].moveToPos( "bl" );
        this.clocks[ 8 ].moveToPos( "v" );

        this.clocks[ 9 ].moveTo( 0, 150 );
        this.clocks[ 10 ].moveToPos( "tr" );
        this.clocks[ 11 ].moveToPos( "tl" );
        this.clocks[ 12 ].moveTo( 0, 210 );

        this.clocks[ 13 ].moveTo( 180, 30 );
        this.clocks[ 14 ].moveToPos( "br" );
        this.clocks[ 15 ].moveToPos( "bl" );
        this.clocks[ 16 ].moveTo( 180, 330 );

        this.clocks[ 17 ].moveToPos( "v" );
        this.clocks[ 18 ].moveToPos( "tr" );
        this.clocks[ 19 ].moveToPos( "tl" );
        this.clocks[ 20 ].moveToPos( "v" );

        this.clocks[ 21 ].moveToPos( "tr" );
        this.clocks[ 22 ].moveToPos( "h" );
        this.clocks[ 23 ].moveToPos( "h" );
        this.clocks[ 24 ].moveToPos( "tl" );
    }

    toNine() {
        this.clocks[ 1 ].moveToPos( "br" );
        this.clocks[ 2 ].moveToPos( "h" );
        this.clocks[ 3 ].moveToPos( "h" );
        this.clocks[ 4 ].moveToPos( "bl" );

        this.clocks[ 5 ].moveToPos( "v" );
        this.clocks[ 6 ].moveToPos( "br" );
        this.clocks[ 7 ].moveToPos( "bl" );
        this.clocks[ 8 ].moveToPos( "v" );

        this.clocks[ 9 ].moveToPos( "v" );
        this.clocks[ 10 ].moveToPos( "tr" );
        this.clocks[ 11 ].moveToPos( "tl" );
        this.clocks[ 12 ].moveToPos( "v" );

        this.clocks[ 13 ].moveToPos( "tr" );
        this.clocks[ 14 ].moveToPos( "h" );
        this.clocks[ 15 ].moveToPos( "bl" );
        this.clocks[ 16 ].moveToPos( "v" );

        this.clocks[ 17 ].moveToPos( "br" );
        this.clocks[ 18 ].moveToPos( "h" );
        this.clocks[ 19 ].moveToPos( "tl" );
        this.clocks[ 20 ].moveToPos( "v" );

        this.clocks[ 21 ].moveToPos( "tr" );
        this.clocks[ 22 ].moveToPos( "h" );
        this.clocks[ 23 ].moveToPos( "h" );
        this.clocks[ 24 ].moveToPos( "tl" );
    }
}
