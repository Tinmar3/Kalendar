import { add, set, format } from 'date-fns'
import { workTimeOdd, workTimeEven, DAYS, PAUSE_LENGTH_MINS } from './Consts'

export default class DayWorkingDetails {
  constructor (dateObj) {
    this._date = new Date(dateObj)
    this._isSunday = this._date.getDay() === 0
    this._isSaturday = this._date.getDay() === 6
    this._isOddDate = !!(this._date.getDate() % 2)
  }

  workTime () {
    return !this.isNonWorkingDay && (this._isOddDate ? workTimeOdd : workTimeEven)
  }

  get date () {
    return this._date
  }

  get isNonWorkingDay () {
    return this._isSunday || (this._isSaturday && this._isOddDate)
  }

  get dayName () {
    return DAYS[this._date.getDay()]
  }

  get dateToString () {
    return format(this._date, 'MM/dd/yyyy')
  }

  get workingPeriods () {
    const thisPauseStart = set(this._date, { hours: this.workTime().pauseStart, minutes: 0 })
    return !this.isNonWorkingDay && {
      beforePause: {
        start: set(this._date, { hours: this.workTime().start, minutes: 0 }),
        end: thisPauseStart
      },
      afterPause: {
        start: add(thisPauseStart, { minutes: PAUSE_LENGTH_MINS }),
        end: set(this._date, { hours: this.workTime().end, minutes: 0 })
      }
    }
  }
}
