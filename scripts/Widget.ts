/**
 * TConfiguration is a type of configuration settings(must be derived from IWidgetConfiguration).
 * So each widget has all properties from IWidgetConfiguration and might have it's own additional 
 * properties which also available via this.config
 * */
abstract class Widget<TOptions> {
    public id: string;
    public readonly uid: string;

    public readonly size: ISizeOptions;
    public readonly position: IPositionOptions;
    public readonly options: TOptions;

    public readonly config: IWidgetConfiguration;

    protected cellElement: HTMLElement;

    public isInEditMode: boolean;

    protected isGridInEditMode: boolean;

    protected isDisplayed: boolean;

    protected currentClientId: number;

    protected readonly widgetSettings: IWidgetEditSettings[];

    protected constructor(config: IWidgetConfiguration, clientId: number, options?: IOptions<TOptions>, widgetSettings?: IWidgetEditSettings[]) {
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
        // TODO: change to real uid
        this.uid = (Math.random()* 10000).toFixed(0);
        
        this.currentClientId = clientId;
        this.widgetSettings = widgetSettings || [];
    }

    protected abstract init(element: HTMLElement);

    protected abstract reDraw();

    protected abstract handleClientChange(clientId: number);


    public initBase(element: HTMLElement) {
        this.cellElement = element;
        this.cellElement.setAttribute('data-uid', this.uid);
        this.isDisplayed = true;

        if (this.config.isConfigurable && this.widgetSettings) {
            this.enableEditIcon(element);
        }

        if (this.config.isRemovable) {
            this.enableRemoveIcon(element);
        }

        this.subscribeToDateChangedEvent();
        this.subscribeToClientChangedEvent();
        this.subscribeToGridEditingEvents();

        this.init(element);
    }

    protected destroy() {
        this.isDisplayed = false;
        // TODO: Unsubscribe from events
    }

    private subscribeToDateChangedEvent() {
        if (this.config.isTimeDependant) {
            document.addEventListener('date_changed', (ev: CustomEvent) => {
                const newDate = ev.detail.date as Date;
                const idToday = ev.detail.isToday as boolean;
                this.handleDateChange(newDate, idToday);
            }, false);
        }
    }

    protected handleDateChange(newDate: Date, isToday: boolean) { }

    private subscribeToClientChangedEvent() {
        document.addEventListener('client_changed', (ev: CustomEvent) => {
            this.handleClientChangeBase(ev.detail.clientId);
        }, false);
    }

    private subscribeToGridEditingEvents() {
        document.addEventListener('grid_editing_started', (ev: CustomEvent) => {
            this.isGridInEditMode = true;
            this.handleStartGridEditing(ev);
        }, false);

        document.addEventListener('grid_editing_finished', (ev: CustomEvent) => {
            this.handleFinishGridEditing(ev);
            this.isGridInEditMode = false;
        }, false);
    }

    protected handleStartGridEditing(e: CustomEvent) {
        console.log('grid started editing');
    }

    protected handleFinishGridEditing(e: CustomEvent) {
        console.log('grid finished editing');
    }

    protected handleClientChangeBase(clientId: number) {
        this.currentClientId = clientId;
        this.handleClientChange(clientId);
    }

    protected showSpinner() {
        const spinner = this.cellElement.getElementsByClassName("widget-loading-container")[0] as HTMLElement;
        spinner.style.display = 'flex';
    }

    protected hideSpinner() {
        const spinner = this.cellElement.getElementsByClassName("widget-loading-container")[0] as HTMLElement;
        spinner.style.display = 'none';
    }

    static widgetInitializer(id: string, clientId: number, options) {
        options.options = {};
        let widget;
        switch (id) {
            case ImageWidget.id:
                widget = new ImageWidget(clientId, options);
                break;
            case ClockWidget.id:
                widget = new ClockWidget(clientId, options);
                break;
            case WorkCountByActivityAndStatusWidget.id:
                widget = new WorkCountByActivityAndStatusWidget(clientId, options);
                break;
            default:
                return null;
        }

        widget.id = id;

        return widget;
    }

    static sidebarSettings: ISideBarSettings;

    static getSidebarSettings(id: string) {
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
    }

    private enableRemoveIcon(el: HTMLElement): void {
        let icon: HTMLElement = document.createElement("div");
        icon.setAttribute('class', 'widget-icon-delete');
        el.appendChild(icon);
    }

    private enableEditIcon(el: HTMLElement): void {
        let icon: HTMLElement = document.createElement("div");
        icon.setAttribute('class', 'widget-icon-edit');
        el.appendChild(icon);

        icon.addEventListener('click', ev => this.renderForm(this.widgetSettings), false);
    }

