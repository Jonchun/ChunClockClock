export default class ChunTickerListener {
    constructor( func, context, priority ) {
        context = ( typeof context === "undefined" ) ? null : context; // eslint-disable-line no-param-reassign
        priority = ( typeof priority === "undefined" ) ? 0 : priority; // eslint-disable-line no-param-reassign

        this.destroyed = false;

        this.func = func;
        this.context = context;
        this.priority = priority;
        this.next = null;
        this.prev = null;
    }

    compare( func, context ) {
        context = ( typeof context === "undefined" ) ? null : context; // eslint-disable-line no-param-reassign
        return this.func === func && this.context === context;
    }

    run() {
        if ( this.context === null ) {
            this.func();
        } else {
            this.func.call( this.context );
        }

        const next = this.next;

        if ( this.destroyed ) {
            this.next = null;
        }

        return next;
    }

    connect( prevListener ) {
        this.prev = prevListener;

        if ( prevListener.next !== null ) {
            prevListener.next.prev = this;
        }

        this.next = prevListener.next;
        prevListener.next = this;
    }

    destroy( force = false ) {
        this.destroyed = true;

        if ( this.prev !== null ) {
            this.prev.next = this.next;
        }
        if ( this.next !== null ) {
            this.next.prev = this.prev;
        }

        const next = this.next;

        // Remove references
        this.func = null;
        this.context = null;
        this.next = force ? null : next;
        this.previous = null;

        return next;
    }
}
