import './App.scss'
import React, { Component } from 'react'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedPeriods: []
    }

    this.MAX_WEEKLY_PERIODS = 2
    this.MAX_DAILY_PERIODS = 1
    this.PERIOD_LENGTH_MINS = 30
    this.PAUSE_LENGTH_MINS = 90
    this.MAX_WORK_HOUR = 19
    this.MIN_WORK_HOUR = 8
    this.WORK_TIME_ODD = { start: 13, end: this.MAX_WORK_HOUR, pauseStart: 16 }
    this.WORK_TIME_EVEN = { start: this.MIN_WORK_HOUR, end: 14, pauseStart: 11 }
    this.DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    this.MOCK_SELECTED_PERIODS = [
      {

      }
    ]
  }

  get dailyPeriodsCount () {
    return (this.MAX_WORK_HOUR - this.MIN_WORK_HOUR) * (60 / this.PERIOD_LENGTH_MINS)
  }

  get nextSevenDays () {
    const nextSevenDays = []
    const today = new Date()
    for (let i = 1; i <= 7; i++) {
      const thisDate = new Date()
      thisDate.setDate(today.getDate() + i)
      nextSevenDays.push(thisDate)
    }
    return nextSevenDays
  }

  get allAvailableWeekPeriodsSelected () {
    return this.state.selectedPeriods.length === this.MAX_WEEKLY_PERIODS
  }

  getDateString (date) {
    return date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear()
  }

  renderPeriods (date) {
    const dayPeriods = []
    for (let i = 1; i <= this.dailyPeriodsCount; i++) {
      dayPeriods.push(<li></li>)
    }
    return dayPeriods
  }

  render () {
    console.log(this.nextSevenDays)
    return (
      <main>
        <div className="calendar">
          {this.nextSevenDays.map(day =>
            <div key={day.getDate()} className="calendar__Day">
              <div className="calendar__DayNameDate">
                <span>{ this.DAYS[day.getDay()] }</span>
                <span>{ this.getDateString(day) }</span>
              </div>
              <ul className="calendar__Periods">
                {this.renderPeriods().map(period => period)}
              </ul>
            </div>
          )}
        </div>
      </main>
    )
  }
}