    // TODO: maybe it's better to just show/hide panle section instead of creating/destroying it?
    protected openWidgetSettings(): HTMLElement {
        let
            body: HTMLElement = document.getElementsByTagName('body')[0],
            popupDiv: HTMLElement = document.createElement('div'),
            container: HTMLElement = document.createElement('div');

        popupDiv.setAttribute("class", "grid-item-popup");
        container.setAttribute("class", "grid-item-popup__container");
        popupDiv.appendChild(container);

        body.appendChild(popupDiv);
        return container;
    }

    protected renderForm(settings: IWidgetEditSettings[]) {
        let
            popupContainer: HTMLElement = this.openWidgetSettings(),
            widgetWrap: HTMLElement = document.createElement('div');

        widgetWrap.setAttribute("class", "widget-settings-wrap");
        popupContainer.appendChild(widgetWrap);

        let title = document.createElement("strong");
        title.setAttribute("class", "widget-settings-title");
        title.innerText = Widget.sidebarSettings.title;
        widgetWrap.appendChild(title);

        let form = document.createElement('form');
        //form.setAttribute("action", "console.log(data)");
        //form.setAttribute("method", 'POST');
        widgetWrap.appendChild(form);

        // define input type and call render function
        settings.forEach((inputEl) => {
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

        let formButtonsWrap: HTMLElement = document.createElement('div');
        formButtonsWrap.setAttribute("class", "settings-form-btns");

        let
            btnSave: HTMLElement = document.createElement('button'),
            btnCancel: HTMLElement = document.createElement('button');

        btnSave.setAttribute("type", "submit");
        btnSave.innerText = "Apply";
        btnCancel.setAttribute("type", "button");
        btnCancel.innerText = "Cancel";

        formButtonsWrap.appendChild(btnSave);
        formButtonsWrap.appendChild(btnCancel);
        form.appendChild(formButtonsWrap);

        // Get new widget settings
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let result = {};
            new FormData(form).forEach((value, key) => {
                result[key] = value;
            });

            this.applyNewSettings(result);
        });

        // Cancel/Remove Popup
        btnCancel.addEventListener("click", (e) => {
            let allSettings = document.getElementsByClassName('grid-item-popup');
            for (let i = 0; allSettings.length > i; i++) {
                allSettings[i].remove();
            }
        });

        // render input radio
        function renderInputCheck(inputEl: IWidgetEditSettings) {
            let
                values: Array<string | number> = inputEl.values,
                type: string = inputEl.inputType,
                name: string = inputEl.name,
                titleHtml: HTMLElement = document.createElement('strong'),
                inputWrap = document.createElement('div');

            titleHtml.setAttribute('class', 'settings-input-title');
            titleHtml.innerText = inputEl.title;

            inputWrap.setAttribute('class', 'settings-input-wrap');
            inputWrap.appendChild(titleHtml);
            form.appendChild(inputWrap);

            values.forEach((val: string | number) => {
                let label = document.createElement('label'),
                    input = document.createElement('input'),
                    inputText = document.createElement('span');

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

        // render select
        function renderSelect(inputEl: IWidgetEditSettings) {
            let
                values: Array<string | number> = inputEl.values,
                name: string = inputEl.name,
                titleHtml: HTMLElement = document.createElement('strong'),
                inputWrap = document.createElement('div');

            titleHtml.setAttribute('class', 'settings-input-title');
            titleHtml.innerText = inputEl.title;

            inputWrap.setAttribute('class', 'settings-input-wrap');
            inputWrap.appendChild(titleHtml);
            form.appendChild(inputWrap);

            let select = document.createElement('select');
            select.setAttribute("name", name);
            inputWrap.appendChild(select);

            values.forEach((val: string | number) => {
                let option = document.createElement("option");
                option.setAttribute('value', val.toString());
                option.innerText = val.toString();
                option.selected = val == inputEl.value;
                select.appendChild(option);
            });
        }

        // render input text
        function renderInputText(inputEl: IWidgetEditSettings) {
            let
                name: string = inputEl.name,
                placeholder: string = inputEl.placeholder,
                titleHtml: HTMLElement = document.createElement('strong'),
                inputWrap = document.createElement('div');

            titleHtml.setAttribute('class', 'settings-input-title');
            titleHtml.innerText = inputEl.title;

            inputWrap.setAttribute('class', 'settings-input-wrap');
            inputWrap.appendChild(titleHtml);
            form.appendChild(inputWrap);

            let input = document.createElement("input");
            input.setAttribute("name", name);
            if (typeof placeholder !== "undefined") {
                input.setAttribute("placeholder", placeholder);
            }
            inputWrap.appendChild(input);
        }
    }

    protected applyNewSettings(result: object) {

    }
}

function getValueOrDefault<T>(value: T, defaultValue: T) {
    return value != null ? value : defaultValue;
}
