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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var DataSource = (function () {
    function DataSource() {
    }
    DataSource.prototype.getData = function () {
        var _this = this;
        if (this._data) {
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
var Widget = (function () {
    function Widget(config, clientId, widgetSettings) {
        this.config = config;
        this.id = Math.random();
        this.currentClientId = clientId;
        this.widgetSettings = widgetSettings || [];
        this.subscribeToDateChangedEvent();
        this.subscribeToClientChangedEvent();
        this.subscribeToGridEditingEvents();
    }
    Widget.prototype.initBase = function (element) {
        this.cellElement = element;
        this.isDisplayed = true;
        if (this.config.isConfigurable && this.widgetSettings) {
            this.enableEditIcon(element);
        }
        if (this.config.isRemovable) {
            this.enableRemoveIcon(element);
        }
        this.init(element);
    };
    Widget.prototype.destroy = function () {
        this.isDisplayed = false;
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
    Widget.prototype.handleDateChange = function (newDate, isToday) { };
    Widget.prototype.subscribeToClientChangedEvent = function () {
        var _this = this;
        document.addEventListener('client_changed', function (ev) {
            _this.handleClientChangeBase(ev.detail.clientId);
        }, false);
    };
    Widget.prototype.subscribeToGridEditingEvents = function () {
        var _this = this;
        document.addEventListener('grid_editing_started', function (ev) {
            _this.isGridInEditMode = true;
            _this.handleStartGridEditing(ev);
        }, false);
        document.addEventListener('grid_editing_finished', function (ev) {
            _this.handleFinishGridEditing(ev);
            _this.isGridInEditMode = false;
        }, false);
    };
    Widget.prototype.handleStartGridEditing = function (e) {
        console.log('grid started editing');
    };
    Widget.prototype.handleFinishGridEditing = function (e) {
        console.log('grid finished editing');
    };
    Widget.prototype.handleClientChangeBase = function (clientId) {
        this.currentClientId = clientId;
        this.handleClientChange(clientId);
    };
    Widget.prototype.showSpinner = function () {
        var spinner = this.cellElement.getElementsByClassName("widget-loading-container")[0];
        spinner.style.display = 'flex';
    };
    Widget.prototype.hideSpinner = function () {
        var spinner = this.cellElement.getElementsByClassName("widget-loading-container")[0];
        spinner.style.display = 'none';
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
        return widget;
    };
    Widget.prototype.enableRemoveIcon = function (el) {
        var icon = document.createElement("div");
        icon.setAttribute('class', 'widget-icon-delete');
        el.appendChild(icon);
    };
    Widget.prototype.enableEditIcon = function (el) {
        var _this = this;
        var icon = document.createElement("div");
        icon.setAttribute('class', 'widget-icon-edit');
        el.appendChild(icon);
        icon.addEventListener('click', function (ev) { return _this.renderForm(_this.widgetSettings); }, false);
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
        var title = document.createElement("strong");
        title.setAttribute("class", "widget-settings-title");
        title.innerText = this.config.title;
        widgetWrap.appendChild(title);
        var form = document.createElement('form');
        widgetWrap.appendChild(form);
        settings.forEach(function (inputEl) {
            switch (inputEl.inputType) {
                case 'radio':
                    renderInputCheck(inputEl);
                    break;
                case 'checkbox':
                    renderInputCheck(inputEl);
                    break;
                case 'select':
                    renderSelect(inputEl);
                    break;
                case 'inputText':
                    renderInputText(inputEl);
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
            e.preventDefault();
            var result = {};
            new FormData(form).forEach(function (value, key) {
                result[key] = value;
            });
            _this.applyNewSettings(result);
        });
        btnCancel.addEventListener("click", function (e) {
            var allSettings = document.getElementsByClassName('grid-item-popup');
            for (var i = 0; allSettings.length > i; i++) {
                allSettings[i].remove();
            }
        });
        function renderInputCheck(inputEl) {
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
                inputText.innerText = val.toString();
                input.setAttribute('name', name);
                input.setAttribute('type', type);
                input.setAttribute('value', val.toString());
                input.checked = val == inputEl.value;
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
                option.setAttribute('value', val.toString());
                option.innerText = val.toString();
                option.selected = val == inputEl.value;
                select.appendChild(option);
            });
        }
        function renderInputText(inputEl) {
            var name = inputEl.name, placeholder = inputEl.placeholder, titleHtml = document.createElement('strong'), inputWrap = document.createElement('div');
            titleHtml.setAttribute('class', 'settings-input-title');
            titleHtml.innerText = inputEl.title;
            inputWrap.setAttribute('class', 'settings-input-wrap');
            inputWrap.appendChild(titleHtml);
            form.appendChild(inputWrap);
            var input = document.createElement("input");
            input.setAttribute("name", name);
            if (typeof placeholder !== "undefined") {
                input.setAttribute("placeholder", placeholder);
            }
            inputWrap.appendChild(input);
        }
    };
    Widget.prototype.applyNewSettings = function (result) {
    };
    return Widget;
}());
function getValueOrDefault(value, defaultValue) {
    return value != null ? value : defaultValue;
}
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
var ClockWidget = (function (_super) {
    __extends(ClockWidget, _super);
    function ClockWidget(options, clientId) {
        var _this = this;
        var config = __assign({}, options, { isConfigurable: getValueOrDefault(options.isConfigurable, true), isResizable: getValueOrDefault(options.isResizable, true), isRemovable: getValueOrDefault(options.isRemovable, true), title: options.title || "Clock", minWidth: options.minWidth || 2, width: options.width || 6, height: options.height || 2, minHeight: options.minHeight || 2, isTimeDependant: true, withDate: getValueOrDefault(options.withDate, true), withDatePicker: getValueOrDefault(options.withDatePicker, true), dateFormat: getValueOrDefault(options.dateFormat, 12) });
        var widgetSettings = [
            {
                name: "dataType",
                inputType: "radio",
                title: "Choose data type",
                values: [12, 24],
                value: config.dateFormat
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
        _this = _super.call(this, config, clientId, widgetSettings) || this;
        return _this;
    }
    ClockWidget.prototype.init = function (element) {
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
    };
    ClockWidget.prototype.reDraw = function () {
        this.stopClock();
        this.clockElement.remove();
        this.clockElement = this.createClockElement(this.cellElement);
        this.startClock();
    };
    ClockWidget.prototype.applyNewSettings = function (result) {
        for (var key in result) {
            if (result.hasOwnProperty(key)) {
                switch (key) {
                    case 'dataType':
                        this.config.dateFormat = +result[key];
                        this.widgetSettings[0].value = this.config.dateFormat;
                        console.log("dateFormat -->", this.config.dateFormat);
                        break;
                    case 'dateTimezone':
                        this.config.dateTimezone = result[key];
                        this.widgetSettings[2].value = this.config.dateTimezone;
                        console.log("dateTimezone -->", result[key]);
                        break;
                    case 'testInputText':
                        console.log("testInputText -->", result[key]);
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
    };
    ClockWidget.prototype.handleDateChange = function (newDate, isToday) {
        console.log(newDate, isToday);
    };
    ClockWidget.prototype.handleClientChange = function (clientId) {
    };
    ClockWidget.prototype.createDateElement = function (element) {
        var _this = this;
        var dateElement = document.createElement('div');
        dateElement.className = "date";
        dateElement.innerText = this.getDateString();
        if (this.config.withDatePicker) {
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
            if (_this.config.withDate) {
                _this.dateElement.innerText = _this.getDateString();
            }
        }, 1000);
    };
    ClockWidget.prototype.getTimeString = function () {
        var options = {};
        if (typeof this.config.dateTimezone !== "undefined") {
            options.timeZone = this.config.dateTimezone;
        }
        if (this.config.dateFormat == 12) {
            options.hour12 = true;
        }
        else if (this.config.dateFormat == 24) {
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
    function ImageWidget(options, clientId) {
        var _this = this;
        var config = __assign({}, options, { isConfigurable: getValueOrDefault(options.isConfigurable, false), isResizable: getValueOrDefault(options.isResizable, true), isRemovable: getValueOrDefault(options.isRemovable, true), title: options.title || "Image", width: options.width || 2, height: options.height || 2, minHeight: 1, maxHeight: 3, minWidth: 1, maxWidth: 3, isTimeDependant: false, imageUrl: getValueOrDefault(options.imageUrl, 'http://tf-dev01.cloudapp.net/Content/images/s2-header-logo-techfinity.png') });
        _this = _super.call(this, config, clientId) || this;
        return _this;
    }
    ImageWidget.prototype.init = function (element) {
        this.hideSpinner();
        element.style.backgroundImage = "url('" + this.config.imageUrl + "')";
        element.style.backgroundRepeat = "no-repeat";
        element.style.backgroundSize = "cover";
    };
    ImageWidget.prototype.reDraw = function () { };
    ImageWidget.prototype.handleClientChange = function (clientId) { };
    ImageWidget.id = "imageWidget";
    return ImageWidget;
}(Widget));
var WorkCountByActivityAndStatusWidget = (function (_super) {
    __extends(WorkCountByActivityAndStatusWidget, _super);
    function WorkCountByActivityAndStatusWidget(options, clientId) {
        var _this = this;
        var config = __assign({}, options, { isConfigurable: getValueOrDefault(options.isConfigurable, false), isResizable: getValueOrDefault(options.isResizable, true), isRemovable: getValueOrDefault(options.isRemovable, true), title: options.title || "Work Counter", width: options.width || 2, height: options.height || 2, minHeight: 1, maxHeight: 3, minWidth: 1, maxWidth: 3, isTimeDependant: true });
        _this = _super.call(this, config, clientId) || this;
        _this.dataSource = new DataSource();
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
            _this.hideSpinner();
            _this.counterElement.innerText = data.toString();
        });
    };
    WorkCountByActivityAndStatusWidget.prototype.reDraw = function () {
        var _this = this;
        this.showSpinner();
        this.dataSource.getData()
            .then(function (data) {
            _this.hideSpinner();
            _this.counterElement.innerText = data.toString();
        });
    };
    WorkCountByActivityAndStatusWidget.prototype.handleClientChange = function (clientId) { };
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
    WorkCountByActivityAndStatusWidget.id = "workCountByActivityAndStatusWidget";
    return WorkCountByActivityAndStatusWidget;
}(Widget));
//# sourceMappingURL=script.js.map