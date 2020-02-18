export default class Subject {
  private paused: boolean = false;
  private cancelled: boolean = false;
  private onCompCb?: CallableFunction;
  private subscribers: Array<[CallableFunction, CallableFunction | undefined] | []> = [];

  public subscribe(observer: CallableFunction, err?: CallableFunction) {
    this.subscribers.push([observer, err]);
    const lastIndex = this.subscribers.length - 1;
    const unsubscribe = () => (this.subscribers[lastIndex] = []);
    return {
      unsubscribe,
    };
  }

  public async notify(parameter?: any): Promise<any | undefined> {
    if (this.paused === true) {
      return;
    }

    let index = 0;

    if (this.cancelled === true) {
      this.cancelled = false;
      return;
    }

    const stack: Array<Promise<any>> = [];

    startLabel: while (this.subscribers[index]) {
      const [success, error] = this.subscribers[index];
      index++;

      if (!success) {
        continue startLabel;
      }

      const promise = new Promise(resolve => resolve(parameter));
      const process = promise.then(data => success(data)).catch(e => error && error(e));
      stack.push(process);
    }

    return Promise.all(stack).then(() => this.onCompCb && this.onCompCb());
  }

  public pause = () => (this.paused = true);
  public resume = () => (this.paused = false);
  public cancel = () => (this.cancelled = true);
  public reset = () => {
    this.subscribers = [];
    this.onCompCb = undefined;
  };
  public size = () => this.subscribers.filter(sub => sub.length > 0).length;
  public onCompleted = (cb: CallableFunction) => (this.onCompCb = cb);
}
