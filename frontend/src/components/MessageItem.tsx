import { BotMessageSquare } from 'lucide-react'
import type { Message } from '../types/message'

export const MessageItem = ({ message }: { message: Message }) => {
  return (
    <>
      {message.sender === 'bot' && (
        <div className="flex gap-2" key={message.id}>
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-2">
            <BotMessageSquare />
          </div>
          <div className="flex flex-col gap-1 max-w-[80%]">
            <div className="flex gap-2 items-center">
              FAQBot{' '}
              <span className="text-gray-400 text-xs">
                {message?.date?.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className={`rounded-lg px-4 py-2 bg-gray-700 self-start`}>
              {message.text}
            </div>
          </div>
        </div>
      )}
      {message.sender === 'user' && (
        <div className="flex flex-col items-end gap-2" key={message.id}>
          <span className="text-gray-400 text-xs">
            {message?.date?.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <div
            className={`max-w-[80%] rounded-lg px-4 py-2 bg-blue-600 self-end`}
          >
            {message.text}
          </div>
        </div>
      )}
    </>
  )
}
