class DataSource {
    protected _data: any;

    public getData(from: Date, to: Date, fromServer = false): Promise<object> {
        if (this._data && !fromServer) {
            return new Promise((res, rej) => {
                res(this._data);
            });
        }
        else {
            return new Promise((res, rej) => {
                setTimeout(() => {
                    this._data = (Math.random() * 100).toFixed(0);
                    res(this._data);
                }, 5000);
            });
        }
    }
}