/// <reference path="../Widget.ts" />
declare const moment: any;

class ClockWidget extends Widget<IClockWidgetOptions> {
    public static readonly id: string = "clockWidget";

    private clockElement: HTMLElement;
    private dateElement: HTMLElement;

    private interval: number;

    public static sidebarSettings: ISideBarSettings = {
        title: 'Clock',
        description: 'Clock widget. Not removable. Configurable. Not resizable. Movable. 4*2. Single instance',
        category: 'General',
        icon: 'fas fa-clock',
        defaultWidth: 4,
        defaultHeight: 2,
        maxCount: 1,
        isResizable: true,
        isMovable: true,
    };

    constructor(clientId: number, options: IOptions<IClockWidgetOptions>) {

        const config: IWidgetConfiguration = {
            isRemovable: true,
            isConfigurable: true,
            minWidth: 2,
            minHeight: 2,
            isTimeDependant: true,
            maxInstanceCount: 1,
        };

        const widgetSettings = [
            {
                name: "dateFormat",
                inputType: "radio",
                title: "Choose data type",
                values: [12, 24],
                value: options.options.dateFormat
            },
            {
                name: "testCheckBox",
                inputType: "checkbox",
                title: "Test CheckBox",
                values: ["Foo"]
            },
            {
                name: "dateTimezone",
                inputType: "select",
                title: "Choose timezone",
                values: moment.tz.names(),
                value: options.options.dateTimezone
            },
            {
                name: "testInputText",
                inputType: "inputText",
                title: "Test input text",
                placeholder: "Test input placeholder"
            },
            {
                name: "testInputNumber",
                inputType: "inputNumber",
                title: "Test input number",
                placeholder: "Test numbers placeholder"
            }
        ];

        super(config, clientId, options, widgetSettings);
    }

    protected handleResize() {
        console.log('Clock');
    }

    protected init(element: HTMLElement) {
        element.classList.add("clock-widget");
        this.hideSpinner();

        this.dateElement = this.createDateElement(element);

        this.clockElement = this.createClockElement(element);
        this.startClock();
    }

    protected reDraw() {
        this.stopClock();
        this.clockElement.remove();

        this.clockElement = this.createClockElement(this.cellElement);
        this.startClock();
    }

    protected applyNewSettings(result: object) {
        for (let key in result) {
            if (result.hasOwnProperty(key)) {
                switch (key) {
                    case 'dateFormat':
                        this.options.dateFormat = +result[key];
                        // TODO: it must be changed
                        this.widgetSettings[0].value = this.options.dateFormat;
                        console.log("dateFormat -->", this.options.dateFormat);
                        break;
                    case 'dateTimezone':
                        this.options.dateTimezone = result[key];
                        // TODO: it must be changed
                        this.widgetSettings[2].value = this.options.dateTimezone;
                        console.log("dateTimezone -->", result[key]);
                        break;
                    case 'testInputText':
                        console.log("testInputText -->", result[key]);
                        break;
                    case 'testInputNumber':
                        console.log("testInputNumber -->", result[key]);
                        break;
                    case 'testCheckBox':
                        console.log("testCheckBox -->", result[key]);
                        break;
                    default:
                        console.log("Unknown data from form");
                        break;
                }
            }
        }

        this.reDraw();
    }

    protected handleDateChange(newDate: Date, isToday: boolean) {
        console.log(newDate, isToday);
    }

    protected handleClientChange(clientId: number) {
    }

    private createDateElement(element: HTMLElement) {
        const dateElement = document.createElement('div');
        dateElement.className = "date";
        dateElement.innerText = this.getDateString();
        element.appendChild(dateElement);
        return dateElement;
    }

    private createClockElement(element: HTMLElement) {
        const clockElement = document.createElement('div');
        clockElement.className = "clock";
        clockElement.innerText = this.getTimeString();
        element.appendChild(clockElement);

        return clockElement;
    }

    private stopClock() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    private startClock() {
        this.interval = setInterval(() => {
            this.clockElement.innerText = this.getTimeString();
            this.dateElement.innerText = this.getDateString();
        }, 1000);
    }

    private getTimeString(): string {
        let options: {
            hour12?: boolean,
            timeZone?: string
        } = {};

        // dateTimezone
        if (typeof this.options.dateTimezone !== "undefined") {
            options.timeZone = this.options.dateTimezone;
        }
        // dateFormat
        if (this.options.dateFormat == 12) {
            options.hour12 = true;
        } else if (this.options.dateFormat == 24) {
            options.hour12 = false;
        }

        return new Date().toLocaleTimeString('it-IT', options);
    }

    private getDateString(date?: Date): string {
        date = date || new Date();
        var options = {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit'};

        return date.toLocaleDateString('en-GB', options);
    }
}

interface IClockWidgetOptions {
    dateFormat?: number;
    dateTimezone?: string;
}
