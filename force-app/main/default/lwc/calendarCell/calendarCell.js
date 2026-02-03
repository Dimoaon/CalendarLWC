import { LightningElement, api } from 'lwc';

export default class CalendarCell extends LightningElement {
    @api cell;

    handleClick() {
        if (!this.cell.dateKey) return;

        this.dispatchEvent(
            new CustomEvent('cellclick', {
                detail: this.cell.dateKey,
                bubbles: true,
                composed: true
            })
        );
    }

    handleEventClick(e) {
        e.stopPropagation();

        const id = Number(e.currentTarget.dataset.id);

        const eventObj =
            this.cell.events.find(ev => ev.id === id);

        const rect =
            this.template.host.getBoundingClientRect();

        this.dispatchEvent(
            new CustomEvent('eventclick', {
                detail: {
                    event: eventObj,
                    rect
                },
                bubbles: true,
                composed: true
            })
        );
    }

}
