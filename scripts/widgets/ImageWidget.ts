/// <reference path="../Widget.ts" />
class ImageWidget extends Widget {
    public static readonly id = "imageWidget";

    private readonly imageUrl: string;

    init(element: HTMLInputElement) {
        this.hideSpinner(element);
        element.style.backgroundImage = "url('" + this.imageUrl + "')";
        element.style.backgroundRepeat = "no-repeat";
        element.style.backgroundSize = "cover";
        // const imageElement = document.createElement('img');
        // imageElement.src = this.imageUrl;
        // element.appendChild(imageElement);
    }

    constructor(options: IImageWidgetOptions) {

        const config: IWidgetConfiguration = {
            isConfigurable: options.isConfigurable != null ? options.isConfigurable : false,
            isResizable: options.isResizable != null ? options.isResizable : true,
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

        super(config);

        this.imageUrl = options.imageUrl || 'http://tf-dev01.cloudapp.net/Content/images/s2-header-logo-techfinity.png';
    }
}

interface IImageWidgetOptions extends IWidgetOptions {
    imageUrl?: string;
}