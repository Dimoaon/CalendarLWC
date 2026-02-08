import { LightningElement, api } from 'lwc';

/* =====================
   CONSTANTS
   ===================== */

const OFFSET = 8;
const CARET_SIZE = 12;
const VIEWPORT_PADDING = 8;

const POPUP_HEIGHT = 260;

const DESKTOP_WIDTH_DEFAULT = 320;
const DESKTOP_WIDTH_ADD = 370;
const TABLET_WIDTH_DEFAULT = 260;
const TABLET_WIDTH_ADD = 300;

/* =====================
   COMPONENT
   ===================== */

export default class EventDetailsPopup extends LightningElement {

    /* =====================
       API
       ===================== */

    @api mode;          // 'list' | 'details' | 'addFull'
    @api events = [];
    @api event = null;
    @api rect;

    /* =====================
       FORM STATE
       ===================== */

    title = '';
    participants = '';
    description = '';

    /* =====================
       VALIDATION
       ===================== */

    showErrors = false;

    /* =====================
       CARET STATE
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
       VALIDATION HELPERS
       ===================== */

    get hasTitleError() {
        return this.showErrors && !this.title.trim();
    }

    get hasParticipantsError() {
        return this.showErrors && !this.participants.trim();
    }

    /* =====================
       CLASS GETTERS
       ===================== */

    get titleInputClass() {
        return `event-form__input${this.hasTitleError ? ' is-error' : ''}`;
    }

    get participantsInputClass() {
        return `event-form__input${this.hasParticipantsError ? ' is-error' : ''}`;
    }

    get titleLabelClass() {
        return `event-form__label required${this.hasTitleError ? ' is-error' : ''}`;
    }

    get participantsLabelClass() {
        return `event-form__label required${this.hasParticipantsError ? ' is-error' : ''}`;
    }

    /* =====================
       RESPONSIVE WIDTH
       ===================== */

    get popupWidth() {
        const vw = window.innerWidth;

        // MOBILE
        if (vw <= 768) {
            return null;
        }

        // TABLET
        if (vw <= 1024) {
            return this.isAddMode
                ? TABLET_WIDTH_ADD
                : TABLET_WIDTH_DEFAULT;
        }

        // DESKTOP
        return this.isAddMode
            ? DESKTOP_WIDTH_ADD
            : DESKTOP_WIDTH_DEFAULT;
    }

    /* =====================
       CARET STYLE
       ===================== */

    get caretStyle() {
        return `top:${this.caretTop}px;left:${this.caretLeft}px;`;
    }

    /* =====================
       POSITIONING
       ===================== */

    get popupStyle() {
        if (!this.rect) return '';

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const popupWidth = this.popupWidth;

        /* =====================
           MOBILE — CENTER SCREEN
           ===================== */

        if (vw <= 768) {
            this._applyClasses({ flipX: false });

            return `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: var(--z-overlay);
            `;
        }

        /* =====================
           TABLET — CENTER CALENDAR
           ===================== */

        if (vw <= 1024) {
            this._applyClasses({ flipX: false });

            return `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: var(--z-overlay);
            `;
        }

        /* =====================
           DESKTOP — SIDE POPUP
           ===================== */

        const anchorY = this.rect.top + this.rect.height / 2;

        let top = anchorY - POPUP_HEIGHT / 2;
        let left = this.rect.left - popupWidth - OFFSET;
        let placedLeft = true;

        if (left < VIEWPORT_PADDING) {
            left = this.rect.right + OFFSET;
            placedLeft = false;
        }

        top = Math.max(
            VIEWPORT_PADDING,
            Math.min(top, vh - POPUP_HEIGHT - VIEWPORT_PADDING)
        );

        this.caretTop = Math.max(
            12,
            Math.min(anchorY - top - CARET_SIZE / 2, POPUP_HEIGHT - 24)
        );

        this.caretLeft = placedLeft
            ? popupWidth - CARET_SIZE / 2 - 1
            : -CARET_SIZE / 2;

        this._applyClasses({ flipX: !placedLeft });

        return `
            position: fixed;
            top: ${top}px;
            left: ${left}px;
            z-index: var(--z-overlay);
        `;
    }

    /* =====================
       CLASS MANAGER
       ===================== */

    _applyClasses({ flipX }) {
        requestAnimationFrame(() => {
            const popup = this.template.querySelector('.event-popup');
            if (!popup) return;

            popup.classList.toggle('event-popup--add', this.isAddMode);
            popup.classList.toggle('event-popup--flip-x', flipX);
        });
    }

    /* =====================
       COMMON
       ===================== */

    close() {
        this.resetForm();
        this.dispatchEvent(new CustomEvent('close'));
    }

    resetForm() {
        this.title = '';
        this.participants = '';
        this.description = '';
        this.showErrors = false;
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
       ADD FULL — INPUTS
       ===================== */

    handleTitleInput(e) {
        this.title = e.target.value;
        if (this.showErrors) this.showErrors = false;
    }

    handleParticipantsInput(e) {
        this.participants = e.target.value;
        if (this.showErrors) this.showErrors = false;
    }

    handleDescriptionInput(e) {
        this.description = e.target.value;
    }

    /* =====================
       ADD FULL — SAVE
       ===================== */

    save() {
        this.showErrors = true;

        if (!this.title.trim() || !this.participants.trim()) return;

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
