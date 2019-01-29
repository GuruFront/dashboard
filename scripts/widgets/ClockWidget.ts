/// <reference path="../Widget.ts" />
class ClockWidget extends Widget {
    public static readonly id = "clockWidget";

    private withDate: boolean;
    private withDatePicker: boolean;
    private dateFormat: number;
    private dateTimezone: string;
    private isRemovable: boolean;

    private clockElement: HTMLElement;
    private dateElement: HTMLElement;
    private datePickerElement: HTMLElement;

    private interval: number;

    constructor(options: IClockWidgetOptions) {
        const config: IWidgetConfiguration = {
            isConfigurable: true,
            isResizable: typeof options.isResizable !== "undefined" ? options.isResizable : true,
            isRemovable: typeof options.isRemovable !== "undefined" ? options.isRemovable : true,
            title: options.title || "Clock",
            minWidth: options.minWidth || 2,
            width: options.width || 4,
            height: options.height || 2,
            minHeight: options.minHeight || 2,
            x: options.x,
            y: options.y,
            isTimeDependant: true
        };

        super(config);
        this.withDate = options.withDate != null ? options.withDate : true;
        this.withDatePicker = options.withDatePicker != null ? options.withDatePicker : true;
        this.dateFormat = 12;
    }

    init(element: HTMLElement) {
        //console.log('initializing a сlock', element);

        element.classList.add("clock-widget");
        this.hideSpinner(element);
        if (this.withDate) {
            this.dateElement = this.createDateElement(element);
            if (this.withDatePicker) {
                this.datePickerElement = this.createDatePickerElement(element);
            }
        }

        this.clockElement = this.createClockElement(element);
        this.startClock();
        this.handleConfigurableMode(element);

    }

    private reInit() {
        this.stopClock();
        this.clockElement.remove();
        this.clockElement = this.createClockElement(this.cellElement);
        this.startClock();
    }

    private handleConfigurableMode(el): void {
        el.addEventListener('click', (e) => {
            let isEditButton = e.target.classList[0] === 'widget-icon-edit';
            if (isEditButton) {
                this.setSettings();
            }
        });
    }

    private setSettings(): void {
        let
            widgetSettings: IWidgetEditSettings[] = [
                {
                    name: "dateType",
                    inputType: "radio",
                    title: "Choose data type",
                    values: [12, 24]
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
                    values: moment.tz.names()
                },
                {
                    name: "testInputText",
                    inputType: "inputText",
                    title: "Test input text",
                    placeholder: "Test input placeholder"
                }

            ];
        this.renderForm(widgetSettings);
    }

    protected applyNewSettings(data) {
        let data = data.split('&'),
            result = {};

        data.forEach((item) => {
            item = item.split("=");
            result[item[0]] = decodeURIComponent(item[1])
        });

        for (let key in result) {
            if (result.hasOwnProperty(key)) {
                switch (key) {
                    case 'dateType' :
                        this.dateFormat = result[key];
                        console.log("dateFormat -->", this.dateFormat);
                        break;
                    case 'dateTimezone' :
                        this.dateTimezone = result[key];
                        console.log("dateTimezone -->", result[key]);
                        break;
                    case 'testInputText' :
                        console.log("testInputText -->", result[key]);
                        break;
                    case 'testCheckBox' :
                        console.log("testCheckBox -->", result[key]);
                        break;
                    default :
                        console.log("Unknown data from form");
                        break;
                }
            }
        }
        this.reInit();
    }

    protected handleDateChange(newDate: Date, isToday: boolean) {
        console.log(newDate, isToday);
    }

    private createDateElement(element: HTMLElement) {
        const dateElement = document.createElement('div');
        dateElement.className = "date";
        dateElement.innerText = this.getDateString();
        if (this.withDatePicker) {
            dateElement.onclick = (ev) => {
                dateElement.style.display = 'none';
                this.datePickerElement.style.display = 'block';
            };
        }
        element.appendChild(dateElement);
        return dateElement;
    }

    private createDatePickerElement(element: HTMLInputElement) {
        const datePickerElement = document.createElement('input');
        datePickerElement.type = 'date';
        datePickerElement.style.display = 'none';
        const today = new Date().toISOString().split("T")[0];
        datePickerElement.value = today;
        datePickerElement.max = today;

        datePickerElement.onchange = (ev) => {
            const value = (ev.target as HTMLElement).value;
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

    private createClockElement(element: HTMLInputElement) {
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
            if (this.withDate) {
                this.dateElement.innerText = this.getDateString();
            }
        }, 1000);
    }

    private getTimeString(): string {
        let options = {};

        // dateTimezone
        if (typeof this.dateTimezone !== "undefined") {
            options.timeZone = this.dateTimezone
        }
        // dateFormat
        if (this.dateFormat == 12) {
            options.hour12 = true;
        } else if (this.dateFormat == 24) {
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

interface IClockWidgetOptions extends IWidgetOptions {
    withDate?: boolean;
    withDatePicker?: boolean;
    dateFormat: boolean;
}
