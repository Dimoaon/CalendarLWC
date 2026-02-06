import { LightningElement, api } from 'lwc';

export default class EventDetailsPopup extends LightningElement {

    /* ===================== API ===================== */

    @api mode;            // 'list' | 'details' | 'addFull'
    @api events = [];
    @api event = null;
    @api newEventTitle = '';
    @api rect;            // ← позиционирование от calendar-cell

    /* ===================== MODE ===================== */

    get isListMode() {
        return this.mode === 'list';
    }

    get isDetailsMode() {
        return this.mode === 'details';
    }

    get isAddMode() {
        return this.mode === 'addFull';
    }

    get hasEvents() {
        return Array.isArray(this.events) && this.events.length > 0;
    }

    /* ===================== POSITION ===================== */

    get popupStyle() {
        if (!this.rect) return '';

        const OFFSET = 8;

        return `
            position: fixed;
            top: ${this.rect.bottom + OFFSET}px;
            left: ${this.rect.left}px;
            z-index: 1000;
        `;
    }

    /* ===================== COMMON ===================== */

    close() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    /* ===================== LIST ===================== */

    handleSelect(e) {
        const id = Number(e.currentTarget.dataset.id);
        const selected = this.events.find(ev => ev.id === id);
        if (!selected) return;

        this.dispatchEvent(
            new CustomEvent('selectevent', {
                detail: selected
            })
        );
    }

    handleAdd() {
        this.dispatchEvent(new CustomEvent('addevent'));
    }

    /* ===================== ADD FULL ===================== */

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

    /* ===================== DETAILS ===================== */

    handleDelete() {
        if (!this.event) return;

        this.dispatchEvent(
            new CustomEvent('deleteevent', {
                detail: this.event.id
            })
        );
    }

    get popupStyle() {
        if (!this.rect) return '';

        const OFFSET = 8;
        const POPUP_WIDTH = 320;
        const POPUP_HEIGHT = 260;

        let top = this.rect.bottom + OFFSET;
        let left = this.rect.left;

        // flip horizontally
        if (left + POPUP_WIDTH > window.innerWidth) {
            left = this.rect.right - POPUP_WIDTH;
        }

        // flip vertically
        if (top + POPUP_HEIGHT > window.innerHeight) {
            top = this.rect.top - POPUP_HEIGHT - OFFSET;
        }

        return `
            position: fixed;
            top: ${top}px;
            left: ${left}px;
            z-index: var(--z-overlay);
        `;
    }

}
