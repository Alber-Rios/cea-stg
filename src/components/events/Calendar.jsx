import { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { monthNames } from '../../data/events';
import { useCalendar } from '../../hooks/useCalendar';
import styles from './Calendar.module.css';

function Calendar() {
    const { currentMonth, currentYear, changeMonth, events, loading } = useCalendar();
    const [infoBox, setInfoBox] = useState({ show: false, content: '', position: { top: 0, left: 0 } });
    const calendarRef = useRef(null);

    // const events = getEventsFromData(currentYear); // Ya no es necesario
    const now = new Date();
    const today = now.getDate();
    const currentActualMonth = now.getMonth();
    const currentActualYear = now.getFullYear();

    let firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const handleDayClick = (e, eventArray) => {
        if (!eventArray) return;

        const rect = e.target.getBoundingClientRect();
        const widgetRect = calendarRef.current.getBoundingClientRect();

        setInfoBox({
            show: true,
            content: {
                title: eventArray[0].title,
                info: eventArray[0].info
            },
            position: {
                left: rect.left - widgetRect.left + rect.width / 2,
                top: rect.bottom - widgetRect.top + 10
            }
        });

        setTimeout(() => {
            setInfoBox(prev => ({ ...prev, show: false }));
        }, 4000);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target)) {
                setInfoBox(prev => ({ ...prev, show: false }));
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const renderCalendarDays = () => {
        const days = [];

        // Empty cells before first day
        for (let i = 0; i < adjustedFirstDay; i++) {
            days.push(<td key={`empty-${i}`}></td>);
        }

        // Days of the month
        let currentDayOfWeek = adjustedFirstDay;
        for (let day = 1; day <= daysInMonth; day++) {
            if (currentDayOfWeek > 6) {
                currentDayOfWeek = 0;
            }

            const eventKey = `${day}-${currentMonth}-${currentYear}`;
            const eventArray = events[eventKey];

            let classList = [];
            if (day === today && currentMonth === currentActualMonth && currentYear === currentActualYear) {
                classList.push(styles.activeDate);
            }
            if (eventArray) {
                classList.push(styles.hasEvent);
            }

            days.push(
                <td
                    key={day}
                    className={classList.join(' ')}
                    onClick={(e) => handleDayClick(e, eventArray)}
                >
                    {day}
                </td>
            );

            currentDayOfWeek++;
        }

        return days;
    };

    const renderCalendarRows = () => {
        const days = renderCalendarDays();
        const rows = [];
        let cells = [];

        days.forEach((day, index) => {
            if (index % 7 === 0 && index > 0) {
                rows.push(<tr key={`row-${index}`}>{cells}</tr>);
                cells = [];
            }
            cells.push(day);
        });

        if (cells.length > 0) {
            rows.push(<tr key={`row-last`}>{cells}</tr>);
        }

        return rows;
    };

    return (
        <div className={styles.calendarWidget} ref={calendarRef}>
            <div className={styles.calendarHeader}>
                <button onClick={() => changeMonth(-1)} title="Mes anterior" className={styles.navButton}>
                    <FaChevronLeft />
                </button>
                <h4>{monthNames[currentMonth]} {currentYear}</h4>
                <button onClick={() => changeMonth(1)} title="Mes siguiente" className={styles.navButton}>
                    <FaChevronRight />
                </button>
            </div>
            <table className={styles.calendarTable}>
                <thead>
                    <tr>
                        <th>L</th>
                        <th>M</th>
                        <th>X</th>
                        <th>J</th>
                        <th>V</th>
                        <th>S</th>
                        <th>D</th>
                    </tr>
                </thead>
                <tbody>
                    {renderCalendarRows()}
                </tbody>
            </table>
            {infoBox.show && (
                <div
                    className={styles.calendarInfoBox}
                    style={{
                        left: `${infoBox.position.left}px`,
                        top: `${infoBox.position.top}px`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    <p><strong>{infoBox.content.title}</strong></p>
                    <p style={{ marginTop: '5px', fontSize: '0.9em', color: '#ddd' }}>{infoBox.content.info}</p>
                </div>
            )}
        </div>
    );
}

export default Calendar;
