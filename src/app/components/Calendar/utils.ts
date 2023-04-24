export interface TimeSlot {
  hour: number;
  minute: number;
}

export const generateTimeSlots = () => {
  const slots: {
    [index: string]: TimeSlot;
  } = {};
  for (let i = 9; i <= 22; i++) {
    for (let j = 0; j < 60; j += 15) {
      slots[`${i} ${j}`] = { hour: i, minute: j };
    }
  }
  return slots;
};

export const getNextTimeSlot = (timeSlot: TimeSlot): TimeSlot => ({
  hour: timeSlot.hour + Math.floor((timeSlot.minute + 15) / 60),
  minute: (timeSlot.minute + 15) % 60,
});

export const getPrevTimeSlot = (timeSlot: TimeSlot): TimeSlot => ({
  hour: timeSlot.hour - (timeSlot.minute - 15 < 0 ? 1 : 0),
  minute: timeSlot.minute - 15 < 0 ? 45 : timeSlot.minute - 15,
});

export const convertToMinutes = ({ hour, minute }: TimeSlot) =>
  hour * 60 + minute;
