import { LightningElement, api } from 'lwc';

/* =====================
   CONSTANTS
   ===================== */

const OFFSET = 8;
const POPUP_WIDTH_DEFAULT = 320;
const POPUP_WIDTH_ADD = 370;
const POPUP_HEIGHT = 260;
const CARET_SIZE = 12;
const VIEWPORT_PADDING = 8;

export default class EventDetailsPopup extends LightningElement {

    /* =====================
       API
       ===================== */

    @api mode;            // 'list' | 'details' | 'addFull'
    @api events = [];
    @api event = null;    // используется ТОЛЬКО в details
    @api rect;            // DOMRect calendar-cell

    /* =====================
       FORM STATE (ADD FULL)
       ===================== */

    title = '';
    participants = '';
    description = '';

    /* =====================
       INTERNAL STATE
       ===================== */

    caretTop = 0;
    caretLeft = 0;

    /* =====================
       MODE HELPERS
       ===================== */

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

    /* =====================
       SIZE
       ===================== */

    get popupWidth() {
        return this.isAddMode
            ? POPUP_WIDTH_ADD
            : POPUP_WIDTH_DEFAULT;
    }

    /* =====================
       CARET STYLE
       ===================== */

    get caretStyle() {
        return `top:${this.caretTop}px;left:${this.caretLeft}px;`;
    }

    /* =====================
       POSITIONING (SIDE)
       ===================== */

    get popupStyle() {
        if (!this.rect) return '';

        const viewportH = window.innerHeight;
        const popupHeight = POPUP_HEIGHT;
        const popupWidth = this.popupWidth;

        const anchorY = this.rect.top + this.rect.height / 2;

        let top = anchorY - popupHeight / 2;
        let left = this.rect.left - popupWidth - OFFSET;
        let placedLeft = true;

        if (left < VIEWPORT_PADDING) {
            left = this.rect.right + OFFSET;
            placedLeft = false;
        }

        if (top < VIEWPORT_PADDING) {
            top = VIEWPORT_PADDING;
        }

        if (top + popupHeight > viewportH - VIEWPORT_PADDING) {
            top = viewportH - popupHeight - VIEWPORT_PADDING;
        }

        this.caretTop = Math.max(
            12,
            Math.min(anchorY - top - CARET_SIZE / 2, popupHeight - 24)
        );

        this.caretLeft = placedLeft
            ? popupWidth - CARET_SIZE / 2
            : -CARET_SIZE / 2;

        requestAnimationFrame(() => {
            const popup = this.template.querySelector('.event-popup');
            if (popup) {
                popup.classList.toggle('event-popup--add', this.isAddMode);
            }
        });

        return `position:fixed;top:${top}px;left:${left}px;z-index:var(--z-overlay);`;
    }

    /* =====================
       COMMON
       ===================== */

    close() {
        this.dispatchEvent(new CustomEvent('close'));
        this.resetForm();
    }

    resetForm() {
        this.title = '';
        this.participants = '';
        this.description = '';
    }

    /* =====================
       LIST MODE
       ===================== */

    handleSelect(e) {
        const id = Number(e.currentTarget.dataset.id);
        const selected = this.events.find(ev => ev.id === id);
        if (!selected) return;

        this.dispatchEvent(
            new CustomEvent('selectevent', { detail: selected })
        );
    }

    handleAdd() {
        this.dispatchEvent(new CustomEvent('addevent'));
    }

    /* =====================
       ADD FULL – INPUTS
       ===================== */

    handleTitleInput(e) {
        this.title = e.target.value;
    }

    handleParticipantsInput(e) {
        this.participants = e.target.value;
    }

    handleDescriptionInput(e) {
        this.description = e.target.value;
    }

    /* =====================
       ADD FULL – SAVE
       ===================== */

    save() {
        if (!this.title.trim() || !this.participants.trim()) {
            return;
        }

        const newEvent = {
            id: Date.now(),
            title: this.title.trim(),
            participants: this.participants.trim(),
            description: this.description.trim()
        };

        this.dispatchEvent(
            new CustomEvent('save', { detail: newEvent })
        );

        this.resetForm();
    }

    /* =====================
       DETAILS MODE
       ===================== */

    handleDelete() {
        if (!this.event) return;

        this.dispatchEvent(
            new CustomEvent('deleteevent', { detail: this.event.id })
        );
    }
}
