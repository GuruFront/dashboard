/// <reference path="../Widget.ts" />
class ImageWidget extends Widget<IImageWidgetOptions> {
    public static readonly id: string = "imageWidget";

    public static sidebarSettings: ISideBarSettings = {
        title: 'Image',
        description: 'Image',
        category: 'General',
        icon: '',
        defaultWidth: 4,
        defaultHeight: 3,
        maxCount: Infinity,
    }; 

    constructor(clientId: number, options: IOptions<IImageWidgetOptions>) {

        const config: IWidgetConfiguration = {
            isConfigurable: false,
            isResizable: true,
            isRemovable: true,            
            minHeight: 1,
            maxHeight: 3,
            minWidth: 1,
            maxWidth: 3,
            isTimeDependant: false,
        };

        super(config, clientId, options);
    }

    protected init(element: HTMLElement) {
        this.hideSpinner();
        element.style.backgroundImage = "url('" + (this.options.imageUrl || 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png') + "')";
        element.style.backgroundRepeat = "no-repeat";
        element.style.backgroundSize = "cover";
        // const imageElement = document.createElement('img');
        // imageElement.src = this.imageUrl;
        // element.appendChild(imageElement);
    }

    protected reDraw() { }

    protected handleClientChange(clientId: number) { }
}

interface IImageWidgetOptions {
    imageUrl: string;
}