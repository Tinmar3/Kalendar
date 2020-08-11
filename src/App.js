import './App.scss'
import React, { Component } from 'react'
import { add, set, areIntervalsOverlapping, isEqual } from 'date-fns'
import DayWorkingDetails from './calendar/meta/DayWorkingDetails'
import { MAX_WEEKLY_PERIODS, PERIOD_LENGTH_MINS, MAX_WORK_HOUR, MIN_WORK_HOUR, DAYS, dailyPeriodsCount } from './calendar/meta/Consts'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedPeriods: []
    }

    this.nextSevenDaysDetails = this.getNextSevenDaysDetails()
    this.randomPeriods = this.getRandomPeriods()

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

  getNextSevenDaysDetails () {
    const nextSevenDays = []
    for (let i = 1; i <= 7; i++) {
      nextSevenDays.push(add(new Date(), { days: i }))
      // nextSevenDays.push(add(new Date(2020, 7, 17), { days: i }))
    }
    return nextSevenDays.map(day => new DayWorkingDetails(day))
  }

  get allAvailableWeekPeriodsSelected () {
    return this.state.selectedPeriods.length === MAX_WEEKLY_PERIODS
  }

  getRandomPeriods () {
    const workingDaysNumber = this.nextSevenDaysDetails.find(day => day.dayName === DAYS[6]).isNonWorkingDay ? 5 : 6
    const randomPeriods = []
    for (let i = 0; i < 15; i++) {
      randomPeriods.push({ dayNumber: Math.round(Math.random() * workingDaysNumber), periodNumber: Math.round(Math.random() * 12) })
    }
    console.log(randomPeriods)
  }

  renderPeriods (dayDetails) {
    const dayPeriods = []
    for (let i = 0; i < dailyPeriodsCount; i++) {
      if (dayDetails.isNonWorkingDay) {
        dayPeriods.push(<li key={i} className="notWorking"></li>)
      } else {
        const thisPeriodStart = add(set(dayDetails.date, { hours: MIN_WORK_HOUR, minutes: 0 }), { minutes: i * PERIOD_LENGTH_MINS })
        const thisPeriod = {
          start: thisPeriodStart,
          end: add(thisPeriodStart, { minutes: PERIOD_LENGTH_MINS })
        }
        if (areIntervalsOverlapping(thisPeriod, dayDetails.workingPeriods.beforePause) || areIntervalsOverlapping(thisPeriod, dayDetails.workingPeriods.afterPause)) {
          dayPeriods.push(<li key={i} className="available"></li>)
        } else if (isEqual(thisPeriod.start, dayDetails.workingPeriods.beforePause.end) && isEqual(thisPeriod.end, dayDetails.workingPeriods.afterPause.start)) {
          dayPeriods.push(<li key={i} className="pause"></li>)
        } else {
          dayPeriods.push(<li key={i} className="notWorking"></li>)
        }
      }
    }

    return dayPeriods
  }

  renderPeriodHours () {
    const hours = []
    for (let i = MIN_WORK_HOUR; i <= MAX_WORK_HOUR; i++) {
      hours.push(<li key={i + 'full'}>{('0' + i).slice(-2) + ':00'}</li>)
      if (i < MAX_WORK_HOUR) {
        hours.push(<li key={i + 'half'}>{('0' + i).slice(-2) + ':30'}</li>)
      }
    }
    return hours
  }

  render () {
    // console.log(this.randomPeriods)
    return (
      <main>
        <div className="calendar">
          <ul className="calendar__Hours">
            { this.renderPeriodHours() }
          </ul>
          { this.nextSevenDaysDetails.map(day => <div key={ day.dateToString } className="calendar__Day">
            <div className="calendar__DayNameDate">
              <span>{ day.dayName }</span>
              <span>{ day.dateToString }</span>
            </div>
            <ul className="calendar__Periods">
              { this.renderPeriods(day) }
            </ul>
          </div>) }
        </div>
      </main>
    )
  }
}
