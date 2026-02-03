import { LightningElement, api } from 'lwc';

export default class EventFormPopup extends LightningElement {

    @api newEventTitle;

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
