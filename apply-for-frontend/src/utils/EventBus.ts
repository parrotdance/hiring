interface EventCallbacksMap {
  [index: string]: Array<Function>
}
interface Subscriber {
  unsubscribe(): void
}

class EventBus {
  private _eventCallbacksMap: EventCallbacksMap
  constructor() {
    this._eventCallbacksMap = {}
  }
  public $on(eventName: string, handler: Function): Subscriber {
    const cbs = this._eventCallbacksMap[eventName]
    if (cbs) {
      cbs.push(handler)
    } else {
      this._eventCallbacksMap[eventName] = [handler]
    }
    return {
      unsubscribe(): void {
        const pos = cbs.findIndex((cb) => cb === handler)
        cbs.splice(pos, 1)
      }
    }
  }
  public $off(eventName: string, handler?: Function) {
    const cbs = this._eventCallbacksMap[eventName]
    if (cbs) {
      if (handler) {
        const pos = cbs.findIndex((cb) => cb === handler)
        cbs.splice(pos, 1)
      } else {
        delete this._eventCallbacksMap[eventName]
      }
    }
  }
  public $emit(eventName: string, ...args: any) {
    const cbs = this._eventCallbacksMap[eventName]
    cbs.forEach((cb) => cb(...args))
  }
}

export default new EventBus()
