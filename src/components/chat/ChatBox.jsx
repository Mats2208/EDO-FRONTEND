import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Sparkles, X, MessageCircle } from 'lucide-react'
import Card from '../shared/Card'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

/**
 * Componente de chat con IA para hacer preguntas sobre el problema
 */
export default function ChatBox({ problemContext, parameters, className = '' }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll al final cuando hay nuevos mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus en input cuando se abre el chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setError(null)

    // Agregar mensaje del usuario al historial
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      // Preparar el request para el backend
      const requestBody = {
        message: userMessage,
        problem_context: problemContext,
        parameters: parameters,
        history: messages // historial previo (sin el mensaje actual)
      }

      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (data.success) {
        // Agregar respuesta de la IA al historial
        setMessages([...newMessages, { role: 'assistant', content: data.response }])
      } else {
        setError(data.error || 'Error al obtener respuesta')
      }
    } catch (err) {
      setError('Error de conexión con el servidor. Asegúrate de que el backend esté corriendo.')
      console.error('Error sending message:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    setError(null)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group z-50 ${className}`}
      >
        <MessageCircle size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          Pregunta a la IA
        </span>
        <Sparkles size={16} className="animate-pulse" />
      </button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 z-50 ${className}`}>
      <Card padding="none" className="shadow-2xl border-2 border-purple-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold">Asistente IA</h3>
                <p className="text-xs text-white text-opacity-80">
                  Pregunta sobre el problema
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Bot size={48} className="mx-auto mb-3 text-purple-400" />
              <p className="font-medium">¡Hola! Soy tu asistente de IA</p>
              <p className="text-sm mt-2">
                Puedo ayudarte a entender este problema de ecuaciones diferenciales.
              </p>
              <div className="mt-4 text-xs text-left bg-white rounded-lg p-3 max-w-xs mx-auto">
                <p className="font-semibold mb-2">Preguntas de ejemplo:</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• ¿Qué significa esta ecuación?</li>
                  <li>• ¿Cómo afectan los parámetros?</li>
                  <li>• ¿Cuál es la aplicación práctica?</li>
                </ul>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
              )}

              <div
                className={`max-w-[75%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <div className="text-sm prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      code: ({ inline, children }) =>
                        inline ? (
                          <code className={`${msg.role === 'user' ? 'bg-blue-700' : 'bg-gray-100'} px-1 rounded text-xs`}>
                            {children}
                          </code>
                        ) : (
                          <code className="block bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                            {children}
                          </code>
                        ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <Loader2 size={20} className="animate-spin text-purple-600" />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-xs text-gray-500 hover:text-gray-700 mt-2 transition-colors"
            >
              Limpiar conversación
            </button>
          )}
        </div>
      </Card>
    </div>
  )
}
