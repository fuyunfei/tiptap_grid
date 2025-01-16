'use client'

import { useState, useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import { marked } from 'marked'
import { Level } from '@tiptap/extension-heading'
import GridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { Layout } from 'react-grid-layout'

// Define types for our schema structure
interface FontStyle {
  font: string
  color: string
}

interface SchemaConfig {
  name: string
  h1: FontStyle
  h2: FontStyle
  h3: FontStyle
  bold: FontStyle
}

type FontSchemas = {
  [key: string]: SchemaConfig
}

type SchemaElement = 'h1' | 'h2' | 'h3' | 'bold'

// Define our enhanced font schemas with color properties
const initialFontSchemas: FontSchemas = {
  default: {
    name: 'Default',
    h1: { font: 'Nabla', color: '#3b82f6' },
    h2: { font: 'Honk', color: '#10b981' },
    h3: { font: 'Kalnia', color: '#8b5cf6' },
    bold: { font: 'Bungee Spice', color: '#3b82f6' },
  },
  elegant: {
    name: 'Elegant',
    h1: { font: 'Playfair Display', color: '#2c3e50' },
    h2: { font: 'Cormorant Garamond', color: '#34495e' },
    h3: { font: 'Libre Baskerville', color: '#7f8c8d' },
    bold: { font: 'Bodoni Moda', color: '#16a085' },
  },
  cyberpunk: {
    name: 'Cyberpunk',
    h1: { font: 'Orbitron', color: '#f0f' },
    h2: { font: 'Syncopate', color: '#0ff' },
    h3: { font: 'Chakra Petch', color: '#ff0' },
    bold: { font: 'Turret Road', color: '#f0f' },
  },
  botanical: {
    name: 'Botanical',
    h1: { font: 'Crimson Pro', color: '#2d6a4f' },
    h2: { font: 'Marcellus', color: '#40916c' },
    h3: { font: 'Cormorant Upright', color: '#52b788' },
    bold: { font: 'Della Respira', color: '#2d6a4f' },
  },
  noir: {
    name: 'Noir',
    h1: { font: 'Abril Fatface', color: '#ffffff' },
    h2: { font: 'Josefin Sans', color: '#d1d1d1' },
    h3: { font: 'Poiret One', color: '#a3a3a3' },
    bold: { font: 'Six Caps', color: '#ffffff' },
  },
  candy: {
    name: 'Candy',
    h1: { font: 'Pacifico', color: '#ff86b3' },
    h2: { font: 'Quicksand', color: '#b9fbc0' },
    h3: { font: 'Comic Neue', color: '#fdcff3' },
    bold: { font: 'Righteous', color: '#ff86b3' },
  },
  playful: {
    name: 'Playful',
    h1: { font: 'Fredoka One', color: '#ff6b6b' },
    h2: { font: 'Bubblegum Sans', color: '#feca57' },
    h3: { font: 'Patrick Hand', color: '#54a0ff' },
    bold: { font: 'Luckiest Guy', color: '#5f27cd' },
  },
  futuristic: {
    name: 'Futuristic',
    h1: { font: 'Orbitron', color: '#00b894' },
    h2: { font: 'Exo 2', color: '#0984e3' },
    h3: { font: 'Rajdhani', color: '#6c5ce7' },
    bold: { font: 'Audiowide', color: '#fd79a8' },
  },
  retro: {
    name: 'Retro',
    h1: { font: 'Monoton', color: '#e84393' },
    h2: { font: 'Press Start 2P', color: '#00cec9' },
    h3: { font: 'VT323', color: '#fdcb6e' },
    bold: { font: 'Rubik Glitch', color: '#e17055' },
  },
  linearAttachment: {
    name: 'Linear Attachment',
    h1: { font: 'Nabla', color: '#2b6cb0' },
    h2: { font: 'Honk', color: '#319795' },
    h3: { font: 'Kalnia', color: '#744210' },
    bold: { font: 'Bungee Spice', color: '#2b6cb0' },
  },
}

// Define block content
const initialBlocks = [
  {
    id: 'pioneer',
    title: 'Pioneer of the Digital Revolution',
    content: `# Ted Nelson: Digital Visionary
## Early Life and Education

Theodor Holm Nelson, born in 1937, is not just a technological pioneer – he's the man who dreamed up the digital world before computers were even personal. In 1963, he coined the terms **hypertext** and **hypermedia**, concepts that would later become the foundation of the **World Wide Web**.

> "A user interface should be so simple that a beginner can understand it within 10 seconds."`,
  },
  {
    id: 'xanadu',
    title: 'Project Xanadu',
    content: `# Project Xanadu: The Future That Could Have Been
## Revolutionary Concepts

Long before the first web browser, Nelson envisioned **Project Xanadu** – a revolutionary system for **interconnected documents** with **bidirectional links**, parallel documents, and visible connections. While the World Wide Web we know today took a simpler path, Xanadu's concepts continue to influence modern computing.`,
  },
  {
    id: 'thinking',
    title: 'Beyond Conventional Thinking',
    content: `# Breaking Computing Paradigms
## Human-Centered Computing

Nelson's ideas challenged the status quo of **computer science**. He advocated for a more **human-centered** approach to technology, where computers would adapt to how people naturally think and work, rather than forcing people to adapt to computers.

> "The good news about computers is that they do what you tell them to do. The bad news is that they do what you tell them to do."`,
  },
  {
    id: 'legacy',
    title: 'Legacy',
    content: `# A Lasting Digital Legacy
## Modern Influence

While some called his ideas too ambitious, Nelson's influence on **modern computing** is undeniable. From the way we navigate websites to how we think about **digital documents**, his concepts have shaped our digital world. His work continues to inspire new generations of technologists and creators who believe in the power of **interconnected knowledge**.`,
  },
]

interface Block {
  id: string
  title: string
  content: string
}

// Custom hook for managing block editors
function useBlockEditor(block: Block) {
  const editor = useEditor({
    extensions: [StarterKit, Highlight, Typography],
    content: marked(block.content),
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
      },
    },
  })

  return editor
}

