document.addEventListener('DOMContentLoaded', () => {
    const yearInput = document.getElementById('year');
    const monthSelect = document.getElementById('month');
    const updateButton = document.getElementById('update');
    const calendarContainer = document.getElementById('calendar');

    // Set initial values to current year and month
    const now = new Date();
    yearInput.value = now.getFullYear();
    monthSelect.value = now.getMonth() + 1;

    async function fetchPLData(year, month) {
        try {
            const response = await fetch(`/api/pl-data?year=${year}&month=${month}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching P&L data:', error);
            return {};
        }
    }

    function renderCalendar(year, month, plData) {
        calendarContainer.innerHTML = '';

        // Days of the week header
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysOfWeek.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-header';
            header.innerText = day;
            calendarContainer.appendChild(header);
        });

        // Get first day of the month and total days
        const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
        const daysInMonth = new Date(year, month, 0).getDate();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'empty-day';
            calendarContainer.appendChild(emptyDay);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const plValue = plData[dateStr] || 0;

            const dayElement = document.createElement('div');
            dayElement.className = 'day';

            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.innerText = day;
            dayElement.appendChild(dayNumber);

            const plDisplay = document.createElement('div');
            plDisplay.className = `pl-value ${plValue >= 0 ? 'profit' : 'loss'}`;
            plDisplay.innerText = `${plValue >= 0 ? '+' : ''}${plValue.toFixed(2)}`;
            dayElement.appendChild(plDisplay);

            calendarContainer.appendChild(dayElement);
        }
    }

    async function updateCalendar() {
        const year = parseInt(yearInput.value);
        const month = parseInt(monthSelect.value);
        const plData = await fetchPLData(year, month);
        renderCalendar(year, month, plData);
    }

    updateButton.addEventListener('click', updateCalendar);

    // Initial render
    updateCalendar();
});
