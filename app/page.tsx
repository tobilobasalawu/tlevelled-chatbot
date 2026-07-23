'use client';

import { useChat} from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
   // Local state for the text box. `useChat` handles the messages themselves.
    const [input, setInput] = useState('');

    // This bridge to your /api/chat brain
    // messages = the whole conversation
    // sendMessage = function to send a message to the server
    // status = 'ready' | 'submitted' | 'streaming' | 'error'

    const { messages, sendMessage, status } = useChat();

    const isBusy = status === 'submitted' || status === 'streaming';

    return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border px-4 py-3">
        <h1 className="text-lg font-semibold">Tlevelled Assistant</h1>
        <p className="text-sm text-muted">Ask me anything about T-Levels</p>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.length === 0 && (
            <p className="text-center text-muted">
              Start by asking a question, e.g. &ldquo;What is a T-Level?&rdquo;
            </p>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
              }
            >
              <div
                className={
                  message.role === 'user'
                    ? 'max-w-[80%] rounded-2xl bg-accent-solid px-4 py-2 text-white'
                    : 'max-w-[80%] rounded-2xl border border-border bg-surface px-4 py-2'
                }
              >
                {/* A message is made of "parts". We render the text parts. */}
                {message.parts.map((part, i) =>
                  part.type === 'text' ? (
                    <span key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                      {part.text}
                    </span>
                  ) : null,
                )}
              </div>
            </div>
          ))}

          {isBusy && <p className="text-sm text-muted">Thinking...</p>}
        </div>
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;   // ignore empty sends
          sendMessage({ text: input });
          setInput('');
        }}
        className="border-t border-border p-4"
      >
        <div className="mx-auto flex max-w-2xl gap-2">
          <input
            className="flex-1 rounded-lg border border-border-strong bg-surface px-4 py-2 outline-none focus:border-accent-solid"
            value={input}
            placeholder="Ask about T-Levels..."
            onChange={(e) => setInput(e.target.value)}
            disabled={isBusy}
          />
          <button
            type="submit"
            disabled={isBusy || !input.trim()}
            className="rounded-lg bg-accent-solid px-4 py-2 font-medium text-white disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}