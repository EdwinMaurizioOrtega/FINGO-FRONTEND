'use client';

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// ----------------------------------------------------------------------
const socket = io('http://localhost:3001');
const cooperativaId = 'cooperativa-1';  // Cambia esto si tienes varias cooperativas

export function CooperativaView({ title = 'Chat' }) {

  const [sessions, setSessions] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      const res = await fetch(`http://localhost:3001/sessions?cooperativa=${cooperativaId}`);
      const data = await res.json();
      setSessions(data);
    };

    fetchSessions();

    const interval = setInterval(fetchSessions, 3000); // refresca cada 3s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off('message');
  }, []);

  const entrarSala = (roomId, user) => {
    socket.emit('joinRoom', { roomId, user: 'Cooperativa' });
    setSelectedRoom(roomId);
    setSelectedUser(user);
    setMessages([]); // Opcional: puedes cargar historial si guardas en BD
  };

  const enviar = () => {
    if (!msg.trim()) return;
    socket.emit('message', {
      roomId: selectedRoom,
      content: msg,
      sender: 'Cooperativa'
    });
    setMsg('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      socket.emit('message', {

        roomId: selectedRoom,
        sender: 'Cooperativa',
        type: 'file',
        fileName: file.name,
        fileType: file.type,
        content: reader.result, // base64

      });
    };
    reader.readAsDataURL(file);
  };


  return (
    <div style={{ padding: '2rem' }}>
      <h2>Panel de {cooperativaId}</h2>

      <h4>Usuarios conectados:</h4>
      <ul>
        {sessions.map(({ roomId, user }) => (
          <li key={roomId}>
            {user} <button onClick={() => entrarSala(roomId, user)}>Chatear</button>
          </li>
        ))}
      </ul>

      {selectedRoom && (
        <>
          <h4>Chat con: {selectedUser}</h4>
          <div style={{ border: '1px solid #ccc', height: '250px', overflowY: 'scroll', padding: '1rem' }}>
            {messages.map((m, i) => (
              <div key={i}>
                <b>{m.sender}</b>:{' '}
                {m.type === 'file' ? (
                  <a href={m.content} download={m.fileName} target="_blank" rel="noopener noreferrer">
                    📎 {m.fileName}
                  </a>
                ) : (
                  m.content
                )}
              </div>
            ))}

          </div>
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Escribe un mensaje..."
          />
          <button onClick={enviar}>Enviar</button>

          <div style={{ marginTop: '1rem' }}>
            <input type="file" onChange={handleFileChange} />
          </div>
        </>
      )}
    </div>
  );

}
