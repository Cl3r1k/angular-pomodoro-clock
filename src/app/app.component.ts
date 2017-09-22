import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    breakLength = 5;
    sessionLength = 25;
    currentTimer = this.sessionLength.toString();    // Variable to view current time in component
    currentTimerInSeconds = this.sessionLength * 60;
    currentState = 'Session';
    isSession = false;
    isBreak = false;
    isSessionPaused = false;
    isBreakPaused = false;
    bgFillingColor = 'transparent';
    bgFillingHeight = '0%';
    currentStateMessage = 'Tap to start';

    visibility = false;

    // Define timer variable
    timeInterval;

    ngOnInit() {
        this.setFilling('red', '0%');
    }

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
            clearInterval(this.timeInterval);    // Some king of pause
            this.timeInterval = undefined;
            return;
        }

        if (this.timeInterval === undefined && this.isBreak === false) {
            this.isSession = true;
            this.setFilling('red', '0%');
            this.currentStateMessage = 'Stay Focused at Work';
        } else {
            this.setFilling('green', '0%');
            this.currentStateMessage = 'Time to Relax';
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

        let totalLength: number;

        if (this.isSession) {
            totalLength = this.sessionLength * 60;
        } else {
            totalLength = this.breakLength * 60;
        }

        this.bgFillingHeight = (Math.round(100 - this.currentTimerInSeconds / totalLength * 100)).toString() + '%';

        if (this.currentTimerInSeconds <= 0) {

            if (this.isSession) {
                this.isSession = false;
                this.isBreak = true;
                this.currentState = 'Break!';
                this.currentTimerInSeconds = this.breakLength * 60;
                this.setFilling('green', '0%');
                this.currentStateMessage = 'Time to Relax';
            } else {
                this.isSession = true;
                this.isBreak = false;
                this.currentState = 'Session';
                this.currentTimerInSeconds = this.sessionLength * 60;
                this.setFilling('red', '0%');
                this.currentStateMessage = 'Stay Focused at Work';
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

        this.setFilling('transparent', '0%');
        this.currentStateMessage = 'Tap to start';
    }

    setFilling(bgColor: string, bgWidth: string) {
        this.bgFillingColor = bgColor;
        this.bgFillingHeight = bgWidth;
    }

}
