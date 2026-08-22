import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(token: string): Socket {
  if (socket && socket.connected && (socket.auth as { token?: string })?.token === token) {
    return socket;
  }
  if (socket) {
    socket.disconnect();
  }
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
    auth: { token },
    transports: ["websocket", "polling"],
    autoConnect: true
  });
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
