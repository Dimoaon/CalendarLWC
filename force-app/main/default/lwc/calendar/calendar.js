import { LightningElement } from 'lwc';

export default class Calendar extends LightningElement {

    currentDate = new Date();
    events = {};

    newEventTitle = '';
    selectedDateKey = null;
    selectedEvent = null;

    popupMode = null; // 'addQuick' | 'addFull' | 'list' | 'details'
    searchResults = [];
    



    weekdays = [
        'Monday','Tuesday','Wednesday',
        'Thursday','Friday','Saturday','Sunday'
    ];

    connectedCallback() {
        const stored = localStorage.getItem('calendarEvents');
        if (stored) {
            this.events = JSON.parse(stored);
        }

        const d = new Date();
        this.selectedDateKey =
            `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }


    saveEvents() {
        localStorage.setItem(
            'calendarEvents',
            JSON.stringify(this.events)
        );
    }

    get monthLabel() {
        return this.currentDate.toLocaleString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    }

    get cells() {
        const today = new Date();

        const todayKey =
            `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;


        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const firstDay = new Date(year, month, 1);

        let startDay = firstDay.getDay();
        startDay = startDay === 0 ? 6 : startDay - 1;

        const daysInMonth =
            new Date(year, month + 1, 0).getDate();

        const prevMonthDays =
            new Date(year, month, 0).getDate();

        let cells = [];

        for (let i = startDay - 1; i >= 0; i--) {
            cells.push({
                key: `p-${i}`,
                label: prevMonthDays - i,
                muted: true
            });
        }

        for (let day = 1; day <= daysInMonth; day++) {

            const dateKey =
                `${year}-${month + 1}-${day}`;

            const dayEvents =
                this.events[dateKey] || [];

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
            weekday: index < 7
                ? this.weekdays[index]
                : null,
            cellClass:
                'calendar__cell' +
                (cell.hasEvents ? ' calendar__cell--active' : '') +
                (cell.isSelected ? ' calendar__cell--selected' : '') +
                (cell.isToday ? ' calendar__cell--today' : '')
        }));
    }

    handlePrevMonth() {
        const d = new Date(this.currentDate);
        d.setMonth(d.getMonth() - 1);
        this.currentDate = d;
    }

    handleNextMonth() {
        const d = new Date(this.currentDate);
        d.setMonth(d.getMonth() + 1);
        this.currentDate = d;
    }

    handleAddEventClick() {
        this.popupMode = 'addQuick';
        this.newEventTitle = '';
        this.selectedEvent = null;
    }

    openAddFromList() {
        this.popupMode = 'addFull';
        this.newEventTitle = '';
    }


    closePopup() {
        this.popupMode = null;
        this.selectedEvent = null;
        this.newEventTitle = '';
    }

    handleTitleInput(e) {
        this.newEventTitle = e.detail;
    }

    saveNewEvent() {

        if (!this.newEventTitle.trim()) return;

        const newEvent = {
            id: Date.now(),
            title: this.newEventTitle
        };

        if (!this.events[this.selectedDateKey]) {
            this.events[this.selectedDateKey] = [];
        }

        this.events[this.selectedDateKey].push(newEvent);

        this.events = { ...this.events };
        this.saveEvents();

        this.popupMode = null;
        this.newEventTitle = '';
        this.selectedEvent = null;
    }


    handleEventSelect(e) {
        this.selectedEvent = e.detail;
        this.popupMode = 'details';
    }


    handleCellSelect(e) {
        const { dateKey, events } = e.detail;

        this.selectedDateKey = dateKey;
        this.selectedEvent = null;

        if (this.popupMode === 'addQuick') {
            return;
        }

        if (!events || events.length === 0) {
            this.popupMode = 'addFull';
            this.newEventTitle = '';
        } else {
            this.popupMode = 'list';
        }
    }



    handleSearchInput(e) {
        const query = e.detail.toLowerCase();

        if (!query) {
            this.searchResults = [];
            return;
        }

        const results = [];

        Object.entries(this.events).forEach(([dateKey, events]) => {
            events.forEach(ev => {
                if (ev.title.toLowerCase().includes(query)) {
                    results.push({
                        ...ev,
                        dateKey
                    });
                }
            });
        });

        this.searchResults = results;
    }


    handleSearchSelect(e) {
        const { dateKey } = e.detail;

        const [year, month, day] =
            dateKey.split('-').map(Number);

        this.currentDate = new Date(year, month - 1, 1);
        this.selectedDateKey = dateKey;

        this.searchResults = [];
    }


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

        if (this.eventsForSelectedDate.length > 0) {
            this.popupMode = 'list';
        } else {
            this.popupMode = null;
        }

        this.selectedEvent = null;
    }


    handleMonthChange(e) {
        const d = new Date(this.currentDate);
        d.setMonth(e.detail.month);
        this.currentDate = d;
    }

    handleYearChange(e) {
        const d = new Date(this.currentDate);
        d.setFullYear(e.detail.year);
        this.currentDate = d;
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


    get eventsForSelectedDate() {
        return this.events[this.selectedDateKey] || [];
    }

}
