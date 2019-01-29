/**
 * TConfiguration is a type of configuration settings(must be derived from IWidgetConfiguration).
 * So each widget has all properties from IWidgetConfiguration and might have it's own additional 
 * properties which also available via this.config
 * */
abstract class Widget<TConfiguration extends IWidgetConfiguration> {
    public readonly id: number;
    public readonly config: TConfiguration;

    protected cellElement: HTMLElement;

    public isInEditMode: boolean;

    protected isGridInEditMode: boolean;

    protected isDisplayed: boolean;

    protected currentClientId: number;

    protected readonly widgetSettings: IWidgetEditSettings[];


    protected constructor(config: TConfiguration, clientId: number, widgetSettings?: IWidgetEditSettings[]) {
        this.config = config;
        this.id = Math.random();
        this.currentClientId = clientId;
        this.widgetSettings = widgetSettings || [];

        this.subscribeToDateChangedEvent();
        this.subscribeToClientChangedEvent();
        this.subscribeToGridEditingEvents();
    }


    protected abstract init(element: HTMLElement);

    protected abstract reDraw();

    protected abstract handleClientChange(clientId: number);


    public initBase(element: HTMLElement) {
        this.cellElement = element;
        this.isDisplayed = true;

        if (this.config.isConfigurable && this.widgetSettings) {
            this.enableEditIcon(element);
        }

        if (this.config.isRemovable) {
            this.enableRemoveIcon(element);
        }
        this.init(element);
    }

    protected destroy() {
        this.isDisplayed = false;
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

    static widgetInitializer(options: IWidgetConfiguration) {
        let widget: Widget<IWidgetConfiguration>;

        switch (options.id) {
            case ImageWidget.id:
                widget = new ImageWidget(options);
                break;
            case ClockWidget.id:
                widget = new ClockWidget(options);
                break;
            case WorkCountByActivityAndStatusWidget.id:
                widget = new WorkCountByActivityAndStatusWidget(options as IWorkCountByActivityAndStatusWidgetConfiguration);
                break;
            default:
                return null;
        }

        return widget;
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

        let form = document.createElement('form') as HTMLFormElement;
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
