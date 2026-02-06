import { LightningElement, api } from 'lwc';

const MAX_VISIBLE_EVENTS = 4;

export default class CalendarCell extends LightningElement {
    @api cell;

    /* =====================
       COMPUTED
       ===================== */

    get events() {
        return this.cell?.events || [];
    }

    get hasOverflow() {
        return this.events.length > MAX_VISIBLE_EVENTS;
    }

    get visibleEvents() {
        return this.hasOverflow
            ? this.events.slice(0, MAX_VISIBLE_EVENTS)
            : this.events;
    }

    get hiddenCount() {
        return this.events.length - MAX_VISIBLE_EVENTS;
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
