import Subject from '../src/index';

describe('Subject tests', () => {
  const subject = new Subject();

  afterEach(() => {
    subject.reset();
  });

  test('notify observers asynchronously', done => {
    const observer1 = jest.fn();
    const observer2 = jest.fn();
    subject.subscribe(observer1);
    subject.subscribe(observer2);
    subject.notify('hello world!');

    setTimeout(() => {
      expect(observer1).toHaveBeenCalledWith('hello world!');
      expect(observer2).toHaveBeenCalledWith('hello world!');
      done();
    }, 10);
  });

  test('subscribe/unsubscribe', done => {
    const observer1 = jest.fn();
    const observer2 = jest.fn();
    subject.subscribe(observer1);
    const sub$ = subject.subscribe(observer2);

    subject.notify('hello world!');

    setTimeout(() => {
      expect(observer1).toHaveBeenCalledWith('hello world!');
      expect(observer2).toHaveBeenCalledWith('hello world!');
    }, 10);

    setTimeout(() => {
      sub$.unsubscribe();
      subject.notify('hello world!');
    }, 20);

    setTimeout(() => {
      expect(observer1.mock.calls.length).toEqual(2);
      expect(observer2.mock.calls.length).toEqual(1);
      done();
    }, 30);
  });

  test('catch any errors when run an observer', done => {
    const errorHandler = jest.fn();
    const copletedHandler = jest.fn();

    subject.onCompleted(copletedHandler);
    subject.subscribe(() => {
      throw 'Something went wrong';
    }, errorHandler);

    subject.notify();

    setTimeout(() => {
      expect(errorHandler).toHaveBeenCalledWith('Something went wrong');
      expect(copletedHandler).toHaveBeenCalled();
      done();
    }, 100);
  });

  test('pause/resume all observers', done => {
    const observer1 = jest.fn();
    const observer2 = jest.fn();
    subject.subscribe(observer1);
    subject.subscribe(observer2);

    subject.pause();
    subject.notify('hello world!');

    expect(observer1).not.toHaveBeenCalled();
    expect(observer2).not.toHaveBeenCalledWith();

    subject.resume();
    subject.notify('hello world!');

    setTimeout(() => {
      expect(observer1).toHaveBeenCalledWith('hello world!');
      expect(observer2).toHaveBeenCalledWith('hello world!');
      done();
    }, 10);
  });

  test('cancel all observers not yet run', done => {
    const observer1 = jest.fn();
    const observer2 = jest.fn();
    subject.subscribe(observer1);

    setTimeout(() => {
      subject.subscribe(observer2);
    }, 200);

    subject.notify('hello world!');

    setTimeout(() => {
      subject.cancel();
    }, 210);

    setTimeout(() => {
      subject.notify('hello world!');
    }, 220);

    setTimeout(() => {
      expect(observer1).toHaveBeenCalledWith('hello world!');
      expect(observer1.mock.calls.length).toEqual(1);
      expect(observer2).not.toHaveBeenCalled();
      done();
    }, 300);
  });

  test('reset subject', done => {
    const observer1 = jest.fn();
    const observer2 = jest.fn();
    const completed = jest.fn();
    subject.subscribe(observer1);
    subject.subscribe(observer2);
    subject.onCompleted(completed);

    setTimeout(() => {
      subject.notify('hello world!');
    }, 200);

    setTimeout(() => {
      expect(observer1.mock.calls.length).toEqual(1);
      expect(observer2.mock.calls.length).toEqual(1);
      expect(completed.mock.calls.length).toEqual(1);
      subject.reset();
    }, 220);

    setTimeout(() => {
      subject.notify('hello world!');
    }, 240);

    setTimeout(() => {
      expect(observer1.mock.calls.length).toEqual(1);
      expect(observer2.mock.calls.length).toEqual(1);
      expect(completed.mock.calls.length).toEqual(1);
      subject.subscribe(observer1);
      subject.subscribe(observer2);
    }, 260);

    setTimeout(() => {
      subject.notify('hello world!');
    }, 280);

    setTimeout(() => {
      expect(observer1.mock.calls.length).toEqual(2);
      expect(observer2.mock.calls.length).toEqual(2);
      done();
    }, 300);
  });

  test('get the total number of observers', () => {
    expect(subject.size()).toEqual(0);
    const observer1 = jest.fn();
    subject.subscribe(observer1);
    expect(subject.size()).toEqual(1);
    const observer2 = jest.fn();
    const sub$2 = subject.subscribe(observer2);
    expect(subject.size()).toEqual(2);
    sub$2.unsubscribe();
    expect(subject.size()).toEqual(1);
    subject.reset();
    expect(subject.size()).toEqual(0);
  });

  test('onCompleted event', done => {
    const observer1 = jest.fn();
    const observer2 = jest.fn();
    subject.subscribe(observer1);
    subject.subscribe(observer2);
    subject.onCompleted(() => {
      expect(observer1).toHaveBeenCalled();
      expect(observer2).toHaveBeenCalled();

      setTimeout(() => {
        // the fact that the method has been entered indicates that the test was successful.
        expect(1).toEqual(1);
        done();
      }, 20);
    });
    subject.notify('hello world!');
  });
});
