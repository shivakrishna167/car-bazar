'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Mic, Sparkles, User, Bot, Loader2, Volume2 } from 'lucide-react'

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
    { role: 'assistant', text: 'Hello! I am your Friends Car Baazr assistant. How can I help you find your dream vehicle today?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const [currentLang, setCurrentLang] = useState<'en' | 'te'>('en')
  const [mounted, setMounted] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Pre-load voices
  useEffect(() => {
    setMounted(true)
    const loadVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.getVoices()
      }
    }
    loadVoices()
    if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  const quickActions = [
    { label: '🚗 Show Cars', query: 'Show me all cars' },
    { label: '🏍️ Show Bikes', query: 'Show me all bikes' },
    { label: '📍 Location', query: 'Where is your showroom?' },
    { label: '📞 Call Us', query: 'Contact number' },
    { label: 'తెలుగులో', query: 'మాట్లాడు' }
  ]

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    setMessages(prev => [...prev, { role: 'user', text: messageText }])
    setInput('')
    setIsTyping(true)

    // Simulate AI Response
    setTimeout(() => {
      const lowerText = messageText.toLowerCase()
      
      const hasTeluguChars = /[\u0C00-\u0C7F]/.test(messageText)
      const wantsTelugu = lowerText.includes('తెలుగు') || lowerText.includes('telugu') || lowerText.includes('matladu') || lowerText.includes('మాట్లాడు') || lowerText.includes('naku') || lowerText.includes('chupinchu')
      if (hasTeluguChars || wantsTelugu) {
        setCurrentLang('te')
      }
      const isTelugu = currentLang === 'te' || hasTeluguChars || wantsTelugu

      const isCarIntent = lowerText.includes('car') || lowerText.includes('కార్') || lowerText.includes('carla')
      const isBikeIntent = lowerText.includes('bike') || lowerText.includes('బైక్')
      const isShowIntent = lowerText.includes('show') || lowerText.includes('chupinchu') || lowerText.includes('చూపించు') || lowerText.includes('all') || lowerText.includes('inventory') || lowerText.includes('list')
      const isLocationIntent = lowerText.includes('location') || lowerText.includes('where') || lowerText.includes('ఎక్కడ') || lowerText.includes('address') || lowerText.includes('ekada') || lowerText.includes('akkada')
      const isPhoneIntent = lowerText.includes('phone') || lowerText.includes('number') || lowerText.includes('call') || lowerText.includes('contact') || lowerText.includes('ఫోన్') || lowerText.includes('నెంబర్')
      const isLoanIntent = lowerText.includes('loan') || lowerText.includes('finance') || lowerText.includes('emi') || lowerText.includes('లోన్') || lowerText.includes('ఫైనాన్స్')
      const isTimeIntent = lowerText.includes('time') || lowerText.includes('open') || lowerText.includes('close') || lowerText.includes('hours') || lowerText.includes('సమయం')
      const isOwnerIntent = lowerText.includes('owner') || lowerText.includes('founder') || lowerText.includes('younus') || lowerText.includes('satyanarayana') || lowerText.includes('ఓనర్')
      const isGreetingIntent = lowerText === 'hi' || lowerText.includes('hello') || lowerText.includes('hey') || lowerText.includes('namaste') || lowerText.includes('హాయ్') || lowerText.includes('నమస్తే')

      let response = ""
      let voiceResponse = ""
      let shouldNavigate = false
      let navType = 'car'

      if (isLocationIntent) {
        if (isTelugu) {
          response = "మేము ఖమ్మం కొత్త బస్టాండ్ దగ్గర, బైపాస్ రోడ్, RR పబ్లిక్ స్కూల్ పక్కన ఉన్నాము."
        } else {
          response = "We are located Near Kottha Busstand, RR Public School Beside, Bypass Road, Khammam, Telangana."
        }
        voiceResponse = response
      } else if (isPhoneIntent) {
        if (isTelugu) {
          response = "మీరు మమ్మల్ని 9849575114 లేదా 9949904505 నంబర్లలో సంప్రదించవచ్చు."
        } else {
          response = "You can contact us at +91 9849575114 or +91 9949904505. We are always happy to help!"
        }
        voiceResponse = response
      } else if (isLoanIntent) {
        if (isTelugu) {
          response = "అవును! మేము సులభమైన ఫైనాన్స్ మరియు EMI సౌకర్యాలను అందిస్తున్నాము. డాక్యుమెంట్లు ఇస్తే, అదే రోజు అప్రూవల్ వస్తుంది."
        } else {
          response = "Yes! We provide easy finance and EMI options with instant approval. Just bring your documents!"
        }
        voiceResponse = response
      } else if (isTimeIntent) {
        if (isTelugu) {
          response = "మా షోరూమ్ ఉదయం 9 గంటల నుండి సాయంత్రం 8 గంటల వరకు తెరిచి ఉంటుంది. అన్ని రోజులు పని చేస్తాము."
        } else {
          response = "Our showroom is open every day from 9:00 AM to 8:00 PM."
        }
        voiceResponse = response
      } else if (isOwnerIntent) {
        if (isTelugu) {
          response = "ఫ్రెండ్స్ కార్ బజార్ ను సయ్యద్ యూనుస్ మరియు పి. సత్యనారాయణ గారు నడుపుతున్నారు. వారికి 20 సంవత్సరాల అనుభవం ఉంది."
        } else {
          response = "Friends Car Bazar is co-founded and managed by Syed Younus and P. Satyanarayana, who have over 20 years of experience."
        }
        voiceResponse = response
      } else if (isCarIntent) {
        shouldNavigate = true
        navType = 'car'
        if (isTelugu) {
          response = "తప్పకుండా! మా వద్ద ఉన్న కార్లన్నీ మీకు చూపిస్తున్నాను."
        } else {
          response = "Sure! I am opening the car inventory for you. Showing all available cars now."
        }
        voiceResponse = response
      } else if (isBikeIntent) {
        shouldNavigate = true
        navType = 'bike'
        if (isTelugu) {
          response = "తప్పకుండా! మా వద్ద ఉన్న బైక్లన్నీ మీకు చూపిస్తున్నాను."
        } else {
          response = "Absolutely! Here is our full bike collection. Showing all available bikes now."
        }
        voiceResponse = response
      } else if (isGreetingIntent) {
        if (isTelugu) {
           response = "నమస్కారం! మీరు కార్లు/బైక్ ల కోసం వెతుకుతున్నారా? ఫైనాన్స్ కావాలా? లేదా అడ్రస్ తెలుసుకోవాలా? మీరు నన్ను ఏమైనా అడగవచ్చు!"
        } else {
           response = "Hello! I can help you find cars, bikes, provide contact numbers, or explain our loan options. What do you need help with?"
        }
        voiceResponse = response
      } else {
        if (isTelugu) {
           response = "క్షమించండి, నాకు అర్థం కాలేదు. దయచేసి మళ్ళీ చెప్పండి."
        } else {
           response = "I didn't quite catch that. Could you please tell me again?"
        }
        voiceResponse = response
      }

      setMessages(prev => [...prev, { role: 'assistant', text: response }])
      setIsTyping(false)

      if (isVoiceEnabled) {
        speak(voiceResponse)
      }

      if (shouldNavigate) {
        setTimeout(() => {
          window.location.href = `/listings?type=${navType}`
        }, 2000)
      }
    }, 1500)
  }

  const speak = (text: string) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()

    const startSpeaking = () => {
      const utterance = new SpeechSynthesisUtterance(text)
      const isTelugu = /[\u0C00-\u0C7F]/.test(text)

      const voices = window.speechSynthesis.getVoices()
      const teluguVoice = voices.find(v => v.lang.startsWith('te'))
      const indianVoice = voices.find(v => v.lang.includes('IN'))

      if (isTelugu) {
        utterance.lang = 'te-IN'
        if (teluguVoice) utterance.voice = teluguVoice
      } else {
        utterance.lang = 'en-IN'
        if (indianVoice) utterance.voice = indianVoice
      }

      utterance.rate = isTelugu ? 0.8 : 1.0
      utterance.pitch = 1.0
      window.speechSynthesis.speak(utterance)
    }

    // Wait for voices to load if list is empty
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => startSpeaking()
    } else {
      startSpeaking()
    }
  }

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.")
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = currentLang === 'te' ? 'te-IN' : 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript
      handleSend(speechToText)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      
      let errorMsg = currentLang === 'te' 
        ? "మీ వాయిస్ నాకు సరిగ్గా వినిపించలేదు. దయచేసి మళ్ళీ చెప్పండి." 
        : "I couldn't hear your voice clearly. Please tell me again."
        
      setMessages(prev => [...prev, { role: 'assistant', text: errorMsg }])
      if (isVoiceEnabled) {
        speak(errorMsg)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  if (!mounted) return null;

  return (
    <>
      {/* Floating Bubble */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 md:bottom-8 right-4 md:right-8 z-[80] bg-primary text-secondary p-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-secondary/10 group"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap text-sm">
          Ask Assistant
        </span>
        <div className="relative">
          <MessageSquare className="group-hover:scale-110 transition-transform" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-primary"
          />
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-40 md:bottom-28 right-4 md:right-8 z-[70] w-[92vw] md:w-96 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden max-h-[60vh] md:max-h-[70vh]"
          >
            {/* Header */}
            <div className="bg-secondary p-6 text-white flex justify-between items-center border-b-4 border-primary">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-xl text-secondary">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-black tracking-tight text-sm uppercase">AI Assistant</h3>
                  <p className="text-[10px] text-primary font-bold tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> {currentLang === 'en' ? 'ENGLISH' : 'తెలుగు'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const newMode = !isVoiceEnabled
                    setIsVoiceEnabled(newMode)
                    if (newMode) {
                      const welcomeText = currentLang === 'te' ? "వాయిస్ ప్రారంభించబడింది" : "Voice assistant enabled"
                      speak(welcomeText)
                    } else {
                      window.speechSynthesis.cancel()
                    }
                  }}
                  className={`p-2 rounded-full transition-all ${isVoiceEnabled ? 'bg-primary text-secondary shadow-lg' : 'hover:bg-white/10 text-white/50'}`}
                  title={isVoiceEnabled ? "Mute Assistant" : "Unmute Assistant"}
                >
                  <Volume2 size={20} />
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              {messages.map((m, i) => (
                <motion.div
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-semibold leading-relaxed ${m.role === 'user'
                      ? 'bg-primary text-secondary rounded-tr-none shadow-md'
                      : 'bg-white text-secondary border border-gray-100 rounded-tl-none shadow-sm'
                    }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Actions */}
            {!isTyping && (
              <div className="px-4 pb-2 bg-white overflow-x-auto no-scrollbar">
                <div className="flex gap-2 whitespace-nowrap py-2">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(action.query)}
                      className="bg-gray-100 hover:bg-primary hover:text-secondary text-gray-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-gray-200 shadow-sm"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full bg-gray-50 border border-gray-200 p-4 pr-24 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-xs font-bold"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    onClick={toggleListening}
                    className={`p-2 rounded-lg transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-primary'}`}
                  >
                    <Mic size={18} />
                  </button>
                  <button
                    onClick={() => handleSend()}
                    className="bg-secondary text-white p-2 rounded-lg hover:bg-black transition-all"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
