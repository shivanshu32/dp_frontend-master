import { Injectable } from '@angular/core';

export enum MessageType {
  Success = 1,
  Error = 2,
  Warning = 3,
}

@Injectable({
  providedIn: 'root'
})

export class LoggerService {

  constructor() { }

  write(message: any, type: MessageType = MessageType.Success, withDate: boolean = false) {
    let color: string = '';
    switch(type) {
      case MessageType.Success:
        color = 'green';
        break;
      case MessageType.Warning:
        color = 'yellow';
        break;
      case MessageType.Error:
        color = 'red';
        break;
    }
    console.log(`%c${withDate ? `${new Date().toLocaleDateString()}:` : ''} ${message}`, `color: ${color}`);
  }
}
