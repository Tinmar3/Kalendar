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
    const daysRange = { min: 1, max: workingDaysNumber }
    const randomPeriods = []
    let numberOfIterations = 15
    for (let i = 0; i < numberOfIterations; i++) {
      const min = Math.ceil(daysRange.min)
      const max = Math.floor(daysRange.max)
      const dayNumber = Math.floor(Math.random() * (max - min + 1)) + min
      const periodNumber = Math.round(Math.random() * 10)
      if (!randomPeriods.find(period => period.dayNumber === dayNumber && period.periodNumber === periodNumber)) {
        randomPeriods.push({ dayNumber, periodNumber })
      } else {
        numberOfIterations++
      }
    }
    return randomPeriods
  }

  handleAvailablePeriodClick (dayDetails) {
    console.log(dayDetails)
  }

  preparePeriodsData (dayDetails) {
    const dayPeriods = []
    const { workingPeriods, date, isNonWorkingDay } = dayDetails
    let availablePeriodIndex = -1
    for (let i = 0; i < dailyPeriodsCount; i++) {
      let thisType = 'NOT_WORKING'
      if (!isNonWorkingDay) {
        const thisPeriodStart = add(set(date, { hours: MIN_WORK_HOUR, minutes: 0 }), { minutes: i * PERIOD_LENGTH_MINS })
        const thisPeriod = {
          start: thisPeriodStart,
          end: add(thisPeriodStart, { minutes: PERIOD_LENGTH_MINS })
        }
        if (areIntervalsOverlapping(thisPeriod, workingPeriods.beforePause) || areIntervalsOverlapping(thisPeriod, workingPeriods.afterPause)) {
          thisType = 'AVAILABLE'
          availablePeriodIndex++
        } else if (isEqual(thisPeriod.start, workingPeriods.beforePause.end) && isEqual(thisPeriod.end, workingPeriods.afterPause.start)) {
          thisType = 'PAUSE'
        }
      }

      const isRandomlyTaken = this.randomPeriods.find(period => period.dayNumber === dayDetails.date.getDay() && period.periodNumber === (availablePeriodIndex))

      let cssClass = ''
      let clickListener
      if (thisType === 'NOT_WORKING') {
        cssClass = 'notWorking'
      } else if (thisType === 'PAUSE') {
        cssClass = 'pause'
      } else if (isRandomlyTaken) {
        cssClass = 'taken'
      } else if (thisType === 'AVAILABLE') {
        cssClass = 'available'
        clickListener = this.handleAvailablePeriodClick.bind(this, dayDetails)
      }

      dayPeriods.push(<li key={i} className={cssClass} onClick={clickListener}></li>)
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
              { this.preparePeriodsData(day) }
            </ul>
          </div>) }
        </div>
      </main>
    )
  }
}
