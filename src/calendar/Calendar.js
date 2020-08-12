import './Calendar.scss'
import React, { Component } from 'react'
import { add, set, areIntervalsOverlapping, isEqual } from 'date-fns'
import DayWorkingDetails from './meta/DayWorkingDetails'
import { MAX_WEEKLY_PERIODS, PERIOD_LENGTH_MINS, MAX_WORK_HOUR, MIN_WORK_HOUR, DAYS, dailyPeriodsCount } from './meta/Consts'

export default class Calendar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedPeriods: []
    }
    this.nextSevenDaysDetails = this.getNextSevenDaysDetails()
    this.randomPeriods = this.getRandomPeriods()
  }

  get allAvailableWeekPeriodsSelected () {
    return this.state.selectedPeriods.length === MAX_WEEKLY_PERIODS
  }

  isPeriodSelectedOnThisDay (date) {
    return this.state.selectedPeriods.find(period => isEqual(period.date, date))
  }

  getNextSevenDaysDetails () {
    const nextSevenDays = []
    for (let i = 1; i <= 7; i++) {
      nextSevenDays.push(add(new Date(), { days: i }))
    //   nextSevenDays.push(add(new Date(2020, 7, 18), { days: i })) // for test
    }
    return nextSevenDays.map(day => new DayWorkingDetails(day))
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

  handleAvailablePeriodClick ({ dayDetails, index, alreadySelected }) {
    if (alreadySelected) {
      this.setState((prevState) => ({
        selectedPeriods: prevState.selectedPeriods.filter(period => !(isEqual(dayDetails.date, period.date) && period.index === index))
      }))
    } else {
      this.setState((prevState) => ({
        selectedPeriods: [...prevState.selectedPeriods, { date: dayDetails.date, index }]
      }))
    }
  }

  preparePeriodHours () {
    const hours = []
    for (let i = MIN_WORK_HOUR; i <= MAX_WORK_HOUR; i++) {
      hours.push({ key: i + 'full', periodString: ('0' + i).slice(-2) + ':00' })
      if (i < MAX_WORK_HOUR) {
        hours.push({ key: i + 'half', periodString: ('0' + i).slice(-2) + ':30' })
      }
    }
    return hours
  }

  preparePeriodsData (dayDetails) {
    const dayPeriods = []
    const { workingPeriods, date, isNonWorkingDay } = dayDetails
    let initialyAvailablePeriodIndex = -1 // needed for random periods
    for (let i = 0; i < dailyPeriodsCount; i++) {
      let thisType = 'NOT_WORKING'
      if (!isNonWorkingDay) {
        const thisPeriodStart = add(set(date, { hours: MIN_WORK_HOUR, minutes: 0 }), { minutes: i * PERIOD_LENGTH_MINS })
        const thisPeriod = {
          start: thisPeriodStart,
          end: add(thisPeriodStart, { minutes: PERIOD_LENGTH_MINS })
        }
        if (this.state.selectedPeriods.find(period => isEqual(period.date, dayDetails.date) && period.index === i)) {
          thisType = 'TAKEN_BY_USER'
          initialyAvailablePeriodIndex++
        } else if (areIntervalsOverlapping(thisPeriod, workingPeriods.beforePause) || areIntervalsOverlapping(thisPeriod, workingPeriods.afterPause)) {
          thisType = 'AVAILABLE'
          initialyAvailablePeriodIndex++
        } else if (isEqual(thisPeriod.start, workingPeriods.beforePause.end) && isEqual(thisPeriod.end, workingPeriods.afterPause.start)) {
          thisType = 'PAUSE'
        }
      }

      let cssClass = ''
      let clickListener
      if (thisType === 'NOT_WORKING') {
        cssClass = 'notWorking'
      } else if (thisType === 'TAKEN_BY_USER') {
        cssClass = 'takenByUser'
        clickListener = this.handleAvailablePeriodClick.bind(this, { dayDetails, index: i, alreadySelected: true })
      } else if (thisType === 'PAUSE') {
        cssClass = 'pause'
      } else {
        const isRandomlyTaken = this.randomPeriods.find(period => period.dayNumber === dayDetails.date.getDay() && period.periodNumber === (initialyAvailablePeriodIndex))
        if (isRandomlyTaken) {
          cssClass = 'taken'
        } else if (thisType === 'AVAILABLE' && !this.allAvailableWeekPeriodsSelected && !this.isPeriodSelectedOnThisDay(dayDetails.date)) {
          cssClass = 'available'
          clickListener = this.handleAvailablePeriodClick.bind(this, { dayDetails, index: i })
        } else {
          cssClass = 'notAvailable'
        }
      }

      dayPeriods.push({ key: dayDetails.date.getDay() + i, className: cssClass, onClick: clickListener })
    }

    return dayPeriods
  }

  render () {
    return (
      <main>
        <div className="calendar">
          <ul className="calendar__Hours">
            { this.preparePeriodHours().map(({ key, periodString }) =>
              <li key={key}>{ periodString }</li>
            ) }
          </ul>
          { this.nextSevenDaysDetails.map(day =>
            <div key={ day.dateToString } className="calendar__Day">
              <div className="calendar__DayNameDate">
                <span>{ day.dayName }</span>
                <span>{ day.dateToString }</span>
              </div>
              <ul className="calendar__Periods">
                { this.preparePeriodsData(day).map(({ key, className, onClick }) =>
                  <li key={key} className={className} onClick={onClick}></li>
                ) }
              </ul>
            </div>
          ) }
        </div>
      </main>
    )
  }
}
