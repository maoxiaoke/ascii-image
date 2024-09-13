import React from 'react'
import Webcam from 'react-webcam'

interface WebcamViewProps {
  webcamRef: React.RefObject<Webcam>
  FIXED_HEIGHT: number
}

export function WebcamView({ webcamRef, FIXED_HEIGHT }: WebcamViewProps) {
  return (
    <Webcam
      ref={webcamRef}
      audio={false}
      width={640}
      height={FIXED_HEIGHT}
      screenshotFormat="image/jpeg"
      videoConstraints={{ width: 640, height: FIXED_HEIGHT }}
      className="rounded-lg"
    />
  )
}