export const MAX_WEEKLY_PERIODS = 2
export const MAX_DAILY_PERIODS = 1
export const PERIOD_LENGTH_MINS = 30 // period length in minutes
export const PAUSE_LENGTH_MINS = 30 // pause length in minutes
export const MAX_WORK_HOUR = 19
export const MIN_WORK_HOUR = 8
export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const workTimeOdd = { start: 13, end: MAX_WORK_HOUR, pauseStart: 16 }
export const workTimeEven = { start: MIN_WORK_HOUR, end: 14, pauseStart: 11 }
export const dailyPeriodsCount = (MAX_WORK_HOUR - MIN_WORK_HOUR) * (60 / PERIOD_LENGTH_MINS)
