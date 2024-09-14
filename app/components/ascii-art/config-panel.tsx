import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { Settings, GripVertical } from 'lucide-react'
import { Button } from "../ui/button"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Switch } from "../ui/switch"
import { ASCIICharSet } from '../../lib/ascii-utils'

interface ConfigPanelProps {
  colorMode: 'monotone' | 'duotone' | 'colorful'
  charSet: ASCIICharSet
  isDense: boolean
  onColorModeChange: (value: 'monotone' | 'duotone' | 'colorful') => void
  onCharSetChange: (value: ASCIICharSet) => void
  onDensityChange: (value: boolean) => void
}

export function ConfigPanel({
  colorMode,
  charSet,
  isDense,
  onColorModeChange,
  onCharSetChange,
  onDensityChange
}: ConfigPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest('[role="listbox"]')) {
          setIsOpen(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Settings className="h-4 w-4" />
        </motion.div>
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag
            dragControls={dragControls}
            dragMomentum={false}
            className="absolute top-0 left-[100%] w-64 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50"
            style={{ marginLeft: '10px' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Configuration</h3>
              <div
                className="cursor-move"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <GripVertical className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="colorMode" className="mb-2 block">Color Mode</Label>
                <RadioGroup
                  id="colorMode"
                  value={colorMode}
                  onValueChange={onColorModeChange}
                  className="flex flex-col space-y-2"
                >
                  {['monotone', 'duotone', 'colorful'].map((mode) => (
                    <div key={mode} className="flex items-center space-x-2">
                      <RadioGroupItem value={mode} id={mode} />
                      <Label htmlFor={mode} className="capitalize">
                        {mode}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="charSet" className="mb-2 block">ASCII Character Set</Label>
                <Select value={charSet} onValueChange={onCharSetChange}>
                  <SelectTrigger id="charSet">
                    <SelectValue placeholder="Select character set" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="binary">Binary</SelectItem>
                    <SelectItem value="numeric">Numeric</SelectItem>
                    <SelectItem value="symbols">Symbols</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="density" className="flex-grow">Dense Characters</Label>
                <Switch
                  id="density"
                  checked={isDense}
                  onCheckedChange={onDensityChange}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
