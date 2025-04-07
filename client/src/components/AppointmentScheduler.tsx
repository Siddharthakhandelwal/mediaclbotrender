import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface AppointmentSchedulerProps {
  data?: Record<string, any>;
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ data }) => {
  // Extract appointment details from data if available
  const extractedDetails = data?.extractedDetails || {};
  const hasExtractedDetails = !!(extractedDetails.date || extractedDetails.time || extractedDetails.type);
  
  const [selectedType, setSelectedType] = useState<string>(
    extractedDetails.type || data?.selectedType || 'General Check-up'
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    extractedDetails.date || data?.selectedDate || ''
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    extractedDetails.time || data?.selectedTime || ''
  );
  
  // Track if the appointment can be automatically confirmed based on the extracted data
  const [autoConfirm, setAutoConfirm] = useState<boolean>(false);
  
  // Check if we can automatically confirm based on extracted details
  useEffect(() => {
    if (hasExtractedDetails && extractedDetails.date && extractedDetails.time) {
      setAutoConfirm(true);
      
      // Auto-confirm after a short delay to allow user to see the selections
      const timer = setTimeout(() => {
        if (selectedType && selectedDate && selectedTime) {
          handleConfirmAppointment();
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [hasExtractedDetails, selectedType, selectedDate, selectedTime]);

  // Generate days for the calendar
  const generateDays = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayNumber = date.getDate();
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const formattedDate = date.toISOString().split('T')[0];
      
      days.push({
        dayNumber,
        dayName,
        formattedDate,
        isToday: i === 0
      });
    }
    
    return days;
  };

  const days = generateDays();

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes of ['00', '30']) {
        const time = `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
        slots.push(time);
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleConfirmAppointment = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select both date and time",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Appointment Confirmed",
      description: `Your ${selectedType} appointment has been scheduled for ${selectedDate} at ${selectedTime}.`,
    });
  };

  return (
    <div className="p-4">
      {autoConfirm && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="text-green-800 font-medium mb-1">Appointment details detected!</div>
          <div className="text-sm text-green-700">
            Your appointment will be automatically confirmed in a moment.
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">Select appointment type:</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {['General Check-up', 'Specialist Consultation', 'Follow-up', 'Vaccination'].map((type) => (
            <button
              key={type}
              className={`px-3 py-2 ${
                selectedType === type
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-800'
              } rounded-md text-sm`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
        
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Select a date:</div>
          <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs text-gray-500">
            <div>Su</div>
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {days.map((day) => (
              <div
                key={day.formattedDate}
                className={`px-1 py-2 text-center rounded cursor-pointer ${
                  selectedDate === day.formattedDate
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100'
                } transition`}
                onClick={() => setSelectedDate(day.formattedDate)}
              >
                <span className="text-sm leading-none block mb-1">{day.dayNumber}</span>
                <span className={`text-xs ${selectedDate === day.formattedDate ? '' : 'text-gray-500'}`}>
                  {day.dayName}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Available time slots:</div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {timeSlots.map((time) => (
              <button
                key={time}
                className={`p-2 ${
                  selectedTime === time
                    ? 'bg-primary text-white'
                    : 'border border-gray-200 hover:bg-gray-50'
                } rounded text-sm transition`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
        
        <Button
          className="w-full py-2 bg-[#43A047] hover:bg-[#2e7d32] text-white rounded-md font-medium"
          onClick={handleConfirmAppointment}
        >
          Confirm Appointment
        </Button>
      </div>
    </div>
  );
};

export default AppointmentScheduler;
