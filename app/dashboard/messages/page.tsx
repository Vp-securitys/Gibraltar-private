"use client"

import { useState, useEffect, type FormEvent } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Send, X, MessageSquare, Clock, ChevronDown, User, Phone, HelpCircle, Shield, Headset, AlertCircle, FileText, Mail } from "lucide-react"

// Define message types
type MessageSenderType = "User" | "Support"

interface Message {
  id: string
  user_id: string
  subject: string
  body: string
  sender_type: MessageSenderType
  sent_at: string
  is_read: boolean
}

// Renamed from COMMON_QUESTIONS to QUICK_ASSISTANCE
const QUICK_ASSISTANCE = [
  {
    id: "qa-1",
    subject: "Pending Mobile Deposit",
    question: "Why is my mobile deposit still pending?",
    answer:
      "Mobile check deposits with Gibraltar are typically processed within 1 business day. However, some deposits may take longer depending on the time of submission, check amount, and account history. If your deposit is still pending after 24 hours, check for email updates or contact Gibraltar customer service at 1-800-935-9935."
  },
  {
    id: "qa-2",
    subject: "Wire Transfer Timing",
    question: "How long does a wire transfer take with Gibraltar?",
    answer:
      "Domestic wire transfers are typically completed the same business day if submitted before the cut-off time (4 PM ET). International wires may take 1-5 business days depending on the recipient's bank and country. Gibraltar provides tracking for wire transfers in your online banking portal under 'Account Activity.'"
  },
  {
    id: "qa-3",
    subject: "Bank Statement Access",
    question: "How do I view or download my Gibraltar bank statements?",
    answer:
      "To access your statements:\n\n1. Log in to the Gibraltar Mobile App or online at Gibraltar.com\n2. Select your account\n3. Click on 'Download' Transaction history \n\nYou can access up to 7 years of past statements."
  },
  {
    id: "qa-4",
    subject: "Transaction Dispute",
    question: "How do I dispute a charge on my Gibraltar account?",
    answer:
      "To dispute a charge:\n\n1. Log in to your Gibraltar account\n2. Go to the transaction in question\n3. Click 'Messages' and follow the prompts\n\nAlternatively, you can call Gibraltar customer service or visit a local branch. Most disputes are resolved within 10 business days."
  },
  {
    id: "qa-5",
    subject: "ATM Withdrawal Limit",
    question: "What is my daily ATM withdrawal limit with Gibraltar?",
    answer:
      "Gibraltar ATM withdrawal limits vary based on your account type:\n\n- Gibraltar Total Checking: Up to $500/day\n- Gibraltar Premier Plus Checking: Up to $1,000/day\n- Gibraltar Private Client: Higher limits may apply\n\nYou can view or request a limit increase by calling Gibraltar support or visiting a branch."
  },
  {
    id: "qa-7",
    subject: "Direct Deposit Setup",
    question: "How do I set up direct deposit with Gibraltar?",
    answer:
      "To set up direct deposit:\n\n1. Log in to your Gibraltar account\n2. You'll need your Gibraltar routing number and account number, which are both available in your online banking profile."
  },
  {
    id: "qa-8",
    subject: "Overdraft Protection",
    question: "Does Gibraltar offer overdraft protection?",
    answer:
      "Yes, Gibraltar offers overdraft protection by linking a savings account or credit card to your checking account. You can enroll in overdraft services via the Gibraltar app or website. Standard overdraft fees apply unless you opt out of coverage for certain transactions."
  }
];

const CONTACT_OPTIONS = [
  { 
    title: "Email Us", 
    description: "Speak with a representative",
    icon: <Mail size={24} className="text-yellow-700" />,
    detail: "contact@gibraltar.com"
  },
  { 
    title: "Call Us", 
    description: "Speak with a representative",
    icon: <Phone size={24} className="text-yellow-700" />,
    detail: "1-800-935-9935 (24/7)"
  },
  { 
    title: "Secure Message", 
    description: "Write to us securely",
    icon: <Shield size={24} className="text-yellow-700" />,
    detail: "1-2 business day response"
  },
  { 
    title: "Schedule Appointment", 
    description: "Visit your local branch",
    icon: <Clock size={24} className="text-yellow-700" />,
    detail: "Book a time that works for you"
  }
];

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36)

