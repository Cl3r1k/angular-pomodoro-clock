import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create the app', async(() => {
        // Arrange

        // Act

        // Assert
        expect(component).toBeTruthy();
    }));

    it('should render title in a h1 tag', async(() => {
        // Arrange

        // Act
        const compiled = fixture.debugElement.nativeElement;

        // Assert
        expect(compiled.querySelector('h1').textContent).toContain('FreeCodeCamp Pomodoro Clock');
    }));

    it(`should have initial params`, async(() => {
        // Arrange

        // Act

        // Assert
        expect(component.breakLength).toEqual(5);
        expect(component.sessionLength).toEqual(25);
        expect(component.currentTimer).toEqual('25'.toString());
        expect(component.currentTimerInSeconds).toEqual(25 * 60);
        expect(component.currentState).toEqual('Session');
        expect(component.isSession).toEqual(false);
        expect(component.isBreak).toEqual(false);
        expect(component.bgFillingColor).toEqual('red');
        expect(component.bgFillingHeight).toEqual('0%');
        expect(component.currentStateMessage).toEqual('Tap to start');
        expect(component.timeInterval).toEqual(undefined);
    }));

    describe('#timerInit', () => {
        it(`should start timer if "session" or "break" is not running`, async(() => {
            // Arrange

            // Act
            component.timerInit();

            // Assert
            expect(component.timeInterval).toBeTruthy();
        }));

        it(`should stop timer and set timeInterval as undefined if "session" or "break" is running`, async(() => {
            // Arrange

            // Act
            component.timerInit();
            component.timerInit();

            // Assert
            expect(component.timeInterval).toEqual(undefined);
        }));

        it(`should start "session" if "break" is false and timeInterval is undefined`, async(() => {
            // Arrange

            // Act
            component.timerInit();

            // Assert
            expect(component.timeInterval).toBeTruthy();
            expect(component.isSession).toEqual(true);
            expect(component.isBreak).toEqual(false);
            expect(component.bgFillingColor).toEqual('red');
            expect(component.bgFillingHeight).toEqual('0%');
            expect(component.currentStateMessage).toEqual('Stay Focused at Work');
        }));

        it(`should start "break" if it is true and timeInterval is undefined`, async(() => {
            // Arrange
            component.isBreak = true;

            // Act
            component.timerInit();

            // Assert
            expect(component.timeInterval).toBeTruthy();
            expect(component.isSession).toEqual(false);
            expect(component.isBreak).toEqual(true);
            expect(component.bgFillingColor).toEqual('green');
            expect(component.bgFillingHeight).toEqual('0%');
            expect(component.currentStateMessage).toEqual('Time to Relax');
        }));
    });

    describe('#updateClock', () => {
        it(`should decrement currentTimerInSeconds`, async(() => {
            // Arrange
            const initialValue = component.currentTimerInSeconds;

            // Act
            component.updateClock();

            // Assert
            expect(component.currentTimerInSeconds).toEqual(initialValue - 1);
        }));

        it(`should decrement currentTimer on one second and format to clock`, async(() => {
            // Arrange

            // Act
            component.updateClock();

            // Assert
            expect(component.currentTimer).toEqual('24:59');
        }));

        it(`should increase bgFillingHeight on percent`, async(() => {
            // Arrange
            component.isSession = true;
            component.sessionLength = 1;
            component.currentTimer = component.sessionLength.toString();
            component.currentTimerInSeconds = component.sessionLength * 60;
            const totalLength = component.currentTimerInSeconds;
            const expectedPercent: string = (Math.round(100 - (component.currentTimerInSeconds - 1) / totalLength * 100)).toString() + '%';

            // Act
            component.updateClock();

            // Assert
            expect(component.bgFillingHeight).toEqual(expectedPercent);
        }));

        it(`should change "session" to "break" if session started when currentTimerInSeconds finished`, async(() => {
            // Arrange
            component.isSession = true;
            component.isBreak = false;
            component.currentTimerInSeconds = 1;

            // Act
            component.updateClock();

            // Assert
            expect(component.isSession).toEqual(false);
            expect(component.isBreak).toEqual(true);
        }));

        it(`should change "break" to "session" if break started when currentTimerInSeconds finished`, async(() => {
            // Arrange
            component.isSession = false;
            component.isBreak = true;
            component.currentTimerInSeconds = 1;

            // Act
            component.updateClock();

            // Assert
            expect(component.isSession).toEqual(true);
            expect(component.isBreak).toEqual(false);
        }));

        describe('#setFilling', () => {
            it(`should change "bgFillingColor" and "bgFillingHeight"`, async(() => {
                // Arrange

                // Act
                component.setFilling('aqua', '11%');

                // Assert
                expect(component.bgFillingColor).toEqual('aqua');
                expect(component.bgFillingHeight).toEqual('11%');
            }));
        });

        describe('#updateTimer', () => {
            it(`should reset "bgFillingColor" and "bgFillingHeight"`, async(() => {
                // Arrange

                // Act
                component.updateTimer(true);

                // Assert
                expect(component.bgFillingColor).toEqual('transparent');
                expect(component.bgFillingHeight).toEqual('0%');
            }));

            it(`should change 'currentTimer' and 'currentTimerInSeconds' if argument true(sessionLength changed)`, async(() => {
                // Arrange
                component.sessionLength = 99;

                // Act
                component.updateTimer(true);

                // Assert
                expect(component.currentTimer).toEqual(component.sessionLength.toString());
                expect(component.currentTimerInSeconds).toEqual(component.sessionLength * 60);
            }));

            it(`should change 'currentTimer' and 'currentTimerInSeconds' if argument false(breakLength changed)`, async(() => {
                // Arrange
                component.breakLength = 99;

                // Act
                component.updateTimer(false);

                // Assert
                expect(component.currentTimer).toEqual(component.breakLength.toString());
                expect(component.currentTimerInSeconds).toEqual(component.breakLength * 60);
            }));
        });

        describe(`#getTimeRemaining`, () => {
            it(`should return an object when number passed`, async(() => {
                // Arrange
                let obj: {};

                // Act
                obj = component.getTimeRemaining(1499);        // 24 minutes and 59 seconds for example

                // Assert
                expect(obj).toEqual({ 'total': 1499, 'minutes': 24, 'seconds': 59});
            }));
        });

        describe(`#decreaseBreakLength`, () => {
            it(`should decrement 'breakLength'`, async(() => {
                // Arrange
                const prevVal = component.breakLength;

                // Act
                component.decreaseBreakLength();

                // Assert
                expect(component.breakLength).toEqual(prevVal - 1);
            }));

            it(`should not decrement 'breakLength' if timeInterval is not undefined`, async(() => {
                // Arrange
                const prevVal = component.breakLength;

                // Act
                component.timerInit();
                component.decreaseBreakLength();

                // Assert
                expect(component.breakLength).toEqual(prevVal);
            }));

            it(`should not decrement 'breakLength' if value is minimal(1)`, async(() => {
                // Arrange
                const prevVal = component.breakLength = 1;

                // Act
                component.decreaseBreakLength();

                // Assert
                expect(component.breakLength).toEqual(prevVal);
            }));
        });

        describe(`#increaseBreakLength`, () => {
            it(`should increment 'breakLength'`, async(() => {
                // Arrange
                const prevVal = component.breakLength;

                // Act
                component.increaseBreakLength();

                // Assert
                expect(component.breakLength).toEqual(prevVal + 1);
            }));

            it(`should not increment 'breakLength' if timeInterval is not undefined`, async(() => {
                // Arrange
                const prevVal = component.breakLength;

                // Act
                component.timerInit();
                component.increaseBreakLength();

                // Assert
                expect(component.breakLength).toEqual(prevVal);
            }));

            it(`should not increment 'breakLength' if value is maximal(99)`, async(() => {
                // Arrange
                const prevVal = component.breakLength = 99;

                // Act
                component.increaseBreakLength();

                // Assert
                expect(component.breakLength).toEqual(prevVal);
            }));
        });

        describe(`#decreaseSessionLength`, () => {
            it(`should decrement 'sessionLength'`, async(() => {
                // Arrange
                const prevVal = component.sessionLength;

                // Act
                component.decreaseSessionLength();

                // Assert
                expect(component.sessionLength).toEqual(prevVal - 1);
            }));

            it(`should not decrement 'sessionLength' if timeInterval is not undefined`, async(() => {
                // Arrange
                const prevVal = component.sessionLength;

                // Act
                component.timerInit();
                component.decreaseSessionLength();

                // Assert
                expect(component.sessionLength).toEqual(prevVal);
            }));

            it(`should not decrement 'sessionLength' if value is minimal(1)`, async(() => {
                // Arrange
                const prevVal = component.sessionLength = 1;

                // Act
                component.decreaseSessionLength();

                // Assert
                expect(component.sessionLength).toEqual(prevVal);
            }));
        });

        describe(`#increaseSessionLength`, () => {
            it(`should increment 'sessionLength'`, async(() => {
                // Arrange
                const prevVal = component.sessionLength;

                // Act
                component.increaseSessionLength();

                // Assert
                expect(component.sessionLength).toEqual(prevVal + 1);
            }));

            it(`should not increment 'sessionLength' if timeInterval is not undefined`, async(() => {
                // Arrange
                const prevVal = component.sessionLength;

                // Act
                component.timerInit();
                component.increaseSessionLength();

                // Assert
                expect(component.sessionLength).toEqual(prevVal);
            }));

            it(`should not increment 'sessionLength' if value is maximal(99)`, async(() => {
                // Arrange
                const prevVal = component.sessionLength = 99;

                // Act
                component.increaseSessionLength();

                // Assert
                expect(component.sessionLength).toEqual(prevVal);
            }));
        });
    });
});
