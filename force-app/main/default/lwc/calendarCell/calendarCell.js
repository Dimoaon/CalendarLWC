import { LightningElement, api } from 'lwc';

export default class CalendarCell extends LightningElement {
    @api cell;

    handleClick() {
        // клики по "пустым" (prev/next month) клеткам игнорируем
        if (!this.cell?.dateKey) return;

        /**
         * rect — это ЯКОРЬ для всех popup'ов:
         * list / details / addFull
         */
        const rect = this.template.host.getBoundingClientRect();

        this.dispatchEvent(
            new CustomEvent('cellclick', {
                detail: {
                    dateKey: this.cell.dateKey,
                    events: this.cell.events || [],
                    rect
                },
                bubbles: true,
                composed: true
            })
        );
    }
}
