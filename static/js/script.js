let currentYear, currentMonth;

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth() + 1; // 1-indexed

    updateCalendar();

    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 1) {
            currentMonth = 12;
            currentYear--;
        }
        updateCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
        }
        updateCalendar();
    });
});

async function updateCalendar() {
    const calendarContainer = document.getElementById('calendar');
    const headerTitle = document.getElementById('currentMonthYear');
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    headerTitle.innerText = `${monthNames[currentMonth - 1]} ${currentYear}`;

    // Clear the calendar
    calendarContainer.innerHTML = '';

    // Add day headers
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const header = document.createElement('div');
        header.classList.add('day-header');
        header.innerText = day;
        calendarContainer.appendChild(header);
    });

    // Fetch P&L data
    try {
        const response = await fetch(`/api/data?year=${currentYear}&month=${currentMonth}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Calculate calendar layout
        const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

        // Fill in empty days at the beginning of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('day', 'empty-day');
            calendarContainer.appendChild(emptyDay);
        }

        // Fill in actual days
        for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
            const dateStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
            const plValue = data[dateStr] || 0;

            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            if (plValue > 0) {
                dayDiv.classList.add('profit');
            } else if (plValue < 0) {
                dayDiv.classList.add('loss');
            }

            dayDiv.innerHTML = `
                <span class="day-num">${dayNum}</span>
                <span class="pl-value">${plValue > 0 ? '+' : ''}${plValue.toFixed(2)}</span>
            `;
            calendarContainer.appendChild(dayDiv);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
