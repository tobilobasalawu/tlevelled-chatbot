# Tlevelled Chatbot

This is a small Next.js chat app for TLevelled. It is not a vector database or a full RAG pipeline. The app uses prompt stuffing: it loads a local knowledge blob into the system prompt, then streams answers from Anthropic Claude.

That means there is no embeddings store, no retrieval step, and no chunk ranking logic here. The model gets the knowledge directly in the prompt and answers from that context only.

## How it works

- [app/page.tsx](/Users/oluwatobisalawu/Documents/DATA/tlevelled-chatbot/app/page.tsx) renders the chat UI and uses `useChat` to send and receive messages.
- [app/api/chat/route.ts](/Users/oluwatobisalawu/Documents/DATA/tlevelled-chatbot/app/api/chat/route.ts) receives the full conversation, injects the knowledge blob into the system prompt, and streams the model response back to the browser.
- [app/knowledge.ts](/Users/oluwatobisalawu/Documents/DATA/tlevelled-chatbot/app/knowledge.ts) is the local knowledge source. It is ignored by git on purpose, so each clone can keep its own private content.

In other words, the knowledge file is the app's source of truth, and the route simply packages it into the prompt. If you want true RAG later, you would add document chunking, embeddings, a retrieval layer, and a vector store instead of this direct prompt approach.

## Setup

1. Install dependencies with `npm install`.
2. Create [`.env.local`](/Users/oluwatobisalawu/Documents/DATA/tlevelled-chatbot/.env.local) with your Anthropic API key.
3. Create your own local knowledge file at [app/knowledge.js](/Users/oluwatobisalawu/Documents/DATA/tlevelled-chatbot/app/knowledge.js) or [app/knowledge.ts](/Users/oluwatobisalawu/Documents/DATA/tlevelled-chatbot/app/knowledge.ts) and export `TLEVEL_KNOWLEDGE`.
4. Start the app with `npm run dev`.

Example knowledge file:

```js
export const TLEVEL_KNOWLEDGE = `Your private course data here`;
```

## Notes

- The assistant is instructed to answer only from the local knowledge content.
- If the answer is not in that knowledge, it should say it does not know and point people back to TLevelled.
- Keep the knowledge file out of git. That is why the repo ignores the local export.