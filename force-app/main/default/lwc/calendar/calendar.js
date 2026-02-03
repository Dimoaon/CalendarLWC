import { LightningElement } from 'lwc';

export default class Calendar extends LightningElement {

    currentDate = new Date();
    events = {};

    showEventForm = false;
    newEventTitle = '';
    selectedDateKey = null;
    showEventDetails = false;
    selectedEvent = null;
    popupRect = null;

    searchQuery = '';
    searchResults = [];
    showSearchResults = false;



    weekdays = [
        'Monday','Tuesday','Wednesday',
        'Thursday','Friday','Saturday','Sunday'
    ];

    connectedCallback() {
        const stored = localStorage.getItem('calendarEvents');
        if (stored) {
            this.events = JSON.parse(stored);
        }
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
        this.showEventForm = true;

        if (!this.selectedDateKey) {
            const d = new Date();
            this.selectedDateKey =
                `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
        }
    }


    handleTitleInput(e) {
        this.newEventTitle = e.detail;
    }

    closeEventForm() {
        this.showEventForm = false;
        this.newEventTitle = '';
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
        this.closeEventForm();
    }

    handleCellSelect(e) {
        this.selectedDateKey = e.detail;
    }

    handleEventClick(e) {
        this.selectedEvent = e.detail.event;
        this.popupRect = e.detail.rect;
        this.showEventDetails = true;
    }

    closeEventDetails() {
        this.showEventDetails = false;
    }

    // handleSearchInput(e) {
    //     console.log('SEARCH:', e.detail);

    //     const query = e.detail.toLowerCase();
    //     this.searchQuery = query;

    //     if (!query) {
    //         this.searchResults = [];
    //         this.showSearchResults = false;
    //         return;
    //     }

    //     const results = [];

    //     Object.entries(this.events).forEach(([dateKey, events]) => {
    //         events.forEach(ev => {
    //             if (ev.title.toLowerCase().includes(query)) {
    //                 results.push({
    //                     ...ev,
    //                     dateKey
    //                 });
    //             }
    //         });
    //     });

    //     this.searchResults = results;
    //     this.showSearchResults = results.length > 0;
    // }


    // Временно
    handleSearchInput(e) {
        const query = e.detail.toLowerCase();

        if (!query) {
            this.searchResults = [];
            this.showSearchResults = false;
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
        this.showSearchResults = results.length > 0;
    }
    // Конец

    handleSearchSelect(e) {
        const dateKey = e.currentTarget.dataset.date;

        const [year, month, day] =
            dateKey.split('-').map(Number);

        this.currentDate = new Date(year, month - 1, 1);
        this.selectedDateKey = dateKey;

        this.showSearchResults = false;
    }

    handleDeleteEvent(e) {
        const eventId = e.detail;

        Object.keys(this.events).forEach(dateKey => {
            this.events[dateKey] =
                this.events[dateKey].filter(
                    ev => ev.id !== eventId
                );

            if (this.events[dateKey].length === 0) {
                delete this.events[dateKey];
            }
        });

        this.events = { ...this.events };

        this.saveEvents();
        this.closeEventDetails();
        this.selectedEvent = null;
        this.closeEventDetails();
    }

}
