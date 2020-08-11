import './App.scss'
import React, { Component } from 'react'
import { format, add, set, areIntervalsOverlapping } from 'date-fns'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedPeriods: []
    }

    this.MAX_WEEKLY_PERIODS = 2
    this.MAX_DAILY_PERIODS = 1
    this.PERIOD_LENGTH_MINS = 30 // period length in minutes
    this.PAUSE_LENGTH_MINS = 30 // pause length in minutes
    this.MAX_WORK_HOUR = 19
    this.MIN_WORK_HOUR = 8
    this.DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    this.workTimeOdd = { start: 13, end: this.MAX_WORK_HOUR, pauseStart: 16 }
    this.workTimeEven = { start: this.MIN_WORK_HOUR, end: 14, pauseStart: 11 }

    this.MOCK_SELECTED_PERIODS = [
      {
        date: 12,
        month: 8,
        year: 2020,
        hour: 9,
        minute: 0
      },
      {
        date: 13,
        month: 8,
        year: 2020,
        hour: 17,
        minute: 30
      }
    ]
  }

  get dailyPeriodsCount () {
    return (this.MAX_WORK_HOUR - this.MIN_WORK_HOUR) * (60 / this.PERIOD_LENGTH_MINS)
  }

  get nextSevenDays () {
    const nextSevenDays = []
    for (let i = 1; i <= 7; i++) {
      nextSevenDays.push(add(new Date(), { days: i }))
      // nextSevenDays.push(add(new Date(2020, 7, 17), { days: i }))
    }
    return nextSevenDays
  }

  get allAvailableWeekPeriodsSelected () {
    return this.state.selectedPeriods.length === this.MAX_WEEKLY_PERIODS
  }

  renderPeriods (dateObj) {
    const dayPeriods = []
    const thisDate = new Date(dateObj)
    const isSunday = dateObj.getDay() === 0
    const isSaturday = dateObj.getDay() === 6
    const isOddDate = !!(dateObj.getDate() % 2)
    const isNonWorkingDay = isSunday || (isSaturday && isOddDate)
    const thisWorkTime = (!isNonWorkingDay && isOddDate) ? this.workTimeOdd : this.workTimeEven
    const thisPauseStart = set(thisDate, { hours: thisWorkTime.pauseStart, minutes: 0 })
    const workingPeriods = {
      beforePause: {
        start: set(thisDate, { hours: thisWorkTime.start, minutes: 0 }),
        end: thisPauseStart
      },
      afterPause: {
        start: add(thisPauseStart, { minutes: this.PAUSE_LENGTH_MINS }),
        end: set(thisDate, { hours: thisWorkTime.end, minutes: 0 })
      }
    }

    for (let i = 0; i < this.dailyPeriodsCount; i++) {
      if (isNonWorkingDay) {
        dayPeriods.push(<li key={i} className="notWorking"></li>)
      } else {
        const thisPeriodStart = add(set(thisDate, { hours: this.MIN_WORK_HOUR, minutes: 0 }), { minutes: i * this.PERIOD_LENGTH_MINS })
        const thisPeriod = {
          start: thisPeriodStart,
          end: add(thisPeriodStart, { minutes: this.PERIOD_LENGTH_MINS })
        }
        if (areIntervalsOverlapping(thisPeriod, workingPeriods.beforePause) || areIntervalsOverlapping(thisPeriod, workingPeriods.afterPause)) {
          dayPeriods.push(<li key={i} className="available"></li>)
        } else {
          dayPeriods.push(<li key={i} className="notWorking"></li>)
        }
      }
    }

    return dayPeriods
  }

  renderPeriodHours () {
    const hours = []
    for (let i = this.MIN_WORK_HOUR; i <= this.MAX_WORK_HOUR; i++) {
      hours.push(<li key={i + 'full'}>{('0' + i).slice(-2) + ':00'}</li>)
      if (i < this.MAX_WORK_HOUR) {
        hours.push(<li key={i + 'half'}>{('0' + i).slice(-2) + ':30'}</li>)
      }
    }
    return hours
  }

  render () {
    console.log(this.nextSevenDays)
    return (
      <main>
        <div className="calendar">
          <ul className="calendar__Hours">
            { this.renderPeriodHours() }
          </ul>
          {this.nextSevenDays.map(day =>
            <div key={day.getDate()} className="calendar__Day">
              <div className="calendar__DayNameDate">
                <span>{ this.DAYS[day.getDay()] }</span>
                <span>{ format(day, 'MM/dd/yyyy') }</span>
              </div>
              <ul className="calendar__Periods">
                {this.renderPeriods(day)}
              </ul>
            </div>
          )}
        </div>
      </main>
    )
  }
}
