import { LightningElement, api } from 'lwc';

export default class CalendarCell extends LightningElement {
    @api cell;

    handleClick() {
        if (!this.cell.dateKey) return;

        this.dispatchEvent(
            new CustomEvent('cellclick', {
                detail: {
                    dateKey: this.cell.dateKey,
                    events: this.cell.events || []
                },
                bubbles: true,
                composed: true
            })
        );
    }
}
