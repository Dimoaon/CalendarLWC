import { LightningElement, api } from 'lwc';

export default class CalendarHeader extends LightningElement {

    @api monthLabel;
    @api searchResults = [];

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
        this.dispatchEvent(new CustomEvent('monthchange', {
            detail: { month: Number(e.currentTarget.dataset.month) }
        }));
        this.showDatePicker = false;
    }

    selectYear(e) {
        this.dispatchEvent(new CustomEvent('yearchange', {
            detail: { year: Number(e.currentTarget.dataset.year) }
        }));
        this.showDatePicker = false;
    }

    prevYear() {
        this.baseYear--;
    }

    nextYear() {
        this.baseYear++;
    }

    /* ADD EVENT (QUICK) */
    handleAdd() {
        this.dispatchEvent(new CustomEvent('addevent'));
    }

    /* SEARCH */
    handleSearchInputLocal(e) {
        this.dispatchEvent(new CustomEvent('search', {
            detail: e.target.value
        }));
    }

    handleResultClick(e) {
        this.dispatchEvent(new CustomEvent('searchselect', {
            detail: { dateKey: e.currentTarget.dataset.date }
        }));
    }
}
