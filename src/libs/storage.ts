import type react from "react"

import { useStorage as us } from "@plasmohq/storage/hook"

import store from "./store"

type Setter<T> = ((v?: T, isHydrated?: boolean) => T) | T

const useStorage = <T = any>(
  key: string,
  onInit?: Setter<T>
): readonly [
  T,
  (setter: Setter<T>) => Promise<void>,
  {
    readonly setRenderValue: react.Dispatch<react.SetStateAction<T>>
    readonly setStoreValue: (v?: T) => Promise<any>
    readonly remove: () => void
  }
] =>
  us(
    {
      key: key,
      instance: store
    },
    onInit
  )
export default useStorage
