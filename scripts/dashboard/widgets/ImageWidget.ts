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
        isMovable: true,
    };

    constructor(clientId: number, options: IOptions<IImageWidgetOptions>) {
        const config: IWidgetConfiguration = {
            isConfigurable: false,
            isRemovable: true,
            minHeight: 1,
            maxHeight: 4,
            minWidth: 1,
            maxWidth: 4,
            isTimeDependant: false,
        };

        super(config, clientId, options);
    }

    protected init(element: HTMLElement) {
        this.hideSpinner();
        element.classList.add("image-widget");

        let $img = document.createElement('img');
        $img.setAttribute("src", (this.options.imageUrl || 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'))
        $img.setAttribute("alt", this.sidebarSettings.title);
        $img.style.objectFit = this.options.fit || "contain";

        element.appendChild($img);
    }

    protected reDraw() { }
    protected handleResize() {
        console.log('Image');
    }
    protected handleClientChange(clientId: number) { }
}

interface IImageWidgetOptions {
    imageUrl: string;
    fit: string;
}