export default function Messages() {
  const { user, profile } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [chatOpen, setChatOpen] = useState(true)
  const [typingText, setTypingText] = useState("")
  const [typingQueue, setTypingQueue] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [selectedView, setSelectedView] = useState<'quickHelp' | 'chat'>('quickHelp')
  const [messageCount, setMessageCount] = useState(0)
  const MAX_MESSAGES = 20

  // Initialize with welcome message
  useEffect(() => {
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: generateId(),
        user_id: profile?.id || "guest",
        subject: "Welcome to Support",
        body: "Hello! I'm Sarah from Gibraltar Support. Please select a topic below for immediate assistance, or type your question for personalized help.",
        sender_type: "Support",
        sent_at: new Date().toISOString(),
        is_read: true
      }
      setMessages([welcomeMessage])
      setMessageCount(1)
      setLoading(false)
    }, 800)
  }, [profile])

  // Handle typing animation effect
  useEffect(() => {
    if (typingQueue) {
      let index = 0
      setTypingText("")
      const interval = setInterval(() => {
        setTypingText(prev => prev + typingQueue.charAt(index))
        index++
        if (index >= typingQueue.length) {
          clearInterval(interval)
          setTypingQueue(null)
        }
      }, 15)
      return () => clearInterval(interval)
    }
  }, [typingQueue])

  // Format time for messages
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const scrollToBottom = () => {
    const chatContainer = document.getElementById("chat-messages")
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }

  // Add useEffect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleQuickAssistanceClick = (question: typeof QUICK_ASSISTANCE[0]) => {
    if (messageCount >= MAX_MESSAGES) {
      setError(`You've reached the maximum message limit (${MAX_MESSAGES}). Please start a new chat.`)
      return
    }
    
    const userMessage: Message = {
      id: generateId(),
      user_id: user?.id || "guest",
      subject: question.subject,
      body: question.question,
      sender_type: "User",
      sent_at: new Date().toISOString(),
      is_read: true
    }
    setMessages(prev => [...prev, userMessage])
    setMessageCount(prev => prev + 1)
    
    // Switch to chat view
    setSelectedView('chat')
    
    // Show typing indicator
    setTimeout(() => {
      const supportMessage: Message = {
        id: generateId(),
        user_id: user?.id || "guest",
        subject: `Re: ${question.subject}`,
        body: question.answer,
        sender_type: "Support",
        sent_at: new Date().toISOString(),
        is_read: true
      }
      setMessages(prev => [...prev, supportMessage])
      setMessageCount(prev => prev + 1)
      setTypingQueue(question.answer)
    }, 1000)
  }

  const handleSendMessage = (e?: FormEvent) => {
    if (e) e.preventDefault()
    
    if (!messageInput.trim()) return
    
    if (messageCount >= MAX_MESSAGES) {
      setError(`You've reached the maximum message limit (${MAX_MESSAGES}). Please start a new chat.`)
      return
    }
    
    setSending(true)
    setError("")
    
    try {
      const userMessage: Message = {
        id: generateId(),
        user_id: user?.id || "guest",
        subject: "Customer Inquiry",
        body: messageInput,
        sender_type: "User",
        sent_at: new Date().toISOString(),
        is_read: true
      }
      
      setMessages(prev => [...prev, userMessage])
      setMessageCount(prev => prev + 1)
      setMessageInput("")
      
      // Simulate response
      setTimeout(() => {
        const body = `Thank you for your message. A Gibraltar representative will respond shortly. For reference, your support ticket is #${Math.floor(10000 + Math.random() * 90000)}.`
        
        const supportMessage: Message = {
          id: generateId(),
          user_id: user?.id || "guest",
          subject: "Re: Customer Inquiry",
          body,
          sender_type: "Support",
          sent_at: new Date().toISOString(),
          is_read: true
        }
        
        setMessages(prev => [...prev, supportMessage])
        setMessageCount(prev => prev + 1)
        setTypingQueue(body)
      }, 1500)
      
    } catch (err: any) {
      setError(err.message || "Error occurred")
    } finally {
      setSending(false)
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const startNewChat = () => {
    setMessages([])
    setMessageCount(0)
    setSelectedView('quickHelp')
    setError("")
    
    // Recreate welcome message
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: generateId(),
        user_id: profile?.id || "guest",
        subject: "Welcome to Support",
        body: "Hello! I'm Sarah from Gibraltar Support. Please select a topic below for immediate assistance, or type your question for personalized help.",
        sender_type: "Support",
        sent_at: new Date().toISOString(),
        is_read: true
      }
      setMessages([welcomeMessage])
      setMessageCount(1)
    }, 300)
  }

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-4">
      {/* Main chat container */}
      <div className="w-full md:w-2/3 h-[600px] flex flex-col">
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 flex flex-col h-full">
          {/* Chat header */}
          <div className="bg-yellow-800 text-white px-4 py-3 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center">
              <div className="bg-yellow-600 p-2 rounded-full mr-3">
                <Headset size={20} />
              </div>
              <div>
                <h2 className="font-semibold">Live Banking Support</h2>
                <div className="flex items-center text-xs text-yellow-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  <span>Support available 24/7</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={startNewChat}
                className="text-xs bg-yellow-700 hover:bg-yellow-600 px-3 py-1 rounded-full">
                New Chat
              </button>
              <button 
                onClick={() => setChatOpen(false)} 
                className="p-1 hover:bg-yellow-700 rounded-full">
                <X size={18} />
              </button>
            </div>
          </div>
          
          {/* View selector */}
          <div className="bg-gray-100 flex border-b border-gray-200">
            <button 
              onClick={() => setSelectedView('quickHelp')}
              className={`flex-1 py-3 text-sm font-medium ${selectedView === 'quickHelp' ? 'text-yellow-800 border-b-2 border-yellow-800' : 'text-gray-500 hover:text-gray-700'}`}>
              Quick Assistance
            </button>
            <button 
              onClick={() => setSelectedView('chat')}
              className={`flex-1 py-3 text-sm font-medium ${selectedView === 'chat' ? 'text-yellow-800 border-b-2 border-yellow-800' : 'text-gray-500 hover:text-gray-700'}`}>
              Chat History
            </button>
          </div>
          
          {/* Content area */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {selectedView === 'quickHelp' && (
              <div className="p-4 space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-4">
                  <h3 className="font-medium text-yellow-800">Get Instant Answers</h3>
                  <p className="text-sm text-gray-600">Select from the common topics below for immediate assistance, or switch to Chat to type your specific question.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {QUICK_ASSISTANCE.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => handleQuickAssistanceClick(q)}
                      className="flex items-start text-left p-3 bg-white hover:bg-yellow-50 border border-gray-200 rounded-lg transition-colors group">
                      <div className="mr-3 p-1 rounded-full bg-yellow-100 group-hover:bg-yellow-200">
                        <HelpCircle size={18} className="text-yellow-700" />
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-800 group-hover:text-yellow-900">{q.question}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Select for immediate answer</p>
                      </div>
                      <div className="ml-auto text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronDown size={16} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {selectedView === 'chat' && (
              <div id="chat-messages" className="p-4 space-y-4">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-pulse flex space-x-1">
                      <div className="h-2 w-2 bg-yellow-800 rounded-full"></div>
                      <div className="h-2 w-2 bg-yellow-800 rounded-full"></div>
                      <div className="h-2 w-2 bg-yellow-800 rounded-full"></div>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={msg.id} className={`flex ${msg.sender_type === 'User' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${msg.sender_type === 'User' ? 'bg-yellow-600 text-white' : 'bg-white border border-gray-200'} rounded-lg px-4 py-2 shadow-sm`}>
                        {msg.sender_type === 'Support' && (
                          <div className="flex items-center space-x-1 mb-1">
                            <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                              <User size={14} className="text-yellow-800" />
                            </div>
                            <span className="text-xs font-semibold text-yellow-800">Gibraltar Support</span>
                          </div>
                        )}
                        <p className={`text-sm whitespace-pre-line ${msg.sender_type === 'Support' ? 'text-gray-800' : ''}`}>
                          {msg.sender_type === 'Support' && typingQueue && msg.body === typingQueue ? typingText : msg.body}
                        </p>
                        <p className={`text-xs ${msg.sender_type === 'User' ? 'text-yellow-100' : 'text-gray-400'} text-right mt-1 flex justify-end items-center`}>
                          <Clock size={10} className="mr-1" />
                          {formatMessageTime(msg.sent_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                
                {typingQueue && (
                  <div className="flex items-center space-x-1 text-gray-500 text-sm">
                    <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                      <User size={14} className="text-yellow-800" />
                    </div>
                    <span>Gibraltar Support is typing</span>
                    <div className="animate-pulse flex space-x-1">
                      <div className="h-1 w-1 bg-gray-500 rounded-full"></div>
                      <div className="h-1 w-1 bg-gray-500 rounded-full"></div>
                      <div className="h-1 w-1 bg-gray-500 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Message input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white flex items-end">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your specific question here..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none text-sm"
              rows={1}
            />
            <button
              type="submit"
              disabled={sending || !messageInput.trim() || messageCount >= MAX_MESSAGES}
              className="ml-2 bg-yellow-600 text-white p-2 rounded-full hover:bg-yellow-700 disabled:opacity-50 disabled:hover:bg-yellow-600 flex-shrink-0 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
          
          {error && (
            <div className="bg-red-50 border-t border-red-200 p-2 text-sm text-red-700 text-center flex items-center justify-center">
              <AlertCircle size={14} className="mr-1" /> {error}
            </div>
          )}
          
          {/* Footer */}
          <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-200 rounded-b-lg flex items-center justify-center">
            <Shield size={12} className="mr-1" /> Your chat is secure and encrypted. Message {messageCount}/{MAX_MESSAGES}
          </div>
        </div>
      </div>
      
      {/* Additional content/sidebar */}
      <div className="w-full md:w-1/3 space-y-4">
        {/* Contact options */}
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-yellow-800 text-white px-4 py-3">
            <h2 className="font-semibold">Additional Support Options</h2>
          </div>
          <div className="p-4 space-y-3">
            {CONTACT_OPTIONS.map((option, index) => (
              <div key={index} className="bg-white p-4 border border-gray-200 rounded-lg hover:border-yellow-300 transition-colors">
                <div className="flex items-center">
                  <div className="mr-3">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{option.title}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                    <p className="text-xs text-yellow-700 mt-1">{option.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Important information */}
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-yellow-800 text-white px-4 py-3">
            <h2 className="font-semibold">Important Information</h2>
          </div>
          <div className="p-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Our systems will be under maintenance from 2-4 AM EST on Sunday, May 5th. Online banking may be unavailable during this time.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <FileText size={20} className="text-yellow-700 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Security Center</h3>
                <p className="text-xs text-gray-600">Learn how to protect your account from fraud and scams</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}