/// <reference path="../Widget.ts" />
class ClockWidget extends Widget<IClockWidgetConfiguration> {
    public static readonly id = "clockWidget";

    private clockElement: HTMLElement;
    private dateElement: HTMLElement;
    private datePickerElement: HTMLElement;

    private interval: number;

    constructor(options: IClockWidgetConfiguration, clientId: number) {

        const config: IClockWidgetConfiguration = {
            ...options, // copy all other properties 
            isConfigurable: getValueOrDefault(options.isConfigurable, true),
            isResizable: getValueOrDefault(options.isResizable, true),
            isRemovable: getValueOrDefault(options.isRemovable, true),
            title: options.title || "Clock",
            minWidth: options.minWidth || 2,
            width: options.width || 4,
            height: options.height || 2,
            minHeight: options.minHeight || 2,
            isTimeDependant: true,
            withDate: getValueOrDefault(options.withDate, true),
            withDatePicker: getValueOrDefault(options.withDatePicker, true),
            dateFormat: getValueOrDefault(options.dateFormat, 12)
        };

        const widgetSettings = [
            {
                name: "dataType",
                inputType: "radio",
                title: "Choose data type",
                values: [12, 24],
                value: config.dateFormat
            }, {
                name: "dateTimezone",
                inputType: "select",
                title: "Choose timezone",
                values: moment.tz.names()
            }];

        super(config, clientId, widgetSettings);
    }

    protected init(element: HTMLElement) {
        //console.log('initializing a сlock', element);

        element.classList.add("clock-widget");
        this.hideSpinner();

        if (this.config.withDate) {
            this.dateElement = this.createDateElement(element);
            if (this.config.withDatePicker) {
                this.datePickerElement = this.createDatePickerElement(element);
            }
        }

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
                    case 'dataType':
                        this.config.dateFormat = +result[key];
                        // TODO: it must be changed
                        this.widgetSettings[0].value = this.config.dateFormat;
                        console.log("dateFormat -->", this.config.dateFormat);
                        break;
                    case 'dateTimezone':
                        this.config.dateTimezone = result[key];
                        // TODO: it must be changed
                        this.widgetSettings[1].value = this.config.dateFormat;
                        console.log("dateTimezone -->", result[key]);
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

    protected handleClientChange(clientId: number) { }

    private createDateElement(element: HTMLElement) {
        const dateElement = document.createElement('div');
        dateElement.className = "date";
        dateElement.innerText = this.getDateString();
        if (this.config.withDatePicker) {
            dateElement.onclick = (ev) => {
                dateElement.style.display = 'none';
                this.datePickerElement.style.display = 'block';
            };
        }
        element.appendChild(dateElement);
        return dateElement;
    }

    private createDatePickerElement(element: HTMLElement) {
        const datePickerElement = document.createElement('input');
        datePickerElement.type = 'date';
        datePickerElement.style.display = 'none';
        const today = new Date().toISOString().split("T")[0];
        datePickerElement.value = today;
        datePickerElement.max = today;

        datePickerElement.onchange = (ev) => {
            const value = (ev.target as HTMLInputElement).value;
            const isToday = new Date().toISOString().split("T")[0] === value;

            if (isToday) {
                this.clockElement.innerText = this.getTimeString();
                this.startClock();
            }
            else {
                this.stopClock();
                this.clockElement.innerText = '23:59:59';
            }

            const date = new Date(value);
            var event = new CustomEvent('date_changed', {
                detail: {
                    date: date,
                    isToday: isToday
                }
            });
            document.dispatchEvent(event);
            datePickerElement.style.display = 'none';
            this.dateElement.style.display = 'block';
            this.dateElement.innerText = this.getDateString(date);
        };

        element.appendChild(datePickerElement);
        return datePickerElement;
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
            if (this.config.withDate) {
                this.dateElement.innerText = this.getDateString();
            }
        }, 1000);
    }

    private getTimeString(): string {
        let options: {
            hour12?: boolean,
            timeZone?: string
        } = {};
        console.log(this.config.dateTimezone);
        // dateTimezone
        if (typeof this.config.dateTimezone !== "undefined") {
            options.timeZone = this.config.dateTimezone;
        }
        // dateFormat
        if (this.config.dateFormat == 12) {
            options.hour12 = true;
        } else if (this.config.dateFormat == 24) {
            options.hour12 = false;
        }

        return new Date().toLocaleTimeString('it-IT', options);
    }

    private getDateString(date?: Date): string {
        date = date || new Date();
        var options = { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' };

        return date.toLocaleDateString('en-GB', options);
    }
}

interface IClockWidgetConfiguration extends IWidgetConfiguration {
    withDate?: boolean;
    withDatePicker?: boolean;
    dateFormat?: number;
    dateTimezone?: string;
}
