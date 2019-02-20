/// <reference path="../Widget.ts" />
class ImageWidget extends Widget<IImageWidgetOptions> {
    public static readonly id: string = "imageWidget";

    public static sidebarSettings: ISideBarSettings = {
        title: 'Image',
        description: 'Image widget. Removable. Not configurable. Resizable. Not movable. 4*3. Not limited.',
        category: 'General',
        icon: 'fas fa-image',
        defaultWidth: 4,
        defaultHeight: 3,
        maxCount: Infinity,
        isResizable: true,
        isMovable: true
    };

    constructor(clientId: number, options: IOptions<IImageWidgetOptions>) {
        const config: IWidgetConfiguration = {
            isConfigurable: true,
            isRemovable: true,
            minHeight: 1,
            // maxHeight: 4,
            minWidth: 1,
            // maxWidth: 4,
            isTimeDependant: false,
            isAllowFullScreenMode: true
        };

        const widgetSettings = [
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
                // values: ["fill", "contain", "cover", "scale-down", "none"],
                value: options.options.imageUrl || 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
            }
        ];

        super(config, clientId, options, widgetSettings);
    }

    protected applyNewSettings(result: object) {
        for (let key in result) {
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
    }

    protected init(element: HTMLElement) {
        this.hideSpinner();
        element.classList.add("imageWidget");

        let $img = document.createElement('img');
        $img.setAttribute("src", (this.options.imageUrl || 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'))
        $img.setAttribute("alt", this.sidebarSettings.title);
        $img.setAttribute("class", "gs-widget-img");
        $img.style.objectFit = this.options.fit || "contain";
        element.appendChild($img);
    }

    protected reDraw() {
        [].slice.call(this.cellElement.childNodes).forEach((item) => {
            if (item.classList.contains("gs-widget-img")) {
                item.style.objectFit = this.options.fit;
                item.setAttribute("src", this.options.imageUrl)
            }
        })
    }

    protected handleResize() {
        console.log('Image');
    }

    protected handleClientChange(clientId: number) {
    }
}

interface IImageWidgetOptions {
    imageUrl: string;
    fit: string;
}

