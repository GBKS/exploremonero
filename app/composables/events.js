// Global event system
class EventSystem {
  constructor() {
    this.events = {};
    this.eventListeners = {};
  }

  add(events) {
    const eventArray = Array.isArray(events) ? events : [events];
    
    eventArray.forEach(event => {
      if (this.events[event]) {
        console.log('events.add event already registered: ' + event);
      } else {
        this.events[event] = event;
        this.eventListeners[event] = [];
      }
    });
  }

  listen(event, callback, id) {
    const listeners = this.getListenersByEvent(event);
    
    // Check if already listening
    const alreadyListening = listeners.some(listener => listener.id === id);
    
    if (!alreadyListening) {
      listeners.push({
        callback,
        id
      });
    }
    
    this.updateListenersByEvent(event, listeners);
  }

  unlisten(event, id) {
    const listeners = this.getListenersByEvent(event);
    const index = listeners.findIndex(listener => listener.id === id);
    
    if (index !== -1) {
      listeners.splice(index, 1);
    }
    
    this.updateListenersByEvent(event, listeners);
  }

  call(event, data = {}) {
    const listeners = this.getListenersByEvent(event);
    
    if (listeners) {
      listeners.forEach(listener => {
        if (listener.callback) {
          listener.callback(data);
        }
      });
    }
  }

  getListenersByEvent(event) {
    return this.eventListeners[event] || [];
  }

  updateListenersByEvent(event, listeners) {
    this.eventListeners[event] = listeners;
  }

  clearListener(id) {
    for (const event in this.eventListeners) {
      const listeners = this.eventListeners[event];
      for (let i = listeners.length - 1; i >= 0; i--) {
        if (listeners[i].id === id) {
          listeners.splice(i, 1);
        }
      }
    }
  }
}

export const events = new EventSystem();