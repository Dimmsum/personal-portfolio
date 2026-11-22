---
title: What an API actually is, for first-years
date: "2026-10-12"
tag: Learning
excerpt: Requests, responses and why every app you use depends on them.
---

Sample post. Replace this with your own writing.

An API is a contract: one program asks for something in an agreed format, another answers in an agreed format.

```js
const res = await fetch("https://api.github.com/users/Dimmsum");
const user = await res.json();
```

Add your own example from a project you built.
