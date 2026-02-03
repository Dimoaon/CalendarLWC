import { LightningElement, api } from 'lwc';

export default class EventFormPopup extends LightningElement {

    @api newEventTitle;
    @api mode; // 'quick' | 'full'

    get isQuick() {
        return this.mode === 'quick';
    }

    get isFull() {
        return this.mode === 'full';
    }

    close() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleInput(e) {
        this.dispatchEvent(
            new CustomEvent('titleinput', {
                detail: e.target.value
            })
        );
    }

    save() {
        this.dispatchEvent(new CustomEvent('save'));
    }
}
