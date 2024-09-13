"use client"

import React, { useRef, useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { Camera, Upload, Download } from 'lucide-react'
import { Button } from "./ui/button"

const ASCII_CHARS = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.']
const FIXED_HEIGHT = 480

export default function AsciiArtGenerator() {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isWebcam, setIsWebcam] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [canvasWidth, setCanvasWidth] = useState(640)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
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
        const aspectRatio = img.width / img.height
        const newWidth = Math.round(FIXED_HEIGHT * aspectRatio)
        setCanvasWidth(newWidth)
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
  }, [originalImage, canvasWidth])

  const applyASCIIEffect = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (ctx && canvas.width > 0 && canvas.height > 0) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      const asciiCanvas = document.createElement('canvas')
      asciiCanvas.width = canvas.width
      asciiCanvas.height = canvas.height
      const asciiCtx = asciiCanvas.getContext('2d')
      
      if (asciiCtx) {
        asciiCtx.fillStyle = 'black'
        asciiCtx.fillRect(0, 0, canvas.width, canvas.height)
        
        for (let y = 0; y < canvas.height; y += 5) {
          for (let x = 0; x < canvas.width; x += 3) {
            const index = (y * canvas.width + x) * 4
            const r = data[index]
            const g = data[index + 1]
            const b = data[index + 2]
            const brightness = (r + g + b) / 3
            const char = ASCII_CHARS[Math.floor(brightness / 25)]
            asciiCtx.fillStyle = `rgb(${r},${g},${b})`
            asciiCtx.font = '5px monospace'
            asciiCtx.fillText(char, x, y)
          }
        }
        
        ctx.drawImage(asciiCanvas, 0, 0)
      }
    }
  }

  const toggleWebcam = () => {
    setIsWebcam(!isWebcam)
    setUploadedImage(null)
    setOriginalImage(null)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setIsWebcam(false)
        setIsImageLoaded(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">ASCII Art Alchemist</h1>
      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden" style={{ width: `${canvasWidth}px`, height: `${FIXED_HEIGHT}px` }}>
        {isWebcam && (
          <Webcam
            ref={webcamRef}
            audio={false}
            width={640}
            height={FIXED_HEIGHT}
            screenshotFormat="image/jpeg"
            videoConstraints={{ width: 640, height: FIXED_HEIGHT }}
            className="rounded-lg"
          />
        )}
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={FIXED_HEIGHT}
          className="absolute top-0 left-0 rounded-lg"
        />
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
            Transmuting pixels...
          </div>
        )}
      </div>
      <div className="mt-4 flex space-x-4">
        <Button
          onClick={toggleWebcam}
          variant={isWebcam ? "destructive" : "default"}
          size="icon"
          title={isWebcam ? "Disable Webcam" : "Enable Webcam"}
        >
          <Camera className="h-4 w-4" />
        </Button>
        <Button onClick={triggerFileInput} variant="outline" size="icon" title="Upload Image">
          <Upload className="h-4 w-4" />
        </Button>
        <Button onClick={downloadImage} variant="outline" size="icon" disabled={!uploadedImage && !isWebcam} title="Download ASCII Art">
          <Download className="h-4 w-4" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  )
}