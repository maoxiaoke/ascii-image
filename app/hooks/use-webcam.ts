import { useRef, useCallback } from 'react'
import Webcam from 'react-webcam'

interface UseWebcamProps {
  isWebcam: boolean
  setIsWebcam: React.Dispatch<React.SetStateAction<boolean>>
  setUploadedImage: React.Dispatch<React.SetStateAction<string | null>>
}

export function useWebcam({ isWebcam, setIsWebcam, setUploadedImage }: UseWebcamProps) {
  const webcamRef = useRef<Webcam>(null)

  const toggleWebcam = useCallback(() => {
    setIsWebcam(!isWebcam)
    setUploadedImage(null)
  }, [isWebcam, setIsWebcam, setUploadedImage])

  return { webcamRef, toggleWebcam }
}