import { LightningElement, api } from 'lwc';

export default class EventDetailsPopup extends LightningElement {

    @api event;
    @api rect;

    get style() {
        if (!this.rect) return '';

        return `
            position: fixed;
            top: ${this.rect.top + 40}px;
            left: ${this.rect.left}px;
        `;
    }

    close() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleDelete() {
        this.dispatchEvent(
            new CustomEvent('deleteevent', {
                detail: this.event.id
            })
        );
    }

}
