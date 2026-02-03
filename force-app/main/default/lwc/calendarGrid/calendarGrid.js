import { LightningElement, api } from 'lwc';

export default class CalendarGrid extends LightningElement {
    @api cells;

    handleCellClick(e) {
        this.dispatchEvent(
            new CustomEvent('cellclick', {
                detail: e.detail
            })
        );
    }

    handleEventClick(e) {
        this.dispatchEvent(
            new CustomEvent('eventclick', {
                detail: e.detail
            })
        );
    }
}
