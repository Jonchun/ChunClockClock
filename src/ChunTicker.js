import ChunTickerListener from "./ChunTickerListener";

export default class ChunTicker {
    constructor( intervalMs ) {
        intervalMs = ( typeof intervalMs === "undefined" ) ? 16.66 : intervalMs; // eslint-disable-line no-param-reassign

        this.head = new ChunTickerListener( null, null, Infinity );
        this.interval = false;
        this.intervalMs = intervalMs;
        this.started = false;
        this.lastTime = -1;
    }

    add( func, context, priority ) {
        priority = ( typeof priority === "undefined" ) ? 0 : priority; // eslint-disable-line no-param-reassign

        const listener = new ChunTickerListener( func, context, priority );

        let current = this.head.next;
        let prev = this.head;

        if ( current === null ) {
            listener.connect( prev );
        } else {
            // Insert based on priority. Higher priority values get executed first
            while ( current ) {
                if ( listener.priority > current.priority ) {
                    listener.connect( prev );
                    break;
                }
                prev = current;
                current = current.next;
            }

            // Insert listener into chain
            if ( listener.prev === null ) {
                listener.connect( prev );
            }
        }

        this.start();
        return this;
    }

    remove( func, context ) {
        let listener = this.head.next;

        while ( listener ) {
            if ( listener.compare( func, context ) ) {
                listener = listener.destroy();
            } else {
                listener = listener.next;
            }
        }

        return this;
    }

    start() {
        if ( !this.started ) {
            this.started = true;
            this.interval = setInterval( () => {
                this.update();
            }, this.intervalMs );
        }
    }

    update( currentTime = performance.now() ) {
        let elapsedMS;
        if ( currentTime > this.lastTime ) {
            elapsedMS = currentTime - this.lastTime;
            const head = this.head;
            this.lastTime = performance.now();
            let listener = head.next;

            while ( listener ) {
                listener = listener.run( elapsedMS );
            }

            if ( head.next === null ) {
                this.stop();
            }
        }
    }

    stop() {
        if ( this.started ) {
            this.started = false;
            clearInterval( this.interval );
        }
    }

    destroy() {
        this.stop();

        let listener = this.head.next;

        while ( listener ) {
            listener = listener.destroy();
        }

        this.head.delete();
        this.head = null;
    }
}
