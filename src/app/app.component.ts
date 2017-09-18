// C:\Windows\System32\cmd.exe /k "C:\Program Files\nodejs\nodevars.bat" // To start from VSC terminal node env

// TODO:
// - написать бизнес логику
// -- I can start a 25 minute pomodoro, and the timer will go off once 25 minutes has elapsed.
// -- I can reset the clock for my next pomodoro.
// -- I can customize the length of each pomodoro.
// -- По завершении помдорки автоматически начать отдых (причем цвет заполнения должен быть другой) и написать писаться Break!
// -- также и при завершении перерыва должен запускаться помидор
// -- Добавить доп поле под Текущим статусом (при работу - focus on work, а при отдыхе - relax или что-нибудь в этом роде)
// -- При сессии работы на паузе и изменении времени работы таймер сбрасывается (можно только его изменять)
// -- При сессии отдыха на паузе и изменен времени отдыха таймер сбрасывается, и стартует уже с новым значением (можно только его изменять)
// -- При запущенных сессиях нет возможности менять значения времени отдыха и работы
// -- Добавить отдельную кнопку сброса помидорки/отдыха
// - стилизовать приложение
// - написать юинт тесты
// - correct e2e test
// - при завершении помидорки выдавать звуковой сигнал и алерт
// - при нажатии на запущенном помидоре, выдавать запрос на прерывание
// - и по возможности прикрутить спинер на загрузке компонента

import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    breakLength = 5;
    sessionLength = 25;
    currentTimer = this.sessionLength.toString();    // Variable to view current time in component
    currentTimerInSeconds = this.sessionLength * 60;
    currentState = 'Session';
    isSession = false;
    isBreak = false;
    isSessionPaused = false;
    isBreakPaused = false;

    // Define timer variable
    timeInterval;

    sessionChangeState() {
        this.timerInit();
    }

    decreaseBreakLength() {
        if (this.timeInterval === undefined) {
            if (this.breakLength > 1) {
                this.breakLength--;
                if (this.isBreak) {
                    this.updateTimer(false);
                }
            }
        }
    }

    increaseBreakLength() {
        if (this.timeInterval === undefined) {
            if (this.breakLength < 99) {
                this.breakLength++;
                if (this.isBreak) {
                    this.updateTimer(false);
                }
            }
        }
    }

    decreaseSessionLength() {
        if (this.timeInterval === undefined) {
            if (this.sessionLength > 1) {
                this.sessionLength--;
                if (!this.isBreak) {
                    this.updateTimer(true);
                }
            }
        }
    }

    increaseSessionLength() {
        if (this.timeInterval === undefined) {
            if (this.sessionLength < 99) {
                this.sessionLength++;
                if (!this.isBreak) {
                    this.updateTimer(true);
                }
            }
        }
    }

    timerInit() {

        if (this.timeInterval !== undefined) {
            clearInterval(this.timeInterval);    // Типа пауза
            this.timeInterval = undefined;
            return;
        }

        if (!this.isSession && !this.isBreak) {
            this.isSession = true;
        }

        this.updateClock();
        this.timeInterval = setInterval(() => {
            this.updateClock();
        }, 1000);
    }

    updateClock() {
        this.currentTimerInSeconds--;

        const t = this.getTimeRemaining(this.currentTimerInSeconds);
        this.currentTimer = this.currentTimerInSeconds.toString();
        this.currentTimer = ('0' + t.minutes).slice(-2) + ':' + ('0' + t.seconds).slice(-2);

        if (this.currentTimerInSeconds <= 0) {

            if (this.isSession) {
                this.isSession = false;
                this.isBreak = true;
                this.currentState = 'Break!';
                this.currentTimerInSeconds = this.breakLength * 60;
            } else {
                this.isSession = true;
                this.isBreak = false;
                this.currentState = 'Session';
                this.currentTimerInSeconds = this.sessionLength * 60;
            }
        }
    }

    // Fumction to define the remaining time
    getTimeRemaining(totalTime) {
        const seconds = Math.floor((totalTime) % 60);
        const minutes = Math.floor((totalTime / 60) % 60);

        return {
            'total': totalTime,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    updateTimer(isSessionChanged: boolean) {
        if (isSessionChanged) {
            this.currentTimer = this.sessionLength.toString();
            this.currentTimerInSeconds = this.sessionLength * 60;    // Current value of session in seconds
        } else {
            this.currentTimer = this.breakLength.toString();
            this.currentTimerInSeconds = this.breakLength * 60;    // Current value of break in seconds
        }
    }

}
