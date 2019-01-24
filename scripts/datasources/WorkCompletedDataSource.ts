/// <reference path="../DataSource.ts" />
class WorkCompletedDataSource extends DataSource {
    public static readonly id = "workCompletedDataSource";

    private readonly _url = '/transportdashboard/GetWorkCompleted';

    private readonly _params: { [param: string]: any } = {
        test: 12
    };

    public getData(from?: Date, to?: Date, fromServer = false): Promise<object> {
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
            // let params = Object.assign({
            //     from: from || '',
            //     to: to || ''
            // }, this._params);

            // let url = this._url + '?'

            // for (var name in params) {
            //     url += name + '=' + params[name] + '&';
            // }
            // console.log(url);

            // return fetch(url, { method: 'get' })
            //     .then(response => response.json())
            //     //.then(jsonData => console.log(jsonData))
            //     .catch(err => {
            //         console.error(err);
            //         //error block
            //     });
        }
    }
}