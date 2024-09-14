type ColorMode = 'monotone' | 'duotone' | 'colorful'

export type ASCIICharSet = 'standard' | 'binary' | 'numeric' | 'symbols'

const ASCII_CHAR_SETS: Record<ASCIICharSet, string[]> = {
  standard: ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.'],
  binary: ['1', '0'],
  numeric: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0'],
  symbols: ['@', '#', '$', '%', '&', '*', '!', '?', '+', '=', '-'],
}

export function applyASCIIEffect(
  canvas: HTMLCanvasElement, 
  colorMode: ColorMode = 'colorful',
  charSet: ASCIICharSet = 'standard',
  isDense: boolean = true
) {
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
      
      const chars = ASCII_CHAR_SETS[charSet]
      const spacing = isDense ? { x: 3, y: 5 } : { x: 6, y: 10 }
      
      for (let y = 0; y < canvas.height; y += spacing.y) {
        for (let x = 0; x < canvas.width; x += spacing.x) {
          const index = (y * canvas.width + x) * 4
          const [r, g, b] = data.slice(index, index + 3)
          const brightness = (r + g + b) / 3
          const char = chars[Math.floor((brightness / 255) * (chars.length - 1))]
          
          let fillStyle: string
          switch (colorMode) {
            case 'monotone':
              fillStyle = `rgb(${brightness},${brightness},${brightness})`
              break
            case 'duotone':
              const hue = 200 // You can adjust this value for different color schemes
              fillStyle = `hsl(${hue}, 100%, ${brightness / 2.55}%)`
              break
            case 'colorful':
            default:
              fillStyle = `rgb(${r},${g},${b})`
              break
          }
          
          asciiCtx.fillStyle = fillStyle
          asciiCtx.font = `${spacing.y}px monospace`
          asciiCtx.fillText(char, x, y)
        }
      }
      
      ctx.drawImage(asciiCanvas, 0, 0)
    }
  }
}