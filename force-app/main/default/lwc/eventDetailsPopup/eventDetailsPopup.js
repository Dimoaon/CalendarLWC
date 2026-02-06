import { LightningElement, api } from 'lwc';

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
    @api event = null;
    @api newEventTitle = '';
    @api rect;            // DOMRect of calendar-cell

    /* =====================
       INTERNAL STATE
       ===================== */

    caretTop = 0;
    caretLeft = 0;

    /* =====================
       MODE
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
        return `
            top: ${this.caretTop}px;
            left: ${this.caretLeft}px;
        `;
    }

    /* =====================
       POSITIONING (SIDE-BASED)
       ===================== */

    get popupStyle() {
        if (!this.rect) return '';

        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;

        const popupWidth = this.popupWidth;
        const popupHeight = POPUP_HEIGHT;

        // центр ячейки по Y
        const anchorY = this.rect.top + this.rect.height / 2;

        let top;
        let left;
        let placeLeft = true;

        /* ---------- HORIZONTAL ---------- */
        // по умолчанию — слева от ячейки
        left = this.rect.left - popupWidth - OFFSET;

        // если не помещается — справа
        if (left < VIEWPORT_PADDING) {
            left = this.rect.right + OFFSET;
            placeLeft = false;
        }

        /* ---------- VERTICAL ---------- */
        top = anchorY - popupHeight / 2;

        // ограничение сверху
        if (top < VIEWPORT_PADDING) {
            top = VIEWPORT_PADDING;
        }

        // ограничение снизу
        if (top + popupHeight > viewportH - VIEWPORT_PADDING) {
            top = viewportH - popupHeight - VIEWPORT_PADDING;
        }

        /* ---------- CARET POSITION ---------- */
        this.caretTop = anchorY - top - CARET_SIZE / 2;

        // не даём caret выйти за края попапа
        this.caretTop = Math.max(
            12,
            Math.min(this.caretTop, popupHeight - 24)
        );

        this.caretLeft = placeLeft
            ? popupWidth - CARET_SIZE / 2   // caret справа
            : -CARET_SIZE / 2;              // caret слева

        /* ---------- APPLY CLASSES ---------- */
        requestAnimationFrame(() => {
            const popup = this.template.querySelector('.event-popup');
            if (!popup) return;

            popup.classList.toggle('event-popup--add', this.isAddMode);
        });

        return `
            position: fixed;
            top: ${top}px;
            left: ${left}px;
            z-index: var(--z-overlay);
        `;
    }

    /* =====================
       COMMON
       ===================== */

    close() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    /* =====================
       LIST MODE
       ===================== */

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

    /* =====================
       ADD FULL MODE
       ===================== */

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

    /* =====================
       DETAILS MODE
       ===================== */

    handleDelete() {
        if (!this.event) return;

        this.dispatchEvent(
            new CustomEvent('deleteevent', {
                detail: this.event.id
            })
        );
    }
}
