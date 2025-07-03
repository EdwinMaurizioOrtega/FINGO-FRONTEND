'use client';

import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';

const socket = io(process.env.NEXT_PUBLIC_SERVER_SOCKET);

const cooperativaId = 'Cooperativa Caja';

export function CooperativaView({ title = 'Chat' }) {
  const [sessions, setSessions] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SOCKET}/sessions?cooperativa=${cooperativaId}`);
      const data = await res.json();
      setSessions(data);
    };

    fetchSessions();
    const interval = setInterval(fetchSessions, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off('message');
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const entrarSala = (roomId, user) => {
    socket.emit('joinRoom', { roomId, user: 'Cooperativa' });
    setSelectedRoom(roomId);
    setSelectedUser(user);
    setMessages([]);
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
        content: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Panel izquierdo: usuarios conectados */}
      <Box sx={{ width: 300, borderRight: '1px solid #ddd', p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Usuarios conectados
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <List>
          {sessions.map(({ roomId, user }) => (
            <ListItem key={roomId} disablePadding>
              <ListItemButton onClick={() => entrarSala(roomId, user)} selected={roomId === selectedRoom}>
                <ListItemText primary={user} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Panel derecho: chat */}
      <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', height: '80vh' }}>
        <Typography variant="h5" gutterBottom>
          Panel de {cooperativaId}
        </Typography>

        {selectedRoom ? (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Chat con: {selectedUser}
            </Typography>

            <Paper
              elevation={3}
              sx={{ flexGrow: 1, overflowY: 'auto', p: 2, mb: 2 }}
            >
              {messages.map((m, i) => (
                <Box key={i} sx={{ mb: 1 }}>
                  <strong>{m.sender}:</strong>{' '}
                  {m.type === 'file' ? (
                    <a
                      href={m.content}
                      download={m.fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📎 {m.fileName}
                    </a>
                  ) : (
                    m.content
                  )}
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Paper>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && enviar()}
                placeholder="Escribe un mensaje..."
              />
              <Button variant="contained" onClick={enviar} disabled={!msg.trim()}>
                Enviar
              </Button>
              <Button variant="outlined" component="label">
                Subir archivo
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="h6" color="text.secondary" sx={{ mt: 4 }}>
            Selecciona un usuario para iniciar el chat.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
