import { LightningElement } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import calendarTokens from '@salesforce/resourceUrl/calendarTokens';

export default class Calendar extends LightningElement {

    /* =====================
       STATE
       ===================== */

    currentDate = new Date();
    events = {};

    selectedDateKey = null;
    selectedEvent = null;

    // null | 'addQuick' | 'addFull' | 'list' | 'details'
    popupMode = null;

    newEventTitle = '';

    searchResults = [];
    activeCellRect = null;

    weekdays = [
        'Monday','Tuesday','Wednesday',
        'Thursday','Friday','Saturday','Sunday'
    ];

    /* =====================
       LIFECYCLE
       ===================== */

    connectedCallback() {
        loadStyle(this, calendarTokens);

        const stored = localStorage.getItem('calendarEvents');
        if (stored) {
            this.events = JSON.parse(stored);
        }

        const d = new Date();
        this.selectedDateKey =
            `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }

    /* =====================
       HELPERS
       ===================== */

    resetPopupState() {
        this.popupMode = null;
        this.selectedEvent = null;
        this.activeCellRect = null;
    }

    /* =====================
       STORAGE
       ===================== */

    saveEvents() {
        localStorage.setItem(
            'calendarEvents',
            JSON.stringify(this.events)
        );
    }

    /* =====================
       CALENDAR DATA
       ===================== */

    get monthLabel() {
        return this.currentDate.toLocaleString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    }

    get currentYear() {
        return this.currentDate.getFullYear();
    }

    get cells() {
        const today = new Date();
        const todayKey =
            `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        let startDay = firstDay.getDay();
        startDay = startDay === 0 ? 6 : startDay - 1;

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();

        let cells = [];

        // prev month
        for (let i = startDay - 1; i >= 0; i--) {
            cells.push({
                key: `p-${i}`,
                label: prevMonthDays - i,
                muted: true
            });
        }

        // current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = `${year}-${month + 1}-${day}`;
            const dayEvents = this.events[dateKey] || [];

            cells.push({
                key: `c-${day}`,
                label: day,
                muted: false,
                dateKey,
                events: dayEvents,
                hasEvents: dayEvents.length > 0,
                isSelected: this.selectedDateKey === dateKey,
                isToday: dateKey === todayKey
            });
        }

        // next month
        let nextDay = 1;
        while (cells.length % 7 !== 0) {
            cells.push({
                key: `n-${nextDay}`,
                label: nextDay++,
                muted: true
            });
        }

        return cells.map((cell, index) => ({
            ...cell,
            weekday: index < 7 ? this.weekdays[index] : null,
            cellClass:
                'cell' +
                (cell.hasEvents ? ' cell--active' : '') +
                (cell.isSelected ? ' cell--selected' : '') +
                (cell.isToday ? ' cell--today' : '')
        }));
    }

    /* =====================
       MONTH / YEAR NAV
       ===================== */

    handlePrevMonth() {
        const d = new Date(this.currentDate);
        d.setMonth(d.getMonth() - 1);
        this.currentDate = d;
        this.resetPopupState();
    }

    handleNextMonth() {
        const d = new Date(this.currentDate);
        d.setMonth(d.getMonth() + 1);
        this.currentDate = d;
        this.resetPopupState();
    }

    handleMonthChange(e) {
        const d = new Date(this.currentDate);
        d.setMonth(e.detail.month);
        this.currentDate = d;
        this.resetPopupState();
    }

    handleYearChange(e) {
        const d = new Date(this.currentDate);
        d.setFullYear(e.detail.year);
        this.currentDate = d;
        this.resetPopupState();
    }

    /* =====================
       QUICK ADD
       ===================== */

    handleAddEventClick() {
        if (!this.selectedDateKey) {
            const d = new Date(this.currentDate);
            this.selectedDateKey =
                `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        }

        this.popupMode = 'addQuick';
        this.newEventTitle = '';
        this.selectedEvent = null;
        this.activeCellRect = null;
    }

    handleTitleInput(e) {
        this.newEventTitle = e.detail;
    }

    handleQuickSave() {
        const title = this.newEventTitle.trim();
        if (!title) return;

        const newEvent = {
            id: Date.now(),
            title
        };

        if (!this.events[this.selectedDateKey]) {
            this.events[this.selectedDateKey] = [];
        }

        this.events[this.selectedDateKey].push(newEvent);
        this.events = { ...this.events };
        this.saveEvents();

        this.popupMode = null;
        this.newEventTitle = '';
    }

    /* =====================
       CELL CLICK
       ===================== */

    handleCellSelect(e) {
        const { dateKey, events, rect } = e.detail;

        if (this.popupMode === 'addQuick') {
            this.selectedDateKey = dateKey;
            return;
        }

        this.selectedDateKey = dateKey;
        this.selectedEvent = null;
        this.activeCellRect = rect;

        this.popupMode = events?.length ? 'list' : 'addFull';
    }

    /* =====================
       POPUP ACTIONS
       ===================== */

    handleEventSelect(e) {
        this.selectedEvent = e.detail;
        this.popupMode = 'details';
    }

    openAddFromList() {
        this.popupMode = 'addFull';
    }

    closePopup() {
        this.resetPopupState();
    }

    /* =====================
       FULL ADD
       ===================== */

    handleFullSave(e) {
        const newEvent = e.detail;
        if (!newEvent || !newEvent.title || !newEvent.participants) return;

        if (!this.events[this.selectedDateKey]) {
            this.events[this.selectedDateKey] = [];
        }

        this.events[this.selectedDateKey].push(newEvent);
        this.events = { ...this.events };
        this.saveEvents();

        this.selectedEvent = newEvent;
        this.popupMode = 'details';
    }

    /* =====================
       DELETE
       ===================== */

    handleDeleteEvent(e) {
        const eventId = e.detail;

        Object.keys(this.events).forEach(dateKey => {
            this.events[dateKey] =
                this.events[dateKey].filter(ev => ev.id !== eventId);

            if (this.events[dateKey].length === 0) {
                delete this.events[dateKey];
            }
        });

        this.events = { ...this.events };
        this.saveEvents();

        this.popupMode =
            this.eventsForSelectedDate.length > 0 ? 'list' : null;

        this.selectedEvent = null;
    }

    /* =====================
       SEARCH
       ===================== */

    handleSearchInput(e) {
        const query = e.detail?.trim().toLowerCase();

        if (!query) {
            this.searchResults = [];
            return;
        }

        const results = [];

        Object.entries(this.events).forEach(([dateKey, events]) => {
            events.forEach(ev => {
                if (ev.title && ev.title.toLowerCase().includes(query)) {
                    results.push({ ...ev, dateKey });
                }
            });
        });

        this.searchResults = results;
    }

    handleSearchSelect(e) {
        const { dateKey } = e.detail;
        if (!dateKey) return;

        const [year, month] = dateKey.split('-').map(Number);

        this.currentDate = new Date(year, month - 1, 1);
        this.selectedDateKey = dateKey;

        this.searchResults = [];
        this.resetPopupState();
    }

    /* =====================
       GETTERS
       ===================== */

    get eventsForSelectedDate() {
        return this.events[this.selectedDateKey] || [];
    }

    get isAddQuickMode() {
        return this.popupMode === 'addQuick';
    }

    get isAddFullMode() {
        return this.popupMode === 'addFull';
    }

    get isListMode() {
        return this.popupMode === 'list';
    }

    get isDetailsMode() {
        return this.popupMode === 'details';
    }
}
