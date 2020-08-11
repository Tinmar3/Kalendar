import './App.scss'
import React, { Component } from 'react'
import { format, add } from 'date-fns'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedPeriods: []
    }

    this.MAX_WEEKLY_PERIODS = 2
    this.MAX_DAILY_PERIODS = 1
    this.PERIOD_LENGTH_MINS = 30 // period length in minutes
    this.PAUSE_LENGTH_MINS = 90 // pause length in minutes
    this.MAX_WORK_HOUR = 19
    this.MIN_WORK_HOUR = 8
    this.WORK_TIME_ODD = { start: 13, end: this.MAX_WORK_HOUR, pauseStart: 16 }
    this.WORK_TIME_EVEN = { start: this.MIN_WORK_HOUR, end: 14, pauseStart: 11 }
    this.DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

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
      // console.log(new Date(2020, 8, 17))
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
    const isOddDateSaturday = (dateObj.getDay() === 6 && dateObj.getDate() % 2)

    for (let i = 1; i <= this.dailyPeriodsCount; i++) {
      if (isSunday || isOddDateSaturday) {
        dayPeriods.push(<li key={i} className="notWorking"></li>)
      } else {
        dayPeriods.push(<li key={i}></li>)
      }
    }

    // od datea slagati koje indexe treba bojati, a ne obratno

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
