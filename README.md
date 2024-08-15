# 💬 NTFY Chat UI

Simple chat with NTFY backend

- [DEMO](https://aitelierhub.github.io/ntfy-chat/)


### URL Params
The following URL parameters are available to configure the widget:

- `username`
  * Example `?username=jack`
- `room`
  * Example `?room=myuniqueroomid100`
- `title`
  * Example `?title=Room100`


### Embedding
You can embed the chat widget on any page using the following example:

```
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.jsdelivr.net/gh/aitelierhub/ntfy-chat@main/minichat.js"
          data-username="you"
          data-room="myuniqueroomid100"
          data-title="Room 100" defer>
  </script>
</head>
```
