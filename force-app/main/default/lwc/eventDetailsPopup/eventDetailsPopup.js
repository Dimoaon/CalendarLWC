import { LightningElement, api } from 'lwc';

export default class EventDetailsPopup extends LightningElement {

    @api mode;   // 'list' | 'details'
    @api events = [];
    @api event;

    get isListMode() {
        return this.mode === 'list';
    }

    get isDetailsMode() {
        return this.mode === 'details';
    }

    get hasEvents() {
        return this.events && this.events.length > 0;
    }

    close() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleAdd() {
        this.dispatchEvent(new CustomEvent('addevent'));
    }

    handleSelect(e) {
        const id = Number(e.currentTarget.dataset.id);
        const selected =
            this.events.find(ev => ev.id === id);

        this.dispatchEvent(
            new CustomEvent('selectevent', {
                detail: selected
            })
        );
    }

    handleDelete() {
        this.dispatchEvent(
            new CustomEvent('deleteevent', {
                detail: this.event.id
            })
        );
    }
}
