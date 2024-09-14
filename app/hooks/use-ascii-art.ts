import { useRef, useState, useEffect } from 'react'
import { applyASCIIEffect } from '@/app/lib/ascii-utils'
import type Webcam from 'react-webcam'

interface UseAsciiArtProps {
  isWebcam: boolean
  uploadedImage: string | null
  isImageLoaded: boolean
  canvasWidth: number
  FIXED_HEIGHT: number
  webcamRef: React.RefObject<Webcam>
  setCanvasWidth: React.Dispatch<React.SetStateAction<number>>
}

export function useAsciiArt({ isWebcam, uploadedImage, isImageLoaded, canvasWidth, FIXED_HEIGHT, webcamRef, setCanvasWidth }: UseAsciiArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    if (isWebcam) {
      const interval = setInterval(() => {
        const video = webcamRef.current?.video
        const canvas = canvasRef.current
        if (video && canvas) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            applyASCIIEffect(canvas)
          }
        }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isWebcam])

  useEffect(() => {
    if (uploadedImage && isImageLoaded) {
      setIsProcessing(true)
      const img = new Image()
      img.onload = () => {
        setOriginalImage(img)
        setIsProcessing(false)
      }
      img.src = uploadedImage
    } else {
      setCanvasWidth(640)
      setOriginalImage(null)
    }
  }, [uploadedImage, isImageLoaded])

  useEffect(() => {
    if (originalImage) {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = canvasWidth
        canvas.height = FIXED_HEIGHT
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(originalImage, 0, 0, canvasWidth, FIXED_HEIGHT)
          applyASCIIEffect(canvas)
        }
      }
    }
  }, [originalImage, canvasWidth, FIXED_HEIGHT])

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = 'ascii-masterpiece.png'
      link.click()
    }
  }

  return { canvasRef, isProcessing, applyASCIIEffect, downloadImage }
}