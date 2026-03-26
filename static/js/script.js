let currentYear, currentMonth;

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    currentYear = today.getFullYear();
    // Start with either Jan (1) or July (7) for a clean 6-month view
    currentMonth = today.getMonth() < 6 ? 1 : 7;

    updateCalendar();

    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth -= 6;
        if (currentMonth < 1) {
            currentMonth = 7;
            currentYear--;
        }
        updateCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth += 6;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
        }
        updateCalendar();
    });
});

async function updateCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    const headerTitle = document.getElementById('currentMonthYear');
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let endMonth = currentMonth + 5;
    let endYear = currentYear;
    if (endMonth > 12) {
        endMonth -= 12;
        endYear++;
    }
    headerTitle.innerText = `${monthNames[currentMonth - 1]} ${currentYear} - ${monthNames[endMonth - 1]} ${endYear}`;

    // Clear the container
    calendarContainer.innerHTML = '';

    // Fetch 6 months of P&L data
    try {
        const response = await fetch(`/api/data?year=${currentYear}&month=${currentMonth}&count=6`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Render each of the 6 months
        for (let i = 0; i < 6; i++) {
            let month = currentMonth + i;
            let year = currentYear;
            if (month > 12) {
                month -= 12;
                year++;
            }
            renderMonth(calendarContainer, year, month, data, monthNames);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderMonth(container, year, month, data, monthNames) {
    const monthDiv = document.createElement('div');
    monthDiv.classList.add('month-section');

    const monthTitle = document.createElement('h3');
    monthTitle.innerText = `${monthNames[month - 1]} ${year}`;
    monthDiv.appendChild(monthTitle);

    const grid = document.createElement('div');
    grid.classList.add('calendar-grid');
    monthDiv.appendChild(grid);

    // Add day headers
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const header = document.createElement('div');
        header.classList.add('day-header');
        header.innerText = day;
        grid.appendChild(header);
    });

    // Calculate calendar layout
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    // Fill in empty days at the beginning of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('day', 'empty-day');
        grid.appendChild(emptyDay);
    }

    // Fill in actual days
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
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
        grid.appendChild(dayDiv);
    }

    container.appendChild(monthDiv);
}
