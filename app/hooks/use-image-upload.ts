import { useState, useCallback } from 'react'

interface UseImageUploadProps {
  setIsWebcam: React.Dispatch<React.SetStateAction<boolean>>
  setCanvasWidth: React.Dispatch<React.SetStateAction<number>>
  FIXED_HEIGHT: number
}

export function useImageUpload({ setIsWebcam, setCanvasWidth, FIXED_HEIGHT }: UseImageUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setIsWebcam(false)
        setIsImageLoaded(true)
        const img = new Image()
        img.onload = () => {
          const aspectRatio = img.width / img.height
          const newWidth = Math.round(FIXED_HEIGHT * aspectRatio)
          setCanvasWidth(Math.min(newWidth, 1280)) // Limit max width to 1280px
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }, [setIsWebcam, setCanvasWidth, FIXED_HEIGHT])

  return { uploadedImage, handleImageUpload, isImageLoaded, setUploadedImage }
}