var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
    function Widget(config, clientId, options, widgetSettings) {
        this.config = config;
        this.options = options.options;
        this.size = {
            width: options.width,
            height: options.height,
        };
        this.position = {
            x: options.x,
            y: options.y,
        };
        this.uid = (Math.random() * 10000).toFixed(0);
        this.currentClientId = clientId;
        this.widgetSettings = widgetSettings || [];
        this.id = this.constructor['id'];
        this.sidebarSettings = this.constructor['sidebarSettings'];
    }
    Widget.prototype.initBase = function (element) {
        this.cellElement = element;
        this.cellElement.setAttribute('data-uid', this.uid);
        this.isDisplayed = true;
        if (this.config.isConfigurable && this.widgetSettings) {
            this.enableEditIcon(element);
        }
        if (this.config.isRemovable) {
            this.enableRemoveIcon(element);
        }
        if (this.config.isAllowFullScreenMode) {
            this.enableFullScreenMode(element);
        }
        this.subscribeToDateChangedEvent();
        this.subscribeToClientChangedEvent();
        this.subscribeToGridEditingEvents();
        this.subscribeToResizeEvent();
        this.init(element);
    };
    Widget.prototype.destroy = function () {
        this.isDisplayed = false;
    };
    Widget.prototype.subscribeToResizeEvent = function () {
        var _this = this;
        this.cellElement.addEventListener('resize_stopped', function (ev) {
            console.log('Base class');
            _this.handleResize();
        });
    };
    Widget.prototype.handleResize = function () { };
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
    Widget.widgetInitializer = function (id, clientId, options) {
        options.options = options.options || {};
        switch (id) {
            case ImageWidget.id:
                return new ImageWidget(clientId, options);
            case ClockWidget.id:
                return new ClockWidget(clientId, options);
            case WorkCountByActivityAndStatusWidget.id:
                return new WorkCountByActivityAndStatusWidget(clientId, options);
            default:
                return null;
        }
    };
    Widget.getSidebarSettings = function (id) {
        switch (id) {
            case ImageWidget.id:
                return ImageWidget.sidebarSettings;
            case ClockWidget.id:
                return ClockWidget.sidebarSettings;
            case WorkCountByActivityAndStatusWidget.id:
                return WorkCountByActivityAndStatusWidget.sidebarSettings;
            default:
                return null;
        }
    };
    Widget.prototype.enableRemoveIcon = function (el) {
        var icon = document.createElement("div");
        icon.setAttribute('class', 'widget-icon-delete');
        el.appendChild(icon);
    };
    Widget.prototype.enableFullScreenMode = function (el) {
        var icon = document.createElement("div");
        icon.setAttribute('class', 'widget-icon-fullScreen');
        el.appendChild(icon);
    };
    Widget.prototype.enableEditIcon = function (el) {
        var _this = this;
        var icon = document.createElement("div");
        icon.setAttribute('class', 'widget-icon-edit');
        el.appendChild(icon);
        icon.addEventListener('click', function (ev) { return _this.renderForm(); }, false);
    };
    Widget.prototype.handleDisplayPopup = function (show) {
        var popup = document.getElementById("widget-popup"), popupContainer = document.getElementById("widget-popup-container");
        if (popup && popupContainer) {
            while (popupContainer.firstChild) {
                popupContainer.removeChild(popupContainer.firstChild);
            }
            if (show) {
                popup.style.display = "flex";
                return popupContainer;
            }
            else {
                popup.style.display = "none";
            }
        }
    };
    Widget.prototype.renderForm = function () {
        var _this = this;
        var popupContainer = this.handleDisplayPopup(true), widgetWrap = document.createElement('div');
        widgetWrap.setAttribute("class", "widget-settings-wrap");
        popupContainer.appendChild(widgetWrap);
        var title = document.createElement("strong");
        title.setAttribute("class", "widget-settings-title");
        title.innerText = this.sidebarSettings.title;
        widgetWrap.appendChild(title);
        var form = document.createElement('form');
        form.setAttribute("action", ".");
        widgetWrap.appendChild(form);
        this.widgetSettings.forEach(function (inputEl) {
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
                    renderInput(inputEl, "text");
                    break;
                case 'inputNumber':
                    renderInput(inputEl, "number");
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
        btnSave.setAttribute("id", "submitConfigBtn");
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
            console.log(result);
            _this.applyNewSettings(result);
        });
        btnCancel.addEventListener("click", function () {
            _this.handleDisplayPopup(false);
        });
        function renderInputCheck(inputEl) {
            var values = inputEl.values, type = inputEl.inputType, name = inputEl.name, titleHtml = document.createElement('strong'), inputWrap = document.createElement('div');
            titleHtml.setAttribute('class', 'settings-input-title');
            titleHtml.innerText = inputEl.title;
            inputWrap.setAttribute('class', 'settings-input-wrap');
            inputWrap.appendChild(titleHtml);
            form.appendChild(inputWrap);
            values.forEach(function (val) {
                var label = document.createElement('label'), input = document.createElement('input'), inputText = document.createElement('span'), checkmark = document.createElement('span');
                label.setAttribute("class", "settings-label");
                label.setAttribute("class", "checkbox-wrap");
                checkmark.setAttribute("class", "checkmark");
                inputText.setAttribute("class", "settings-input-text");
                inputText.innerText = val.toString();
                input.setAttribute('name', name);
                input.setAttribute('type', type);
                input.setAttribute('value', val.toString());
                input.checked = val == inputEl.value;
                label.appendChild(input);
                label.appendChild(checkmark);
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
        function renderInput(inputEl, type) {
            var name = inputEl.name, placeholder = inputEl.placeholder, titleHtml = document.createElement('strong'), inputWrap = document.createElement('div');
            titleHtml.setAttribute('class', 'settings-input-title');
            titleHtml.innerText = inputEl.title;
            inputWrap.setAttribute('class', 'settings-input-wrap');
            inputWrap.appendChild(titleHtml);
            form.appendChild(inputWrap);
            var input = document.createElement("input");
            input.setAttribute("name", name);
            input.setAttribute("type", type);
            if (inputEl.value) {
                input.setAttribute('value', inputEl.value.toString());
            }
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
    function ClockWidget(clientId, options) {
        var _this = this;
        var config = {
            isRemovable: true,
            isConfigurable: true,
            minWidth: 1,
            minHeight: 1,
            isTimeDependant: true,
            maxInstanceCount: 1,
            isAllowFullScreenMode: true
        };
        var widgetSettings = [
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
        _this = _super.call(this, config, clientId, options, widgetSettings) || this;
        return _this;
    }
    ClockWidget.prototype.handleResize = function () {
        console.log('Clock');
    };
    ClockWidget.prototype.init = function (element) {
        element.classList.add("clockWidget");
        this.hideSpinner();
        this.dateElement = this.createDateElement(element);
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
                    case 'dateFormat':
                        this.options.dateFormat = +result[key];
                        this.widgetSettings[0].value = this.options.dateFormat;
                        console.log("dateFormat -->", this.options.dateFormat);
                        break;
                    case 'dateTimezone':
                        this.options.dateTimezone = result[key];
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
    };
    ClockWidget.prototype.handleDateChange = function (newDate, isToday) {
        console.log(newDate, isToday);
    };
    ClockWidget.prototype.handleClientChange = function (clientId) {
    };
    ClockWidget.prototype.createDateElement = function (element) {
        var dateElement = document.createElement('div');
        dateElement.className = "date";
        dateElement.innerText = this.getDateString();
        element.appendChild(dateElement);
        return dateElement;
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
            _this.dateElement.innerText = _this.getDateString();
        }, 1000);
    };
    ClockWidget.prototype.getTimeString = function () {
        var options = {};
        if (typeof this.options.dateTimezone !== "undefined") {
            options.timeZone = this.options.dateTimezone;
        }
        if (this.options.dateFormat == 12) {
            options.hour12 = true;
        }
        else if (this.options.dateFormat == 24) {
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
    ClockWidget.sidebarSettings = {
        title: 'Clock',
        description: 'Clock widget. Not removable. Configurable. Not resizable. Movable. 4*2. Single instance',
        category: 'General',
        icon: 'fas fa-clock',
        defaultWidth: 2,
        defaultHeight: 2,
        maxCount: 1,
        isResizable: true,
        isMovable: true,
        isRatioScale: true,
        isConfigurable: true
    };
    return ClockWidget;
}(Widget));
var ImageWidget = (function (_super) {
    __extends(ImageWidget, _super);
    function ImageWidget(clientId, options) {
        var _this = this;
        var config = {
            isConfigurable: true,
            isRemovable: true,
            minHeight: 1,
            minWidth: 1,
            isTimeDependant: false,
            isAllowFullScreenMode: true
        };
        var widgetSettings = [
            {
                name: "fit",
                inputType: "select",
                title: "Scaling option",
                values: ["fill", "contain", "cover", "scale-down", "none"],
                value: options.options.fit || "contain"
            },
            {
                name: "imageUrl",
                inputType: "inputText",
                title: "src",
                value: options.options.imageUrl || 'http://tf-dev01.cloudapp.net/Content/images/dashboard/techfinity-v.png'
            }
        ];
        _this = _super.call(this, config, clientId, options, widgetSettings) || this;
        return _this;
    }
    ImageWidget.prototype.applyNewSettings = function (result) {
        for (var key in result) {
            if (result.hasOwnProperty(key)) {
                switch (key) {
                    case 'fit':
                        this.options.fit = result[key];
                        this.widgetSettings[0].value = this.options.fit;
                        console.log("objectFit -->", this.options.fit);
                        break;
                    case 'imageUrl':
                        this.options.imageUrl = result[key];
                        this.widgetSettings[1].value = this.options.imageUrl;
                        console.log("imageUrl -->", this.options.imageUrl);
                        break;
                    default:
                        console.log("Unknown data from form");
                        break;
                }
            }
        }
        this.reDraw();
    };
    ImageWidget.prototype.init = function (element) {
        this.hideSpinner();
        element.classList.add("imageWidget");
        var $img = document.createElement('img');
        $img.setAttribute("src", (this.options.imageUrl || 'http://tf-dev01.cloudapp.net/Content/images/dashboard/techfinity-v.png'));
        $img.setAttribute("alt", this.sidebarSettings.title);
        $img.setAttribute("class", "gs-widget-img");
        $img.style.objectFit = this.options.fit || "contain";
        element.appendChild($img);
    };
    ImageWidget.prototype.reDraw = function () {
        var _this = this;
        [].slice.call(this.cellElement.childNodes).forEach(function (item) {
            if (item.classList.contains("gs-widget-img")) {
                item.style.objectFit = _this.options.fit;
                item.setAttribute("src", _this.options.imageUrl);
            }
        });
    };
    ImageWidget.prototype.handleResize = function () {
        console.log('Image');
    };
    ImageWidget.prototype.handleClientChange = function (clientId) {
    };
    ImageWidget.id = "imageWidget";
    ImageWidget.sidebarSettings = {
        title: 'Image',
        description: 'Image widget. Removable. Not configurable. Resizable. Not movable. 4*3. Not limited.',
        category: 'General',
        icon: 'fas fa-image',
        defaultWidth: 4,
        defaultHeight: 3,
        maxCount: Infinity,
        isResizable: true,
        isMovable: true,
        isConfigurable: true
    };
    return ImageWidget;
}(Widget));
var WorkCountByActivityAndStatusWidget = (function (_super) {
    __extends(WorkCountByActivityAndStatusWidget, _super);
    function WorkCountByActivityAndStatusWidget(clientId, options) {
        var _this = this;
        var config = {
            isConfigurable: false,
            isRemovable: true,
            minWidth: 2,
            minHeight: 2,
            maxWidth: 5,
            maxHeight: 5,
            isTimeDependant: true,
            maxInstanceCount: 2,
        };
        _this = _super.call(this, config, clientId, options) || this;
        _this.dataSource = new DataSource();
        return _this;
    }
    WorkCountByActivityAndStatusWidget.prototype.init = function (element) {
        var _this = this;
        element.classList.add("workCountByActivityAndStatusWidget");
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
    WorkCountByActivityAndStatusWidget.prototype.handleResize = function () {
        console.log('Count');
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
    WorkCountByActivityAndStatusWidget.prototype.handleClientChange = function (clientId) {
    };
    WorkCountByActivityAndStatusWidget.prototype.createTitleElement = function (element) {
        var p = document.createElement('div');
        p.className = 'title';
        p.innerText = WorkCountByActivityAndStatusWidget.sidebarSettings.title;
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
    WorkCountByActivityAndStatusWidget.sidebarSettings = {
        title: 'Work Counter',
        description: 'Work Counter widget. Removable. Not configurable. Resizable. Movable. 2*2. 2 instances max',
        category: 'Work',
        icon: 'fas fa-info-circle',
        defaultWidth: 2,
        defaultHeight: 2,
        maxCount: 2,
        isResizable: true,
        isMovable: true,
    };
    return WorkCountByActivityAndStatusWidget;
}(Widget));
//# sourceMappingURL=main.js.map