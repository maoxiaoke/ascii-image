import React from 'react'

interface CanvasViewProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  canvasWidth: number
  FIXED_HEIGHT: number
}

export function CanvasView({ canvasRef, canvasWidth, FIXED_HEIGHT }: CanvasViewProps) {
  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={FIXED_HEIGHT}
      className="absolute top-0 left-0 rounded-lg"
    />
  )
}