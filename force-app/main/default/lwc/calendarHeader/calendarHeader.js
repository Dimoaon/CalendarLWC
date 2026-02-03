import { LightningElement, api } from 'lwc';

export default class CalendarHeader extends LightningElement {

    @api monthLabel;
    @api searchResults = [];
    @api showEventForm;
    @api newEventTitle;

    showDatePicker = false;
    baseYear = new Date().getFullYear();

    months = [
        'Jan','Feb','Mar','Apr','May','Jun',
        'Jul','Aug','Sep','Oct','Nov','Dec'
    ].map((label, index) => ({ label, index }));

    get years() {
        return Array.from(
            { length: 7 },
            (_, i) => this.baseYear - 3 + i
        );
    }

    get hasSearchResults() {
        return this.searchResults.length > 0;
    }

    /* NAV */
    handlePrev() {
        this.dispatchEvent(new CustomEvent('prevmonth'));
    }

    handleNext() {
        this.dispatchEvent(new CustomEvent('nextmonth'));
    }

    toggleDatePicker() {
        this.showDatePicker = !this.showDatePicker;
    }

    selectMonth(e) {
        const month = Number(e.currentTarget.dataset.month);
        this.dispatchEvent(new CustomEvent('monthchange', {
            detail: { month },
            bubbles: true,
            composed: true
        }));
        this.showDatePicker = false;
    }

    selectYear(e) {
        const year = Number(e.currentTarget.dataset.year);
        this.dispatchEvent(new CustomEvent('yearchange', {
            detail: { year },
            bubbles: true,
            composed: true
        }));
        this.showDatePicker = false;
    }

    prevYear() {
        this.baseYear--;
    }

    nextYear() {
        this.baseYear++;
    }

    /* ACTIONS */
    handleAdd() {
        this.dispatchEvent(new CustomEvent('addevent'));
    }

    handleClose() {
        this.dispatchEvent(new CustomEvent('closeform'));
    }

    handleInput(e) {
        this.dispatchEvent(new CustomEvent('titleinput', {
            detail: e.detail
        }));
    }

    handleSave() {
        this.dispatchEvent(new CustomEvent('saveevent'));
    }

    /* SEARCH */
    handleSearchInputLocal(e) {
        this.dispatchEvent(new CustomEvent('search', {
            detail: e.target.value
        }));
    }

    handleResultClick(e) {
        this.dispatchEvent(new CustomEvent('searchselect', {
            detail: { dateKey: e.currentTarget.dataset.date },
            bubbles: true,
            composed: true
        }));
    }
}
