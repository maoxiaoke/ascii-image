const ASCII_CHARS = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.']

export function applyASCIIEffect(canvas: HTMLCanvasElement) {
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
          const [r, g, b] = data.slice(index, index + 3)
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