type FormatType = SchemaElement | 'italic' | 'highlight' | 'code' | 'blockquote' | 'bulletList' | 'orderedList' | 'codeBlock' | 'horizontalRule'

const formatButtons: FormatType[] = ['h1', 'h2', 'h3', 'bold', 'italic', 'highlight', 'code', 'blockquote', 'bulletList', 'orderedList', 'codeBlock', 'horizontalRule']

interface CustomLayout extends Layout {
  minW: number
  maxW: number
}

interface Section {
  id: string;
  title: string;
  icon?: string;
  isActive?: boolean;
}

const sections: Section[] = [
  { id: 'intro', title: 'Introduction', isActive: false },
  { id: 'diversity', title: 'Defining Diversity and Inclusion', isActive: true },
  { id: 'benefits', title: 'Benefits of an Inclusive Workplace', isActive: false },
  { id: 'trends', title: 'Current Trends in Diversity Practices', isActive: false },
  { id: 'leadership', title: 'Role of Leadership in Driving Inclusion', isActive: false },
]

type CompactionType = 'vertical' | 'horizontal' | null;

const EnhancedMultiSchemaTiptapEditor = () => {
  const [currentSchema, setCurrentSchema] = useState<keyof typeof initialFontSchemas>('default')
  const [fontSchemas, setFontSchemas] = useState<FontSchemas>(initialFontSchemas)
  const [layout, setLayout] = useState<CustomLayout[]>([
    { i: 'pioneer', x: 0, y: 0, w: 24, h: 6, minW: 12, maxW: 40, moved: false, static: false },
    { i: 'xanadu', x: 24, y: 0, w: 16, h: 6, minW: 8, maxW: 20, moved: false, static: false },
    { i: 'thinking', x: 0, y: 6, w: 16, h: 5, minW: 8, maxW: 20, moved: false, static: false },
    { i: 'legacy', x: 16, y: 6, w: 24, h: 5, minW: 8, maxW: 30, moved: false, static: false },
  ])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [compactionType, setCompactionType] = useState<CompactionType>(null)

  // Create editor instances for each block
  const blockEditors = initialBlocks.map(block => ({
    ...block,
    editor: useBlockEditor(block),
  }))

  const handleFormat = useCallback((format: FormatType, blockId: string) => {
    const block = blockEditors.find(b => b.id === blockId)
    if (!block?.editor) return

    switch (format) {
      case 'h1':
      case 'h2':
      case 'h3': {
        const level = parseInt(format[1]) as Level
        block.editor.chain().focus().toggleHeading({ level }).run()
        break
      }
      case 'bold':
        block.editor.chain().focus().toggleBold().run()
        break
      case 'italic':
        block.editor.chain().focus().toggleItalic().run()
        break
      case 'highlight':
        block.editor.chain().focus().toggleHighlight().run()
        break
      case 'code':
        block.editor.chain().focus().toggleCode().run()
        break
      case 'blockquote':
        block.editor.chain().focus().toggleBlockquote().run()
        break
      case 'bulletList':
        block.editor.chain().focus().toggleBulletList().run()
        break
      case 'orderedList':
        block.editor.chain().focus().toggleOrderedList().run()
        break
      case 'codeBlock':
        block.editor.chain().focus().toggleCodeBlock().run()
        break
      case 'horizontalRule':
        block.editor.chain().focus().setHorizontalRule().run()
        break
    }
  }, [blockEditors])

  const handleSchemaChange = (schema: keyof typeof fontSchemas) => {
    setCurrentSchema(schema)
  }

  const handleColorChange = (schema: keyof FontSchemas, element: SchemaElement, color: string) => {
    setFontSchemas(prevSchemas => ({
      ...prevSchemas,
      [schema]: {
        ...prevSchemas[schema],
        [element]: {
          ...prevSchemas[schema][element],
          color: color
        }
      }
    }))
  }

  // Create a style object for the current schema
  const currentSchemaStyle = {
    '--color-h1': fontSchemas[currentSchema].h1.color,
    '--color-h2': fontSchemas[currentSchema].h2.color,
    '--color-h3': fontSchemas[currentSchema].h3.color,
    '--color-bold': fontSchemas[currentSchema].bold.color,
  } as React.CSSProperties

  // Calculate grid dimensions
  const rowHeight = 25
  const sidebarWidth = 256
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
  const calculatedWidth = viewportWidth - sidebarWidth
  
  // Calculate actual column width including all margins
  const totalMarginWidth = 16 * (40 - 1) // margin between columns (16px * 39)
  const containerPaddingWidth = 16 * 2    // left and right container padding
  const availableWidth = calculatedWidth - totalMarginWidth - containerPaddingWidth
  const columnWidth = Math.floor(availableWidth / 40)

  // Create dynamic styles with correct grid dimensions
  useEffect(() => {
    const gridStyles = `
      .react-grid-layout {
        min-height: 100% !important;
        position: relative;
      }
      .react-grid-layout::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-size: ${columnWidth + 16}px ${rowHeight + 16}px; /* Add margin to size */
        background-image: 
          linear-gradient(to right, rgba(81, 92, 230, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(81, 92, 230, 0.1) 1px, transparent 1px);
        background-position: ${16}px ${16}px; /* Offset by container padding */
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      .react-grid-layout:has(.react-grid-item.react-draggable-dragging)::before,
      .react-grid-layout:has(.react-grid-item.resizing)::before {
        opacity: 1;
      }
      .react-grid-item {
        transition: all 200ms ease;
        transition-property: left, top, width;
        overflow: hidden;
        border: none !important;
      }
      .react-grid-item.resizing {
        transition: none;
        will-change: width, height;
        border: 2px solid rgba(81, 92, 230, 0.3) !important;
        border-radius: 8px;
      }
      .react-grid-item.react-draggable-dragging {
        transition: none;
        z-index: 3;
        will-change: transform;
        border: 2px solid rgba(81, 92, 230, 0.3) !important;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }
      .react-grid-item.dropping {
        visibility: hidden;
      }
      .react-grid-item .react-resizable-handle {
        position: absolute;
        width: 12px;
        height: 12px;
        bottom: 0;
        right: 0;
        cursor: se-resize;
        opacity: 0;
        transition: opacity 200ms ease;
        border-radius: 0 0 4px 0;
      }
      .react-grid-item:hover .react-resizable-handle {
        opacity: 0.7;
      }
      .react-grid-item .react-resizable-handle::after {
        content: "";
        position: absolute;
        right: 3px;
        bottom: 3px;
        width: 6px;
        height: 6px;
        border-right: 2px solid rgba(81, 92, 230, 0.6);
        border-bottom: 2px solid rgba(81, 92, 230, 0.6);
      }
      .react-grid-item .prose {
        height: 100% !important;
        overflow: hidden !important;
        mask-image: linear-gradient(to bottom, black calc(100% - 2rem), transparent 100%);
        -webkit-mask-image: linear-gradient(to bottom, black calc(100% - 2rem), transparent 100%);
        border: none !important;
      }
      .react-grid-item .editor {
        height: 100% !important;
        overflow: hidden !important;
        border: none !important;
        transition: all 200ms ease;
      }
      .react-grid-item .ProseMirror {
        overflow: hidden !important;
        cursor: move;
        border: none !important;
      }
      .react-grid-item .ProseMirror:focus {
        cursor: text;
        outline: none !important;
      }
      .react-grid-item .ProseMirror p {
        margin-bottom: 0.5em;
      }
      .react-grid-item .ProseMirror > *:last-child {
        margin-bottom: 2rem;
      }
      .react-grid-item:hover {
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }
    `

    // Update styles in head
    const styleId = 'grid-styles'
    let styleEl = document.getElementById(styleId) as HTMLStyleElement
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = styleId
      document.head.appendChild(styleEl)
    }
    styleEl.textContent = gridStyles
  }, [columnWidth, rowHeight])

  return (
    <div className="relative w-full min-h-screen flex bg-slate-50/40">
      {/* Minimized Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed left-0 top-4 z-40 p-2 bg-white/80 backdrop-blur-xl shadow-sm border border-slate-200/50 transition-all duration-300 hover:bg-white ${isSidebarOpen ? 'translate-x-64 rounded-l-none rounded-r-lg' : 'rounded-r-lg'}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={`transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`}>
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Section Outline Panel */}
      <div className={`fixed left-0 top-0 bottom-0 w-64 bg-white/70 backdrop-blur-xl border-r border-slate-200/50 z-30 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 border-b border-slate-200/50 flex items-center px-6 bg-white/50">
          <span className="font-semibold text-slate-800">Document Sections</span>
        </div>
        <div className="px-3 py-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`px-3 py-2.5 rounded-lg text-sm mb-1.5 cursor-pointer transition-all duration-200 ${
                section.isActive 
                  ? 'bg-blue-50/80 text-blue-700 font-medium shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-1.5 h-1.5 rounded-full ${section.isActive ? 'bg-blue-500' : 'bg-slate-300'}`} />
                {section.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Navigation Bar */}
        <div className={`fixed top-0 right-0 left-0 h-16 bg-white/70 backdrop-blur-xl shadow-sm z-20 flex items-center justify-between px-6 border-b border-slate-200/50 transition-all duration-300 ${isSidebarOpen ? 'left-64' : 'left-0'}`}>
          {/* Left Controls */}
          <div className="flex items-center gap-4">
            <select
              id="schema-select"
              value={currentSchema}
              onChange={(e) => handleSchemaChange(e.target.value as keyof typeof fontSchemas)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white/90 shadow-sm hover:bg-white transition-all duration-200 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {Object.entries(fontSchemas).map(([key, schema]) => (
                <option key={key} value={key}>{schema.name}</option>
              ))}
            </select>

            <div className="h-6 w-px bg-slate-200/70"></div>

            <select
              value={compactionType || 'none'}
              onChange={(e) => setCompactionType(e.target.value === 'none' ? null : e.target.value as CompactionType)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white/90 shadow-sm hover:bg-white transition-all duration-200 min-w-[160px] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="none">No Compact</option>
              <option value="horizontal">Horizontal Compact</option>
              <option value="vertical">Vertical Compact</option>              
            </select>
          </div>

          {/* Format Buttons */}
          <div className="flex-1 flex justify-center">
            <div className="flex gap-0.5 bg-white/80 backdrop-blur rounded-xl shadow-sm p-1 border border-slate-200/50">
              {formatButtons.map((format) => (
                <button
                  key={format}
                  onClick={() => {
                    const selectedBlock = blockEditors.find(block => block.editor?.isFocused)
                    if (selectedBlock) {
                      handleFormat(format, selectedBlock.id)
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 text-gray-600 hover:text-gray-900"
                  title={format.charAt(0).toUpperCase() + format.slice(1)}
                >
                  {format === 'h1' && <span className="font-bold text-lg">H1</span>}
                  {format === 'h2' && <span className="font-bold text-lg">H2</span>}
                  {format === 'h3' && <span className="font-bold text-lg">H3</span>}
                  {format === 'bold' && <span className="font-bold">B</span>}
                  {format === 'italic' && <span className="italic">I</span>}
                  {format === 'highlight' && <span className="bg-yellow-200">H</span>}
                  {format === 'code' && <span className="font-mono">{`<>`}</span>}
                  {format === 'blockquote' && <span className="font-serif">"</span>}
                  {format === 'bulletList' && <span>•</span>}
                  {format === 'orderedList' && <span>1.</span>}
                  {format === 'codeBlock' && <span className="font-mono">{ `{ }` }</span>}
                  {format === 'horizontalRule' && <span>―</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Right Spacer */}
          <div className="w-[200px]"></div>
        </div>

        {/* Grid Layout Area */}
        <div className="w-full min-h-screen pt-20 pb-32">
          <div className="relative h-[calc(100vh-5rem)]">
            <GridLayout
              className="layout"
              layout={layout}
              cols={40}
              rowHeight={rowHeight}
              width={calculatedWidth}
              margin={[16, 16]}
              containerPadding={[16, 16]}
              compactType={compactionType}
              preventCollision={!compactionType}
              isResizable={true}
              isBounded={false}
              onLayoutChange={(newLayout) => setLayout(newLayout as CustomLayout[])}
              draggableHandle=".editor"
              resizeHandles={['se']}
              useCSSTransforms={true}
              verticalCompact={Boolean(compactionType)}
              allowOverlap={false}
              autoSize={true}
              maxRows={100}
            >
              {blockEditors.map((block) => (
                <div 
                  key={block.id} 
                  className="bg-white/40 hover:bg-white/95 backdrop-blur rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative group border-0"
                >
                  <div 
                    className="h-full w-full overflow-hidden relative border-0" 
                    style={currentSchemaStyle}
                  >
                    {block.editor && (
                      <EditorContent
                        editor={block.editor}
                        className={`editor ${currentSchema} p-3 prose prose-sm max-w-none focus:outline-none cursor-move group-focus-within:cursor-text group-hover:bg-white/5 border-0`}
                      />
                    )}
                    {/* Fade overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/80 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              ))}
            </GridLayout>
          </div>
        </div>

        {/* Chat Toggle Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`fixed bottom-6 right-6 z-40 p-3 bg-white/80 backdrop-blur-xl shadow-sm border border-slate-200/50 rounded-full transition-all duration-200 hover:bg-white hover:shadow-md ${isChatOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M22 22L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M11.5 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7 11.5H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Enhanced Chat Interface */}
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[800px] z-30 mx-auto transition-all duration-300 ${isChatOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
            {/* Chat Header */}
            <div className="px-6 h-12 flex items-center justify-between border-b border-slate-200/50 bg-white/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="font-medium text-gray-700">AI Assistant</span>
                </div>
                <div className="h-4 w-px bg-gray-200"></div>
                <div className="text-xs text-gray-500 flex items-center gap-1.5">
                  <span className="text-gray-400">Status:</span>
                  <span className="font-medium text-emerald-600">Ready</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400">Current Section:</span>
                  <span className="font-medium text-gray-700">Defining Diversity and Inclusion</span>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 hover:bg-slate-100/80 rounded-lg transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-gradient-to-b from-transparent to-white/60">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything about your document..."
                  className="w-full px-4 py-3 bg-white/90 rounded-xl text-sm placeholder-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                  <div className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-400 border border-gray-200/50">
                    ⌘ + Enter
                  </div>
                  <button className="p-1.5 hover:bg-gray-50 rounded-lg transition-all duration-200 text-gray-400 hover:text-gray-600 active:scale-95">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.5 1.5L7.5 8.5M14.5 1.5L10 14.5L7.5 8.5M14.5 1.5L1.5 6L7.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedMultiSchemaTiptapEditor

