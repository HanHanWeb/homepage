"use client"

import confetti, {
  type CreateTypes as ConfettiInstance,
  type GlobalOptions as ConfettiGlobalOptions,
  type Options as ConfettiOptions,
} from "canvas-confetti"
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react"
import { cn } from "@/lib/utils"

export type ConfettiRef = {
  fire: (options?: ConfettiOptions) => Promise<void> | void
}

type Props = React.ComponentPropsWithRef<"canvas"> & {
  options?: ConfettiOptions
  globalOptions?: ConfettiGlobalOptions
}

const ConfettiComponent = forwardRef<ConfettiRef, Props>((props, ref) => {
  const {
    options,
    globalOptions = { resize: true, useWorker: true, disableForReducedMotion: true },
    className,
    ...rest
  } = props

  const canvasNodeRef = useRef<HTMLCanvasElement | null>(null)
  const instanceRef = useRef<ConfettiInstance | null>(null)
  const optionsRef = useRef(options)
  const globalOptionsRef = useRef(globalOptions)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  useEffect(() => {
    globalOptionsRef.current = globalOptions
  }, [globalOptions])

  useEffect(() => {
    if (canvasNodeRef.current && !instanceRef.current) {
      instanceRef.current = confetti.create(canvasNodeRef.current, {
        resize: true,
        useWorker: true,
        disableForReducedMotion: true,
        ...globalOptionsRef.current,
      })
    }

    return () => {
      instanceRef.current?.reset()
      instanceRef.current = null
    }
  }, [])

  const fire = useCallback(async (opts: ConfettiOptions = {}) => {
    try {
      await instanceRef.current?.({
        ...optionsRef.current,
        ...opts,
      })
    } catch (error) {
      console.error("Confetti error:", error)
    }
  }, [])

  const api = useMemo<ConfettiRef>(() => ({ fire }), [fire])

  useImperativeHandle(ref, () => api, [api])

  return (
    <canvas
      ref={canvasNodeRef}
      className={cn(
        // canvas 是替换元素，inset-0 不会给它拉伸尺寸，
        // 必须显式给宽高，否则停留在默认 300×150 导致撒花聚集在左上角
        "pointer-events-none fixed inset-0 size-full",
        className,
      )}
      {...rest}
    />
  )
})

ConfettiComponent.displayName = "Confetti"

export const Confetti = ConfettiComponent