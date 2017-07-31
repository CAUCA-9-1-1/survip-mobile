import { Injectable } from '@angular/core';

function getWindow(): any {
  if (typeof(window) === 'object') {
    return window;
  }

  return {};
}

function getNavigator(): any {
  if (typeof(navigator) === 'object') {
    return navigator;
  }

  return {};
}

function getDocument(): any {
  if (typeof(document) === 'object') {
    return document;
  }

  return {};
}

@Injectable()
export class WindowRefService {
  get nativeWindow(): any {
    return getWindow();
  }

  get nativeNavigator(): any {
    return getNavigator();
  }

  get nativeDocument(): any {
    return getDocument();
  }

  public nativeClass(name: string): any {
    const window: any = this.nativeWindow;

    if (typeof (window[name]) !== 'undefined') {
      return new window[name]();
    }

    return {};
  }

  public nativeObject(name: string): any {
    const window: any = this.nativeWindow;

    if (typeof (window[name]) !== 'undefined') {
      return window[name];
    }

    return {};
  }
}
