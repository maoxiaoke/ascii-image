"use client"

import React, { useRef, useState } from 'react'
import { Camera, Upload, Download } from 'lucide-react'
import { Button } from "./ui/button"
import { useAsciiArt } from '../hooks/use-ascii-art'
import { useWebcam } from '../hooks/use-webcam'
import { useImageUpload } from '@/app/hooks/use-image-upload'
import { WebcamView } from './ascii-art/webcam-view'
import { CanvasView } from './ascii-art/canvas-view'
import { ProcessingOverlay } from './ascii-art/processing-overlay'

const FIXED_HEIGHT = 480

export function AsciiArtGenerator() {
  const [isWebcam, setIsWebcam] = useState(false)
  const [canvasWidth, setCanvasWidth] = useState(640)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    uploadedImage,
    handleImageUpload,
    isImageLoaded,
    setUploadedImage,
  } = useImageUpload({ setIsWebcam, setCanvasWidth, FIXED_HEIGHT })

  const {
    webcamRef,
    toggleWebcam,
  } = useWebcam({ isWebcam, setIsWebcam, setUploadedImage })

  const {
    canvasRef,
    isProcessing,
    applyASCIIEffect,
    downloadImage,
  } = useAsciiArt({ isWebcam, uploadedImage, isImageLoaded, canvasWidth, FIXED_HEIGHT, webcamRef, setCanvasWidth })

  const triggerFileInput = () => fileInputRef.current?.click()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">ASCII Art Alchemist</h1>
      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden" style={{ width: `${canvasWidth}px`, height: `${FIXED_HEIGHT}px` }}>
        {isWebcam && (
          <WebcamView webcamRef={webcamRef} FIXED_HEIGHT={FIXED_HEIGHT} />
        )}
        <CanvasView canvasRef={canvasRef} canvasWidth={canvasWidth} FIXED_HEIGHT={FIXED_HEIGHT} />
        {isProcessing && <ProcessingOverlay />}
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
        <Button 
          onClick={downloadImage} 
          variant="outline" 
          size="icon" 
          disabled={isProcessing || isWebcam}
          title="Download ASCII Art"
        >
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