'use client';

import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { useAuthContext } from '../../auth/hooks';

const socket = io('http://localhost:3001');

const COOPERATIVAS = ['Cooperativa Caja'];

export function ChatView() {
  const { user } = useAuthContext();

  console.log(user);

  const [cooperativa, setCooperativa] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off('message');
  }, []);

  useEffect(() => {
    // Auto-scroll al último mensaje
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinRoom = (coop) => {
    if (!user) {
      alert('Inicia Sesión para iniciar el chat');
      return;
    }
    setCooperativa(coop);
    const room = `${coop}_${user?.display_name}`;
    setRoomId(room);
    socket.emit('joinRoom', { roomId: room, user: user?.display_name, cooperativa: coop });
    setJoined(true);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit('message', { roomId, content: message, sender: user?.display_name, type: 'text' });
    setMessage('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      socket.emit('message', {
        roomId,
        sender: user?.display_name,
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
      {/* Panel izquierdo: lista cooperativas */}
      <Box sx={{ width: 280, borderRight: '1px solid #ddd', p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Cooperativas
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <List>
          {COOPERATIVAS.map((coop) => (
            <ListItem key={coop} disablePadding>
              <ListItemButton
                onClick={() => joinRoom(coop)}
                selected={coop === cooperativa}
              >
                <ListItemText primary={coop} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Panel derecho: chat */}
      <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', height: '80vh' }}>
        {joined ? (
          <>
            <Typography variant="h5" gutterBottom>
              Chat con {cooperativa}
            </Typography>

            <Paper
              elevation={3}
              sx={{ flexGrow: 1, overflowY: 'auto', p: 2, mb: 2 }}
            >
              {messages.map((msg, idx) => (
                <Box key={idx} sx={{ mb: 1 }}>
                  <strong>{msg.sender}:</strong>{' '}
                  {msg.type === 'file' ? (
                    <a
                      href={msg.content}
                      download={msg.fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📎 {msg.fileName}
                    </a>
                  ) : (
                    msg.content
                  )}
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Paper>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                fullWidth
                size="small"
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button variant="contained" onClick={sendMessage} disabled={!message.trim()}>
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
            Selecciona una cooperativa para iniciar el chat.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
