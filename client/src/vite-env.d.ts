/// <reference types="vite/client" />

import { PollI } from "./interfaces/api.interface";

interface ErrorConstructor {
  captureStackTrace(targetObject: any, constructorOpt?: Function): void;
}

declare global {
  interface Window {
    __INITIAL_POLLS__: PollI[];
  }
}
