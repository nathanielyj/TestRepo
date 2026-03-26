document.addEventListener('DOMContentLoaded', () => {
    updateYearlyReport();
});

async function updateYearlyReport() {
    const yearContainer = document.getElementById('year-container');
    yearContainer.innerHTML = 'Loading P&L data...';

    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        yearContainer.innerHTML = ''; // Clear loading message

        // Generate individual calendars for the past 12 months
        const today = new Date();
        for (let i = 11; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const monthContainer = document.createElement('div');
            monthContainer.classList.add('month-container');
            renderMonth(monthContainer, month, year, data);
            yearContainer.appendChild(monthContainer);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        yearContainer.innerHTML = 'Failed to load data. Please try again later.';
    }
}

function renderMonth(container, month, year, data) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Header for the month
    const title = document.createElement('div');
    title.classList.add('month-name');
    title.innerText = `${monthNames[month - 1]} ${year}`;
    container.appendChild(title);

    // Grid for the days
    const calendarGrid = document.createElement('div');
    calendarGrid.classList.add('calendar-grid');
    container.appendChild(calendarGrid);

    // Add day headers
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const header = document.createElement('div');
        header.classList.add('day-header');
        header.innerText = day;
        calendarGrid.appendChild(header);
    });

    // Calculate layout
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    // Fill in empty days at the beginning of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('day', 'empty-day');
        calendarGrid.appendChild(emptyDay);
    }

    // Fill in actual days
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
        const plValue = data[dateStr];

        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');

        if (plValue !== undefined) {
            if (plValue > 0) {
                dayDiv.classList.add('profit');
            } else if (plValue < 0) {
                dayDiv.classList.add('loss');
            }
        }

        dayDiv.innerHTML = `
            <span class="day-num">${dayNum}</span>
            <span class="pl-value">${plValue !== undefined ? (plValue > 0 ? '+' : '') + plValue.toFixed(2) : '-'}</span>
        `;
        calendarGrid.appendChild(dayDiv);
    }
}
