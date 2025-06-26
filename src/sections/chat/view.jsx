'use client';

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

export function ChatView() {
  const [user, setUser] = useState('');
  const [cooperativa, setCooperativa] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off('message');
  }, []);

  const joinRoom = () => {
    if (!user || !cooperativa) return alert("Completa tu nombre y selecciona una cooperativa.");
    const room = `${cooperativa}_${user}`;
    setRoomId(room);
    socket.emit('joinRoom', { roomId: room, user, cooperativa });
    setJoined(true);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit('message', { roomId, content: message, sender: user, type: 'text' });
    setMessage('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      socket.emit('message', {
        roomId,
        sender: user,
        type: 'file',
        fileName: file.name,
        fileType: file.type,
        content: reader.result, // base64 string
      });
    };
    reader.readAsDataURL(file);
  };


  return (
    <div style={{ padding: '2rem' }}>
      <h2>Chat Cooperativas</h2>

      {!joined ? (
        <>
          <input
            placeholder="Tu nombre"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          /><br /><br />
          <select onChange={(e) => setCooperativa(e.target.value)} defaultValue="">
            <option value="" disabled>Selecciona una cooperativa</option>
            <option value="cooperativa-1">Cooperativa 1</option>
            <option value="cooperativa-2">Cooperativa 2</option>
          </select><br /><br />
          <button onClick={joinRoom}>Iniciar Chat</button>
        </>
      ) : (
        <>
          <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', padding: '1rem' }}>
            {messages.map((msg, idx) => (
              <div key={idx}>
                <b>{msg.sender}:</b>{' '}
                {msg.type === 'file' ? (
                  <a href={msg.content} download={msg.fileName} target="_blank" rel="noopener noreferrer">
                    📎 {msg.fileName}
                  </a>
                ) : (
                  msg.content
                )}
              </div>
            ))}
          </div><br />

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
          />
          <button onClick={sendMessage}>Enviar</button>

          <div style={{ marginTop: '1rem' }}>
            <input type="file" onChange={handleFileChange} />
          </div>
        </>
      )}
    </div>
  );
}
