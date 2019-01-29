/// <reference path="../Widget.ts" />
class ImageWidget extends Widget<IImageWidgetConfiguration> {
    public static readonly id = "imageWidget";

    constructor(options: IImageWidgetConfiguration, clientId: number) {

        const config: IImageWidgetConfiguration = {
            ...options, // copy all other properties 
            isConfigurable: getValueOrDefault(options.isConfigurable, false),
            isResizable: getValueOrDefault(options.isResizable, true),
            isRemovable: getValueOrDefault(options.isRemovable, true),
            title: options.title || "Image",
            width: options.width || 2,
            height: options.height || 2,
            minHeight: 1,
            maxHeight: 3,
            minWidth: 1,
            maxWidth: 3,
            isTimeDependant: false,
            imageUrl: getValueOrDefault(options.imageUrl, 'http://tf-dev01.cloudapp.net/Content/images/s2-header-logo-techfinity.png')
        };

        super(config, clientId);
    }

    protected init(element: HTMLElement) {
        this.hideSpinner();
        element.style.backgroundImage = "url('" + this.config.imageUrl + "')";
        element.style.backgroundRepeat = "no-repeat";
        element.style.backgroundSize = "cover";
        // const imageElement = document.createElement('img');
        // imageElement.src = this.imageUrl;
        // element.appendChild(imageElement);
    }

    protected reDraw() { }

    protected handleClientChange(clientId: number) { }
}

interface IImageWidgetConfiguration extends IWidgetConfiguration {
    imageUrl?: string;
}