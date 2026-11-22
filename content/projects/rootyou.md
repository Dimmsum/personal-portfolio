---
title: RootYou
year: 2026
type: AI
status: In progress
featured: true
order: 1
tags: [macOS, Tauri v2, TypeScript, Node.js, Claude, MCP]
blurb: A desktop AI buddy for macOS. Press a hotkey, ask out loud, and it briefs you from your email, calendar, meetings and code.
images: []
link: ""
repo: ""
---

RootYou is an animated buddy that lives on your Mac. Hold a hotkey, ask a question, and it answers from your own streams: Gmail, Google Calendar, Drive and Docs, Granola meeting notes, GitHub and Vercel, plus general chat and web search.

It can also act for you. Ask it to book or move a meeting and it shows a confirm card first, then does it.

## How it's built

- **Desktop shell:** Tauri v2 with a shared web UI, macOS first.
- **Backend:** hosted TypeScript/Node service, so future Windows and mobile clients reuse it.
- **Connectors:** each data source plugs in through an MCP server.
- **AI:** Anthropic's Claude.
- **Auth:** Clerk.
- **Character:** its own pixel-sprite design system with 8 base models, 16 faces and 6 palettes. The buddy wanders the screen and can be dragged and poked.

Built solo, test-first, as a product for my own software company.
