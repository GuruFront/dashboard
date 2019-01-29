var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DataSource = (function () {
    function DataSource() {
    }
    DataSource.prototype.getData = function (from, to, fromServer) {
        var _this = this;
        if (fromServer === void 0) { fromServer = false; }
        if (this._data && !fromServer) {
            return new Promise(function (res, rej) {
                res(_this._data);
            });
        }
        else {
            return new Promise(function (res, rej) {
                setTimeout(function () {
                    _this._data = (Math.random() * 100).toFixed(0);
                    res(_this._data);
                }, 5000);
            });
        }
    };
    return DataSource;
}());
var WorkCompletedDataSource = (function (_super) {
    __extends(WorkCompletedDataSource, _super);
    function WorkCompletedDataSource() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._url = '/transportdashboard/GetWorkCompleted';
        _this._params = {
            test: 12
        };
        return _this;
    }
    WorkCompletedDataSource.prototype.getData = function (from, to, fromServer) {
        var _this = this;
        if (fromServer === void 0) { fromServer = false; }
        if (this._data && !fromServer) {
            return new Promise(function (res, rej) {
                res(_this._data);
            });
        }
        else {
            return new Promise(function (res, rej) {
                setTimeout(function () {
                    _this._data = (Math.random() * 100).toFixed(0);
                    res(_this._data);
                }, 5000);
            });
        }
    };
    WorkCompletedDataSource.id = "workCompletedDataSource";
    return WorkCompletedDataSource;
}(DataSource));
var _a;
var Widget = (function () {
    function Widget(config) {
        this.config = config;
        this.id = Math.random();
        this.subscribeToDateChangedEvent();
    }
    Widget.prototype.initBase = function (element) {
        this.cellElement = element;
        if (this.config.isConfigurable) {
            this.enableEditIcon(element);
        }
        if (this.config.isRemovable) {
            this.enableRemoveIcon(element);
        }
        this.init(element);
    };
    Widget.prototype.subscribeToDateChangedEvent = function () {
        var _this = this;
        if (this.config.isTimeDependant) {
            document.addEventListener('date_changed', function (ev) {
                var newDate = ev.detail.date;
                var idToday = ev.detail.isToday;
                _this.handleDateChange(newDate, idToday);
            }, false);
        }
    };
    Widget.prototype.handleDateChange = function (newDate, isToday) {
    };
    Widget.prototype.hideSpinner = function (element) {
        var spinner = element.getElementsByClassName("widget-loading-container")[0];
        spinner.style.display = 'none';
    };
    Widget.prototype.getDataSourceId = function () {
        return null;
    };
    Widget.widgetInitializer = function (options) {
        var widget;
        switch (options.id) {
            case ImageWidget.id:
                widget = new ImageWidget(options);
                break;
            case ClockWidget.id:
                widget = new ClockWidget(options);
                break;
            case WorkCountByActivityAndStatusWidget.id:
                widget = new WorkCountByActivityAndStatusWidget(options);
                break;
            default:
                return null;
        }
        if (widget) {
            var dataSourceId = widget.getDataSourceId();
            if (dataSourceId) {
                widget.dataSource = Widget._dataSources[dataSourceId];
            }
        }
        return widget;
    };
    Widget.prototype.enableRemoveIcon = function (el) {
        var icon = document.createElement("div");
        icon.setAttribute('class', 'widget-icon-delete');
        el.appendChild(icon);
    };
    Widget.prototype.enableEditIcon = function (el) {
        var icon = document.createElement("div");
        icon.setAttribute('class', 'widget-icon-edit');
        el.appendChild(icon);
    };
    Widget.prototype.openWidgetSettings = function () {
        var body = document.getElementsByTagName('body')[0], popupDiv = document.createElement('div'), container = document.createElement('div');
        popupDiv.setAttribute("class", "grid-item-popup");
        container.setAttribute("class", "grid-item-popup__container");
        popupDiv.appendChild(container);
        body.appendChild(popupDiv);
        return container;
    };
    Widget.prototype.renderForm = function (settings) {
        var _this = this;
        var popupContainer = this.openWidgetSettings(), widgetWrap = document.createElement('div');
        widgetWrap.setAttribute("class", "widget-settings-wrap");
        popupContainer.appendChild(widgetWrap);
        var form = document.createElement('form');
        form.setAttribute("action", "console.log(data)");
        form.setAttribute("method", 'POST');
        widgetWrap.appendChild(form);
        settings.forEach(function (inputEl) {
            switch (inputEl.inputType) {
                case 'radio':
                    renderInputRadio(inputEl);
                    break;
                case 'select':
                    renderSelect(inputEl);
                    break;
                default:
                    console.log('Input type not found');
                    break;
            }
        });
        var formButtonsWrap = document.createElement('div');
        formButtonsWrap.setAttribute("class", "settings-form-btns");
        var btnSave = document.createElement('button'), btnCancel = document.createElement('button');
        btnSave.setAttribute("type", "submit");
        btnSave.innerText = "Apply";
        btnCancel.setAttribute("type", "button");
        btnCancel.innerText = "Cancel";
        formButtonsWrap.appendChild(btnSave);
        formButtonsWrap.appendChild(btnCancel);
        form.appendChild(formButtonsWrap);
        form.addEventListener("submit", function (e) {
            var data = Array.from(new FormData(form), function (e) { return e.map(encodeURIComponent).join('='); }).join('&');
            e.preventDefault();
            _this.applyNewSettings(data);
        });
        btnCancel.addEventListener("click", function (e) {
            var allSettings = document.getElementsByClassName('grid-item-popup');
            for (var i = 0; allSettings.length > i; i++) {
                allSettings[i].remove();
            }
        });
        function renderInputRadio(inputEl) {
            var values = inputEl.values, type = inputEl.inputType, name = inputEl.name, titleHtml = document.createElement('strong'), inputWrap = document.createElement('div');
            titleHtml.setAttribute('class', 'settings-input-title');
            titleHtml.innerText = inputEl.title;
            inputWrap.setAttribute('class', 'settings-input-wrap');
            inputWrap.appendChild(titleHtml);
            form.appendChild(inputWrap);
            values.forEach(function (val) {
                var label = document.createElement('label'), input = document.createElement('input'), inputText = document.createElement('span');
                label.setAttribute("class", "settings-label");
                inputText.setAttribute("class", "settings-input-text");
                inputText.innerText = val;
                input.setAttribute('name', name);
                input.setAttribute('type', type);
                input.setAttribute('value', val);
                label.appendChild(input);
                label.appendChild(inputText);
                inputWrap.appendChild(label);
            });
        }
        function renderSelect(inputEl) {
            var values = inputEl.values, name = inputEl.name, titleHtml = document.createElement('strong'), inputWrap = document.createElement('div');
            titleHtml.setAttribute('class', 'settings-input-title');
            titleHtml.innerText = inputEl.title;
            inputWrap.setAttribute('class', 'settings-input-wrap');
            inputWrap.appendChild(titleHtml);
            form.appendChild(inputWrap);
            var select = document.createElement('select');
            select.setAttribute("name", name);
            inputWrap.appendChild(select);
            values.forEach(function (val) {
                var option = document.createElement("option");
                option.setAttribute('value', val);
                option.innerText = val;
                select.appendChild(option);
            });
        }
    };
    Widget.prototype.applyNewSettings = function (result) {
    };
    Widget._dataSources = (_a = {},
        _a[WorkCompletedDataSource.id] = new WorkCompletedDataSource(),
        _a);
    return Widget;
}());
var ClockWidget = (function (_super) {
    __extends(ClockWidget, _super);
    function ClockWidget(options) {
        var _this = this;
        var config = {
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
        _this = _super.call(this, config) || this;
        _this.withDate = options.withDate != null ? options.withDate : true;
        _this.withDatePicker = options.withDatePicker != null ? options.withDatePicker : true;
        _this.dateFormat = 12;
        return _this;
    }
    ClockWidget.prototype.init = function (element) {
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
    };
    ClockWidget.prototype.reInit = function () {
        this.stopClock();
        this.clockElement.remove();
        this.clockElement = this.createClockElement(this.cellElement);
        this.startClock();
    };
    ClockWidget.prototype.handleConfigurableMode = function (el) {
        var _this = this;
        el.addEventListener('click', function (e) {
            var isEditButton = e.target.classList[0] === 'widget-icon-edit';
            if (isEditButton) {
                _this.setSettings();
            }
        });
    };
    ClockWidget.prototype.setSettings = function () {
        var widgetSettings = [
            {
                name: "dateType",
                inputType: "radio",
                title: "Choose data type",
                values: [12, 24]
            },
            {
                name: "dateTimezone",
                inputType: "select",
                title: "Choose timezone",
                values: moment.tz.names()
            }
        ];
        this.renderForm(widgetSettings);
    };
    ClockWidget.prototype.applyNewSettings = function (data) {
        var data = data.split('&'), result = {};
        data.forEach(function (item) {
            item = item.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
        });
        for (var key in result) {
            if (result.hasOwnProperty(key)) {
                switch (key) {
                    case 'dateType':
                        this.dateFormat = result[key];
                        console.log("dateFormat -->", this.dateFormat);
                        break;
                    case 'dateTimezone':
                        this.dateTimezone = result[key];
                        console.log("dateTimezone -->", result[key]);
                        break;
                    default:
                        console.log("Unknown data from form");
                        break;
                }
            }
        }
        this.reInit();
    };
    ClockWidget.prototype.handleDateChange = function (newDate, isToday) {
        console.log(newDate, isToday);
    };
    ClockWidget.prototype.createDateElement = function (element) {
        var _this = this;
        var dateElement = document.createElement('div');
        dateElement.className = "date";
        dateElement.innerText = this.getDateString();
        if (this.withDatePicker) {
            dateElement.onclick = function (ev) {
                dateElement.style.display = 'none';
                _this.datePickerElement.style.display = 'block';
            };
        }
        element.appendChild(dateElement);
        return dateElement;
    };
    ClockWidget.prototype.createDatePickerElement = function (element) {
        var _this = this;
        var datePickerElement = document.createElement('input');
        datePickerElement.type = 'date';
        datePickerElement.style.display = 'none';
        var today = new Date().toISOString().split("T")[0];
        datePickerElement.value = today;
        datePickerElement.max = today;
        datePickerElement.onchange = function (ev) {
            var value = ev.target.value;
            var isToday = new Date().toISOString().split("T")[0] === value;
            if (isToday) {
                _this.clockElement.innerText = _this.getTimeString();
                _this.startClock();
            }
            else {
                _this.stopClock();
                _this.clockElement.innerText = '23:59:59';
            }
            var date = new Date(value);
            var event = new CustomEvent('date_changed', {
                detail: {
                    date: date,
                    isToday: isToday
                }
            });
            document.dispatchEvent(event);
            datePickerElement.style.display = 'none';
            _this.dateElement.style.display = 'block';
            _this.dateElement.innerText = _this.getDateString(date);
        };
        element.appendChild(datePickerElement);
        return datePickerElement;
    };
    ClockWidget.prototype.createClockElement = function (element) {
        var clockElement = document.createElement('div');
        clockElement.className = "clock";
        clockElement.innerText = this.getTimeString();
        element.appendChild(clockElement);
        return clockElement;
    };
    ClockWidget.prototype.stopClock = function () {
        if (this.interval) {
            clearInterval(this.interval);
        }
    };
    ClockWidget.prototype.startClock = function () {
        var _this = this;
        this.interval = setInterval(function () {
            _this.clockElement.innerText = _this.getTimeString();
            if (_this.withDate) {
                _this.dateElement.innerText = _this.getDateString();
            }
        }, 1000);
    };
    ClockWidget.prototype.getTimeString = function () {
        var options = {};
        if (typeof this.dateTimezone !== "undefined") {
            options.timeZone = this.dateTimezone;
        }
        if (this.dateFormat == 12) {
            options.hour12 = true;
        }
        else if (this.dateFormat == 24) {
            options.hour12 = false;
        }
        return new Date().toLocaleTimeString('it-IT', options);
    };
    ClockWidget.prototype.getDateString = function (date) {
        date = date || new Date();
        var options = { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' };
        return date.toLocaleDateString('en-GB', options);
    };
    ClockWidget.id = "clockWidget";
    return ClockWidget;
}(Widget));
var ImageWidget = (function (_super) {
    __extends(ImageWidget, _super);
    function ImageWidget(options) {
        var _this = this;
        var config = {
            isConfigurable: false,
            isResizable: typeof options.isResizable !== "undefined" ? options.isResizable : true,
            isRemovable: typeof options.isRemovable !== "undefined" ? options.isRemovable : true,
            title: options.title || "Image",
            width: options.width || 2,
            height: options.height || 2,
            minHeight: 1,
            maxHeight: 3,
            minWidth: 1,
            maxWidth: 3,
            x: options.x,
            y: options.y,
            isTimeDependant: false
        };
        _this = _super.call(this, config) || this;
        _this.imageUrl = options.imageUrl || 'http://tf-dev01.cloudapp.net/Content/images/s2-header-logo-techfinity.png';
        return _this;
    }
    ImageWidget.prototype.init = function (element) {
        this.hideSpinner(element);
        element.style.backgroundImage = "url('" + this.imageUrl + "')";
        element.style.backgroundRepeat = "no-repeat";
        element.style.backgroundSize = "cover";
    };
    ImageWidget.id = "imageWidget";
    return ImageWidget;
}(Widget));
var WorkCountByActivityAndStatusWidget = (function (_super) {
    __extends(WorkCountByActivityAndStatusWidget, _super);
    function WorkCountByActivityAndStatusWidget(options) {
        var _this = this;
        var config = {
            isConfigurable: false,
            isResizable: typeof options.isResizable !== "undefined" ? options.isResizable : true,
            isRemovable: typeof options.isRemovable !== "undefined" ? options.isRemovable : true,
            title: options.title || "Work Counter",
            width: options.width || 2,
            height: options.height || 2,
            minHeight: 1,
            maxHeight: 3,
            minWidth: 1,
            maxWidth: 3,
            x: options.x,
            y: options.y,
            isTimeDependant: true
        };
        _this = _super.call(this, config) || this;
        _this.activityTypeId = options.activityTypeId;
        _this.workStatusId = options.workStatusId;
        return _this;
    }
    WorkCountByActivityAndStatusWidget.prototype.init = function (element) {
        var _this = this;
        element.classList.add("work-count-widget");
        this.createTitleElement(element);
        this.counterElement = this.createCounterElement(element);
        if (!this.dataSource) {
            throw new Error('DataSource is null');
        }
        this.dataSource.getData()
            .then(function (data) {
            _this.hideSpinner(element);
            _this.counterElement.innerText = data.toString();
        });
    };
    WorkCountByActivityAndStatusWidget.prototype.createTitleElement = function (element) {
        var p = document.createElement('div');
        p.className = 'title';
        p.innerText = this.config.title;
        element.appendChild(p);
    };
    WorkCountByActivityAndStatusWidget.prototype.createCounterElement = function (element) {
        var el = document.createElement('div');
        el.className = 'counter';
        el.innerHTML = '&nbsp;';
        element.appendChild(el);
        return el;
    };
    WorkCountByActivityAndStatusWidget.prototype.getDataSourceId = function () {
        return WorkCompletedDataSource.id;
    };
    WorkCountByActivityAndStatusWidget.id = "workCountByActivityAndStatusWidget";
    WorkCountByActivityAndStatusWidget.dataSourceId = "workCompetedDataSource";
    return WorkCountByActivityAndStatusWidget;
}(Widget));
//# sourceMappingURL=script.js.map