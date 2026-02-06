import { LightningElement, api } from 'lwc';

export default class CalendarGrid extends LightningElement {
    @api cells;

    handleCellClick(e) {
        this.dispatchEvent(
            new CustomEvent('cellclick', {
                detail: e.detail,
                bubbles: true,
                composed: true
            })
        );
    }
}
