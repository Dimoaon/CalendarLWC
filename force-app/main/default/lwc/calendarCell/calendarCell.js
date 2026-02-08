import { LightningElement, api } from 'lwc';

const DESKTOP_MAX_EVENTS = 4;
const MOBILE_MAX_EVENTS = 2;
const MOBILE_BREAKPOINT = 800;

export default class CalendarCell extends LightningElement {
    @api cell;

    /* =====================
       RESPONSIVE HELPERS
       ===================== */

    isMobile = false;

    connectedCallback() {
        this.isMobile = window.matchMedia(
            `(max-width: ${MOBILE_BREAKPOINT}px)`
        ).matches;
    }

    /* =====================
       COMPUTED
       ===================== */

    get events() {
        return this.cell?.events || [];
    }

    get maxVisibleEvents() {
        return this.isMobile
            ? MOBILE_MAX_EVENTS
            : DESKTOP_MAX_EVENTS;
    }

    get hasOverflow() {
        return this.events.length > this.maxVisibleEvents;
    }

    get visibleEvents() {
        return this.hasOverflow
            ? this.events.slice(0, this.maxVisibleEvents)
            : this.events;
    }

    get hiddenCount() {
        return this.events.length - this.maxVisibleEvents;
    }

    /* =====================
       WEEKDAY LABEL
       ===================== */

    get weekdayLabel() {
        if (!this.cell?.weekday) return '';

        return this.isMobile
            ? this.cell.weekday.slice(0, 3)
            : this.cell.weekday + ',';
    }

    /* =====================
       EVENTS
       ===================== */

    handleClick() {
        if (!this.cell?.dateKey) return;

        const rect = this.template.host.getBoundingClientRect();

        this.dispatchEvent(
            new CustomEvent('cellclick', {
                detail: {
                    dateKey: this.cell.dateKey,
                    events: this.events,
                    rect
                },
                bubbles: true,
                composed: true
            })
        );
    }
}
