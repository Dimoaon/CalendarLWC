import { LightningElement, api } from 'lwc';

export default class CalendarHeader extends LightningElement {

    @api monthLabel;
    @api showEventForm;
    @api newEventTitle;
    @api searchResults = [];

    handlePrev() {
        this.dispatchEvent(new CustomEvent('prevmonth'));
    }

    handleNext() {
        this.dispatchEvent(new CustomEvent('nextmonth'));
    }

    handleAdd() {
        this.dispatchEvent(new CustomEvent('addevent'));
    }

    handleClose() {
        this.dispatchEvent(new CustomEvent('closeform'));
    }

    handleInput(e) {
        this.dispatchEvent(
            new CustomEvent('titleinput', {
                detail: e.detail
            })
        );
    }

    handleSave() {
        this.dispatchEvent(new CustomEvent('saveevent'));
    }

    handleSearchInputLocal(e) {
        this.dispatchEvent(
            new CustomEvent('search', {
                detail: e.target.value
            })
        );
    }

    handleResultClick(e) {
        this.dispatchEvent(
            new CustomEvent('searchselect', {
                detail: {
                    dateKey: e.currentTarget.dataset.date
                },
                bubbles: true,
                composed: true
            })
        );
    }

    get hasSearchResults() {
        return this.searchResults.length > 0;
    }
}
