"use client"

import React, { useRef, useState } from 'react'
import { Camera, Upload, Download, Wand2 } from 'lucide-react'
import { Button } from "./ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { useAsciiArt } from '../hooks/use-ascii-art'
import { useWebcam } from '../hooks/use-webcam'
import { useImageUpload } from '@/app/hooks/use-image-upload'
import { WebcamView } from './ascii-art/webcam-view'
import { CanvasView } from './ascii-art/canvas-view'
import { ProcessingOverlay } from './ascii-art/processing-overlay'
import { cn } from "../lib/utils"
import { ASCIICharSet } from '../lib/ascii-utils'
import { ConfigPanel } from './ascii-art/config-panel'

interface ItemProps {
  emoji: string;
  position: string;
}

const FIXED_HEIGHT = 960

const AsciiArtTitle: React.FC = () => {
  const titleItems: ItemProps[] = [
    { emoji: '🖥️', position: '-left-16 top-1 group-hover:-rotate-[10deg] group-hover:-translate-y-6' },
    { emoji: '📝', position: '-left-8 top-0 group-hover:-rotate-[20deg] group-hover:-translate-x-4' },
    { emoji: '🔤', position: 'left-32 top-0 group-hover:rotate-[10deg] group-hover:-translate-y-5' },
    { emoji: '🎨', position: 'left-40 top-0 group-hover:rotate-[20deg] group-hover:translate-x-4' },
    { emoji: '🧪', position: 'left-52 -top-4 -rotate-[30deg] group-hover:-translate-y-4' },
    { emoji: '🔮', position: 'left-60 -top-1 group-hover:-rotate-45' },
    { emoji: '🧬', position: 'left-72 -top-6 rotate-[30deg] group-hover:translate-y-4' },
    { emoji: '⚗️', position: 'left-80 -top-1 group-hover:rotate-[45deg]' },
  ];

  return (
    <div className="mb-6 flex flex-col items-center justify-center">
      <Wand2 size={40} className="mb-2 text-gray-800" />
      <h1 className="text-3xl font-bold text-gray-800">
        <div className="group relative flex items-center">
          <span className="transition-colors duration-300">
            <span className="group-hover:text-purple-600">ASCII Art</span>{' '}
            <span className="group-hover:text-amber-500">Alchemist</span>
          </span>
          <div className="absolute inset-0 cursor-pointer opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {titleItems.map((item, index) => (
              <span
                key={index}
                className={cn(
                  "pointer-events-none absolute transform text-lg transition-transform duration-500 group-hover:scale-110",
                  item.position
                )}
              >
                {item.emoji}
              </span>
            ))}
          </div>
        </div>
      </h1>
    </div>
  );
};

export function AsciiArtGenerator() {
  const [isWebcam, setIsWebcam] = useState(false)
  const [canvasWidth, setCanvasWidth] = useState(1280) // Changed from 640 to 1280
  const [colorMode, setColorMode] = useState<'monotone' | 'duotone' | 'colorful'>('colorful')
  const [charSet, setCharSet] = useState<ASCIICharSet>('standard')
  const [isDense, setIsDense] = useState(false)
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
    downloadImage,
  } = useAsciiArt({ 
    isWebcam, 
    uploadedImage, 
    isImageLoaded, 
    canvasWidth, 
    FIXED_HEIGHT, 
    webcamRef, 
    setCanvasWidth, 
    colorMode,
    charSet,
    isDense  // Add this line
  })

  const triggerFileInput = () => fileInputRef.current?.click()

  const handleColorModeChange = (value: 'monotone' | 'duotone' | 'colorful') => {
    setColorMode(value)
  }

  const handleCharSetChange = (value: ASCIICharSet) => {
    setCharSet(value)
  }

  const handleDensityChange = (value: boolean) => {
    setIsDense(value)
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <AsciiArtTitle />
      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden" style={{ width: `${canvasWidth}px`, height: `${FIXED_HEIGHT}px` }}>
        {isWebcam && (
          <WebcamView webcamRef={webcamRef} FIXED_HEIGHT={FIXED_HEIGHT} />
        )}
        <CanvasView canvasRef={canvasRef} canvasWidth={canvasWidth} FIXED_HEIGHT={FIXED_HEIGHT} />
        {isProcessing && <ProcessingOverlay />}
      </div>
      <TooltipProvider>
        <div className="mt-4 flex space-x-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleWebcam}
                variant={isWebcam ? "destructive" : "default"}
                size="icon"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isWebcam ? "Disable Webcam" : "Enable Webcam"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={triggerFileInput} 
                variant="outline" 
                size="icon"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload Image</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={downloadImage} 
                variant="outline" 
                size="icon" 
                disabled={isProcessing || isWebcam}
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download ASCII Art</p>
            </TooltipContent>
          </Tooltip>

          <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

          <div className="relative">
            <ConfigPanel
              colorMode={colorMode}
              charSet={charSet}
              isDense={isDense}
              onColorModeChange={handleColorModeChange}
              onCharSetChange={handleCharSetChange}
              onDensityChange={handleDensityChange}
            />
          </div>
        </div>
      </TooltipProvider>
      {/* Remove the old UI for color mode and char set selection */}
    </div>
  )
}