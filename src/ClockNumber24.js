import ClockDigit24 from "./ClockDigit24";

export default class ClockNumber24 {
    constructor( app, digits, options ) {
        this.digits = digits;
        this.clockdigits = [];
        this.movingInterval = false;
        this.currentValue = undefined;
        this.radius = ( typeof options.radius === "undefined" ) ? 75 : options.radius;

        this.topMargin = ( typeof options.topMargin === "undefined" ) ? 0 : options.topMargin;
        this.leftMargin = ( typeof options.leftMargin === "undefined" ) ? 0 : options.leftMargin;
        this.clockMargin = ( typeof options.clockMargin === "undefined" ) ? 0 : options.clockMargin;

        this.xOffset = ( typeof options.xOffset === "undefined" ) ? 0 : options.xOffset;
        this.yOffset = ( typeof options.yOffset === "undefined" ) ? 0 : options.yOffset;

        for ( let i = 1; i <= digits; i++ ) {
            const digitOptions = {
                topMargin: this.topMargin,
                leftMargin: this.leftMargin,
                clockMargin: this.clockMargin,
                xOffset: ( i - 1 ) + this.xOffset,
                yOffset: this.yOffset,
                radius: this.radius,
            };
            this.clockdigits[ i ] = new ClockDigit24( app, digitOptions );
        }
    }

    render() {
        for ( let i = 1; i <= this.digits; i++ ) {
            this.clockdigits[ i ].render();
        }
    }

    renderFresh( options ) {
        this.radius = options.radius;
        this.topMargin = options.topMargin;
        this.leftMargin = options.leftMargin;
        this.clockMargin = options.clockMargin;
        this.xOffset = ( typeof options.xOffset === "undefined" ) ? this.xOffset : options.xOffset;
        this.yOffset = ( typeof options.yOffset === "undefined" ) ? this.yOffset : options.yOffset;

        for ( let i = 1; i <= this.digits; i++ ) {
            options.xOffset = ( i - 1 ) + this.xOffset; // eslint-disable-line no-param-reassign
            options.yOffset = this.yOffset; // eslint-disable-line no-param-reassign
            this.clockdigits[ i ].renderFresh( options );
        }
    }

    resize( canvasWidth, canvasHeight ) {
        for ( let i = 1; i <= this.digits; i++ ) {
            this.clockdigits[ i ].resize( canvasWidth, canvasHeight );
        }
    }

    checkMoving() {
        let check = 0;
        for ( let i = 1; i <= this.digits; i++ ) {
            if ( this.clockdigits[ i ].movingInterval === false ) {
                check += 1;
            }
        }
        if ( check === this.digits ) {
            clearInterval( this.movingInterval );
            this.movingInterval = false;
        }
    }

    toNumber( number ) {
        if ( this.currentValue === number ) {
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

        let stringNumber = parseInt( number, 10 ).toString();

        if ( stringNumber.length > this.digits ) {
            console.log( "Error: Number too big" );
            stringNumber = stringNumber.substring( 0, this.digits );
        }

        // Prepend 0s as necessary
        if ( stringNumber.length < this.digits ) {
            for ( let i = this.digits - stringNumber.length; i > 0; i-- ) {
                stringNumber = `0${ stringNumber }`;
            }
        }

        for ( let i = 1; i <= this.digits; i++ ) {
            const digit = parseInt( stringNumber[ i - 1 ], 10 );
            this.clockdigits[ i ].toDigit( digit );
        }
        this.currentValue = number;
        return true;
    }
}
