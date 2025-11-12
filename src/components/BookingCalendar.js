// src/components/BookingCalendar.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function BookingCalendar({ unavailableDates }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="booking-calendar">
      <h3>Pilih Tanggal Sewa</h3>
      <DatePicker
        selected={startDate}
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        excludeDates={unavailableDates}
        selectsRange
        inline // Tampilkan kalender langsung
      />
    </div>
  );
}
export default BookingCalendar;