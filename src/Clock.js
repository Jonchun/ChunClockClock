export default class Clock {
    constructor( app, options ) {
        /* @object : JSON object with optional parameters. */
        options = ( typeof options === "undefined" ) ? {} : options; // eslint-disable-line no-param-reassign
        this.pixi = app;

        this.xPos = ( typeof options.xPos === "undefined" ) ? 100 : options.xPos;
        this.yPos = ( typeof options.yPos === "undefined" ) ? 100 : options.yPos;
        this.calcMinuteHand();
        this.calcHourHand();

        /* @number : Radius of the clock. */
        this.radius = ( typeof options.radius === "undefined" ) ? 60 : options.radius;

        /* @number : Default width of the hands when drawing lines. */
        this.defaultLineWidth = ( typeof options.defaultLineWidth === "undefined" ) ? Math.floor( this.radius * 0.03 ) : options.defaultLineWidth;
        this.defaultHandWidth = ( typeof options.defaultHandWidth === "undefined" ) ? this.radius * 0.15 : options.defaultHandWidth;

        /* @number : Radius of the middle circle on clock. */
        this.radiusMiddle = this.defaultHandWidth * 0.75;

        /* @number : Angle of the minute hand. Starts at random position. */
        this.minAngle = ( typeof options.minAngle === "undefined" ) ? Math.floor( Math.random() * ( 360 ) ) : options.minAngle;
        this.deltaMinute = 0;
        this.goalMinAngle = 0;

        /* @number : Angle of the hour hand. Starts at random position. */
        this.hourAngle = ( typeof options.hourAngle === "undefined" ) ? Math.floor( Math.random() * ( 360 ) ) : options.hourAngle;
        this.deltaHour = 0;
        this.goalHourAngle = 0;

        /* @string : Background color of the Clock's canvas. */
        this.bgColor = ( typeof options.bgColor === "undefined" ) ? "#FFFFFF" : options.bgColor;

        /* @string : Stroke Color of Clock Hands. */
        this.strokeColor = ( typeof options.strokeColor === "undefined" ) ? 0x000000 : options.strokeColor;

        /* @number : Timestamp of when interval was set */
        this.intervalStarted = false;
    }

    static toRadians( angle ) {
        return angle * ( Math.PI / 180 );
    }

    static addAngle( angle1, angle2 ) {
        let sum = angle1 + angle2;
        if ( sum >= 360 ) {
            sum -= 360;
        } else if ( sum < 0 ) {
            sum += 360;
        }
        return sum;
    }

    /* @array : Returns True if angle1 + delta passes or meets angle2 in a 360 degree circle.
     *          Returns sum of angle1 and delta translated to stay within 360 degrees.
     */
    static deltaAngle( angle1, angle2, delta ) {
        let sum = angle1 + delta;
        const sumOriginal = sum;
        let goalAngle = angle2;
        let result = false;

        /* Loop degrees to stay within 360 */
        if ( sum >= 360 ) {
            sum -= 360;
        } else if ( sum < 0 ) {
            sum += 360;
        }

        /* If delta is negative, the new sum should be less than the goal angle */
        if ( delta < 0 ) {
            if ( angle1 < angle2 ) {
                goalAngle -= 360;
            }
            if ( sumOriginal <= goalAngle ) {
                result = true;
            }
        }

        /* If delta is positive, the new sum should be greater than the goal angle */
        if ( delta > 0 ) {
            if ( angle1 > angle2 ) {
                goalAngle += 360;
            }
            if ( sumOriginal >= goalAngle ) {
                result = true;
            }
        }

        return [ result, sum ];
    }

    static compareAngle( angle1, angle2 ) {
        const diff = Math.abs( angle1 - angle2 );
        if ( diff <= 3 ) {
            return true;
        }
        return false;
    }

    /* @number : returns a random multiplier used to change speeds at which the clock hands move */
    static randomAngleMultiplier() {
        return 1 + Math.random();
    }

    render() {
        this.drawHands();
    }

    renderFresh( options ) {
        this.xPos = ( typeof options.xPos === "undefined" ) ? 100 : options.xPos;
        this.yPos = ( typeof options.yPos === "undefined" ) ? 100 : options.yPos;
        this.radius = ( typeof options.radius === "undefined" ) ? 60 : options.radius;
        this.defaultLineWidth = ( typeof options.defaultLineWidth === "undefined" ) ? Math.floor( this.radius * 0.03 ) : options.defaultLineWidth;
        this.defaultLineWidth = ( this.defaultLineWidth === 0 ) ? 1 : this.defaultLineWidth;
        this.defaultHandWidth = ( typeof options.defaultHandWidth === "undefined" ) ? Math.floor( this.radius * 0.15 ) : options.defaultHandWidth;
        this.defaultHandWidth = ( this.defaultHandWidth === 0 ) ? 1 : this.defaultHandWidth;
        this.radiusMiddle = this.defaultHandWidth * 0.75;

        this.calcMinuteHand();
        this.calcHourHand();

        this.drawFace();
        this.drawHands();
    }

    resize( canvasWidth, canvasHeight ) {
        this.canvas.setAttribute( "width", canvasWidth );
        this.canvas.setAttribute( "height", canvasHeight );
    }

    drawFace() {
        // Outer Circle
        this.pixi.clockFaces.lineStyle( this.defaultLineWidth, 0x000000, 1 );
        this.pixi.clockFaces.drawCircle( this.xPos, this.yPos, this.radius );

        // Middle Circle
        this.pixi.clockFaces.lineStyle( 0 );
        this.pixi.clockFaces.beginFill( 0x000000, 1 );
        this.pixi.clockFaces.drawCircle( this.xPos, this.yPos, this.radiusMiddle );
        this.pixi.clockFaces.endFill();
    }

    moveToPos( position ) {
        switch ( position ) {
        case "vertical":
        case "v":
            this.moveTo( 180, 0 );
            break;
        case "horizontal":
        case "h":
            this.moveTo( 270, 90 );
            break;
        case "topLeft":
        case "tl":
            this.moveTo( 270, 0 );
            break;
        case "topRight":
        case "tr":
            this.moveTo( 90, 0 );
            break;
        case "bottomRight":
        case "br":
            this.moveTo( 180, 90 );
            break;
        case "bottomLeft":
        case "bl":
            this.moveTo( 270, 180 );
            break;
        case "empty":
        case "e":
            this.moveTo( 225, 225 );
            break;
        default:
            console.log( "Error: Unknown position" );
        }
    }

    moveTo( hourAngle, minAngle ) {
        this.deltaHour = Math.random() < 0.5 ? 4 : -4;
        this.deltaMinute = this.deltaHour * -1;

        this.deltaHour += this.deltaHour > 0 ? Math.random() : -1 * Math.random();
        this.deltaMinute += this.deltaMinute > 0 ? Math.random() : -1 * Math.random();

        this.goalHourAngle = hourAngle;
        this.goalMinAngle = minAngle;

        this.intervalStarted = Date.now();
        this.pixi.logicTicker.add( this.moveToHelper, this );
    }

    moveToHelper() {
        const timeElapsed = Date.now() - this.intervalStarted;
        const MIN_TIME = 1000;
        const MAX_TIME = 7500;
        const WARN_TIME = MAX_TIME - 1500;

        if ( timeElapsed > WARN_TIME ) {
            this.deltaHour = ( this.deltaHour > 0 ) ? this.deltaHour + 1 : this.deltaHour - 1; // eslint-disable-line no-param-reassign
            this.deltaMinute = ( this.deltaMinute > 0 ) ? this.deltaMinute + 1 : this.deltaMinute - 1; // eslint-disable-line no-param-reassign
        }

        const minDeltaAngle = Clock.deltaAngle( this.minAngle, this.goalMinAngle, this.deltaMinute );

        if ( minDeltaAngle[ 0 ] && timeElapsed > MIN_TIME ) {
            this.minAngle = this.goalMinAngle;
        } else {
            this.minAngle = minDeltaAngle[ 1 ];
        }

        const hourDeltaAngle = Clock.deltaAngle( this.hourAngle, this.goalHourAngle, this.deltaHour );
        if ( hourDeltaAngle[ 0 ] && timeElapsed > MIN_TIME ) {
            this.hourAngle = this.goalHourAngle;
        } else {
            this.hourAngle = hourDeltaAngle[ 1 ];
        }

        this.calcMinuteHand();
        this.calcHourHand();

        if ( ( timeElapsed > MAX_TIME ) || ( this.minAngle === this.goalMinAngle && this.hourAngle === this.goalHourAngle && timeElapsed > MIN_TIME ) ) {
            this.minAngle = this.goalMinAngle;
            this.hourAngle = this.goalHourAngle;
            this.calcMinuteHand();
            this.calcHourHand();
            this.pixi.logicTicker.remove( this.moveToHelper, this );
            this.intervalStarted = false;
        }
    }

    calcMinuteHand() {
        const angle = Clock.toRadians( this.minAngle );
        this.newXPosMin = this.xPos + ( Math.sin( angle ) * this.radius * 0.9 );
        this.newYPosMin = this.yPos - ( Math.cos( angle ) * this.radius * 0.9 );
    }

    calcHourHand() {
        const angle = Clock.toRadians( this.hourAngle );
        this.newXPosHour = this.xPos + ( Math.sin( angle ) * this.radius * 0.8 );
        this.newYPosHour = this.yPos - ( Math.cos( angle ) * this.radius * 0.8 );
    }

    drawHands( lineWidth, strokeStyle ) {
        lineWidth = ( typeof lineWidth === "undefined" ) ? this.defaultHandWidth : lineWidth; // eslint-disable-line no-param-reassign
        strokeStyle = ( typeof strokeStyle === "undefined" ) ? this.strokeColor : strokeStyle; // eslint-disable-line no-param-reassign

        // Hour Hand
        this.pixi.clockHands.lineStyle( lineWidth, strokeStyle, 1 );
        this.pixi.clockHands.moveTo( this.xPos, this.yPos );
        this.pixi.clockHands.lineTo( this.newXPosHour, this.newYPosHour );

        // Minute Hand
        this.pixi.clockHands.lineStyle( lineWidth, strokeStyle, 1 );
        this.pixi.clockHands.moveTo( this.xPos, this.yPos );
        this.pixi.clockHands.lineTo( this.newXPosMin, this.newYPosMin );
    }
}
