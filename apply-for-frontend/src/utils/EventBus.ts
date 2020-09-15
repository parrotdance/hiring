interface EventCallbacksMap {
  [index: string]: Array<Function>
}
interface Subscriber {
  unsubscribe(): void
}

class EventBus {
  private eventCallbacksMap: EventCallbacksMap
  constructor() {
    this.eventCallbacksMap = {}
  }
  public $on(eventName: string, handler: Function): Subscriber {
    const cbs = this.eventCallbacksMap[eventName]
    if (cbs) {
      cbs.push(handler)
    } else {
      this.eventCallbacksMap[eventName] = [handler]
    }
    return {
      unsubscribe(): void {
        const pos = cbs.findIndex((cb) => cb === handler)
        cbs.splice(pos, 1)
      }
    }
  }
  public $off(eventName: string, handler?: Function) {
    const cbs = this.eventCallbacksMap[eventName]
    if (cbs) {
      if (handler) {
        const pos = cbs.findIndex((cb) => cb === handler)
        cbs.splice(pos, 1)
      } else {
        delete this.eventCallbacksMap[eventName]
      }
    }
  }
  public $emit(eventName: string, ...args: any) {
    const cbs = this.eventCallbacksMap[eventName]
    cbs.forEach((cb) => cb(...args))
  }
}

export default new EventBus()
