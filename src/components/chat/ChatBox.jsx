import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Sparkles, X, MessageCircle } from 'lucide-react'
import Card from '../shared/Card'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
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

      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'
      const response = await fetch(`${BACKEND_URL}/api/v1/chat`, {
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
    <div className={`fixed inset-0 md:inset-4 lg:inset-8 xl:left-auto xl:right-8 xl:w-[600px] 2xl:w-[750px] z-50 ${className}`}>
      <Card padding="none" className="shadow-2xl border-2 border-purple-200 overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Asistente IA</h3>
                <p className="text-xs text-white text-opacity-80">
                  Pregunta sobre el problema actual
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 md:py-16 text-gray-500">
              <Bot size={64} className="mx-auto mb-4 text-purple-400" />
              <p className="font-bold text-xl mb-2">¡Hola! Soy tu asistente de IA</p>
              <p className="text-base mt-2 mb-6">
                Puedo ayudarte a entender este problema de ecuaciones diferenciales.
              </p>
              <div className="mt-6 text-sm text-left bg-white rounded-lg p-5 max-w-md mx-auto border border-gray-200">
                <p className="font-semibold mb-3 text-gray-700">Preguntas de ejemplo:</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>¿Qué significa esta ecuación?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>¿Cómo afectan los parámetros al resultado?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>¿Cuál es la aplicación práctica?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>¿Por qué Euler tiene más error que RK4?</span>
                  </li>
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
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] md:max-w-[80%] rounded-lg p-4 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                }`}
              >
                <div className="prose prose-sm md:prose-base max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      p: ({ children }) => <p className={`mb-3 last:mb-0 leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-gray-800'}`}>{children}</p>,
                      ul: ({ children }) => <ul className="list-disc ml-5 mb-3 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal ml-5 mb-3 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="mb-1 leading-relaxed">{children}</li>,
                      h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h3>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      blockquote: ({ children }) => (
                        <blockquote className={`border-l-4 pl-4 py-2 my-3 italic ${msg.role === 'user' ? 'border-blue-400' : 'border-purple-400 bg-purple-50'}`}>
                          {children}
                        </blockquote>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-4">
                          <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
                      tbody: ({ children }) => <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>,
                      tr: ({ children }) => <tr>{children}</tr>,
                      th: ({ children }) => (
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border border-gray-300">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-4 py-2 text-sm text-gray-700 border border-gray-300">
                          {children}
                        </td>
                      ),
                      code: ({ inline, children }) =>
                        inline ? (
                          <code className={`${msg.role === 'user' ? 'bg-blue-700 text-blue-50' : 'bg-gray-100 text-gray-800'} px-1.5 py-0.5 rounded text-sm font-mono`}>
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto my-3">
                            <code className="font-mono">{children}</code>
                          </pre>
                        ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <Loader2 size={20} className="animate-spin text-purple-600" />
                  <span className="text-sm text-gray-600">La IA está pensando...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-sm text-red-800">
              <p className="font-semibold mb-1">Error:</p>
              <p>{error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 md:p-6 bg-white border-t border-gray-200 flex-shrink-0">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta aquí... (Enter para enviar, Shift+Enter para nueva línea)"
              disabled={isLoading}
              rows={2}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm resize-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 self-end"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between mt-3">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                🗑️ Limpiar conversación
              </button>
            )}
            <div className="text-xs text-gray-400 ml-auto">
              Powered by OpenRouter AI
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
