import { LightningElement, api } from 'lwc';

export default class CalendarHeader extends LightningElement {

    /* ================= API ================= */

    @api monthLabel;
    @api searchResults = [];

    @api isQuickAddOpen;
    @api quickAddTitle;

    @api currentYear;

    /* ================= LOCAL STATE ================= */

    showDatePicker = false;
    pickerMode = 'month'; // 'month' | 'year'

    searchValue = '';

    months = [
        'Jan','Feb','Mar','Apr','May','Jun',
        'Jul','Aug','Sep','Oct','Nov','Dec'
    ].map((label, index) => ({ label, index }));

    /* ================= GETTERS ================= */

    get baseYear() {
        return this.currentYear;
    }
    
    get years() {
        return Array.from(
            { length: 7 },
            (_, i) => this.baseYear - 3 + i
        );
    }

    get hasSearchResults() {
        return this.searchResults.length > 0;
    }

    get hasSearchValue() {
        return !!this.searchValue;
    }

    get isMonthMode() {
        return this.pickerMode === 'month';
    }

    get isYearMode() {
        return this.pickerMode === 'year';
    }

    get yearArrowClass() {
        return this.pickerMode === 'year'
            ? 'picker-arrow picker-arrow--up'
            : 'picker-arrow';
    }

    /* ================= NAVIGATION ================= */

    handlePrev() {
        this.dispatchEvent(
            new CustomEvent('prevmonth', {
                detail: {},
                bubbles: true,
                composed: true
            })
        );
    }

    handleNext() {
        this.dispatchEvent(new CustomEvent('nextmonth', {
            detail: {},
            bubbles: true,
            composed: true
        }));
    }

    toggleDatePicker() {
        this.showDatePicker = !this.showDatePicker;
        this.pickerMode = 'month';
    }

    toggleYearPicker() {
        this.pickerMode =
            this.pickerMode === 'year' ? 'month' : 'year';
    }

    selectMonth(e) {
        const month = Number(e.currentTarget.dataset.month);

        this.dispatchEvent(
            new CustomEvent('monthchange', {
                detail: { month },
                bubbles: true,
                composed: true
            })
        );

        this.showDatePicker = false;
    }

    selectYear(e) {
        const year = Number(e.currentTarget.dataset.year);

        this.dispatchEvent(
            new CustomEvent('yearchange', {
                detail: { year },
                bubbles: true,
                composed: true
            })
        );

        this.pickerMode = 'month';
    }

    /* ================= QUICK ADD ================= */

    toggleQuickAdd() {
        this.dispatchEvent(new CustomEvent('addevent'));
    }

    closeQuickAdd() {
        this.dispatchEvent(new CustomEvent('quickclose'));
    }

    handleQuickInput(e) {
        const value = e.target.value;

        this.dispatchEvent(
            new CustomEvent('quickinput', {
                detail: value
            })
        );
    }

    saveQuickEvent() {
        this.dispatchEvent(
            new CustomEvent('quicksave', {
                detail: {
                    title: this.quickAddTitle
                }
            })
        );
    }

    /* ================= SEARCH ================= */

    handleSearchInputLocal(e) {
        const value = e.target.value;
        this.searchValue = value;

        this.dispatchEvent(
            new CustomEvent('search', {
                detail: value
            })
        );
    }

    clearSearch() {
        this.searchValue = '';
        this.searchResults = [];

        this.dispatchEvent(
            new CustomEvent('search', {
                detail: ''
            })
        );
    }

    handleResultClick(e) {
        this.dispatchEvent(
            new CustomEvent('searchselect', {
                detail: { dateKey: e.currentTarget.dataset.date },
                bubbles: true,
                composed: true
            })
        );
    }
}
