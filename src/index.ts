export default class Subject {
  private _paused: boolean = false;
  private _cancelled: boolean = false;
  private _onCompCb?: CallableFunction;
  private _subscribers: Array<[Function, Function | undefined] | []> = [];

  public subscribe(observer: CallableFunction, err?: CallableFunction) {
    this._subscribers.push([observer, err]);
    const lastIndex = this._subscribers.length - 1;
    const unsubscribe = () => (this._subscribers[lastIndex] = []);
    return {
      unsubscribe,
    };
  }

  public async notify(data: any): Promise<any | undefined> {
    if (this._paused === true) {
      return;
    }

    let handlers;
    let index = 0;

    if (this._cancelled === true) {
      this._cancelled = false;
      return;
    }

    const stack: Array<Promise<any>> = [];

    startLabel: while ((handlers = this._subscribers[index])) {
      index++;

      const [success, error] = handlers;

      if (!success) {
        continue startLabel;
      }

      const promise = new Promise(resolve => resolve(data));
      const process = promise.then(data => success(data)).catch(e => error && error(e));
      stack.push(process);
    }

    return Promise.all(stack).then(() => this._onCompCb && this._onCompCb());
  }

  public pause = () => (this._paused = true);
  public resume = () => (this._paused = false);
  public cancel = () => (this._cancelled = true);
  public reset = () => {
    this._subscribers = [];
    this._onCompCb = undefined;
  };
  public size = () => this._subscribers.filter(sub => sub.length > 0).length;
  public onCompleted = (cb: CallableFunction) => (this._onCompCb = cb);
}
