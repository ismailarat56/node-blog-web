const channel = new BroadcastChannel("node-blog.session");

export function announceSession(type) {
  channel.postMessage(type);
}

export function listenSession(listener) {
  function handleMessage(event) {
    listener(event.data);
  }

  channel.addEventListener("message", handleMessage);

  return () => {
    channel.removeEventListener("message", handleMessage);
  };
}
