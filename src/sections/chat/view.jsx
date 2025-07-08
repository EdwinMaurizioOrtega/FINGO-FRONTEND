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

const socket = io(process.env.NEXT_PUBLIC_SERVER_SOCKET); // Asegúrate de que esta variable esté definida correctamente

const COOPERATIVAS = ['Cooperativa Caja'];

export function ChatView() {
  const { user } = useAuthContext();

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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;

    fetch(`${process.env.NEXT_PUBLIC_SERVER_SOCKET}/messages?roomId=${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        const safeMessages = Array.isArray(data) ? data : (data.messages || []);
        setMessages(safeMessages);
      })
      .catch((err) => {
        console.error('Error cargando mensajes:', err);
        setMessages([]);
      });
  }, [roomId]);

  const joinRoom = (coop) => {
    if (!user?.display_name) {
      alert('Inicia sesión para iniciar el chat');
      return;
    }

    const room = `${coop}_${user.display_name}`.replace(/\s+/g, '_');

    setCooperativa(coop);
    setRoomId(room);
    setJoined(true);

    socket.emit('joinRoom', {
      roomId: room,
      user: user.display_name,
      cooperativa: coop
    });
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit('message', {
      roomId,
      content: message,
      sender: user.display_name,
      type: 'text'
    });

    setMessage('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      socket.emit('message', {
        roomId,
        sender: user.display_name,
        type: 'file',
        fileName: file.name,
        fileType: file.type,
        content: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Panel izquierdo: cooperativas */}
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

            <Paper elevation={3} sx={{ flexGrow: 1, overflowY: 'auto', p: 2, mb: 2 }}>
              {Array.isArray(messages) && messages.map((msg, idx) => (
                <Box key={idx} sx={{ mb: 1 }}>
                  <strong>{msg.sender}:</strong>{' '}
                  {msg.type === 'file' ? (
                    <a
                      href={msg.content}
                      download={msg.fileName || 'archivo'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📎 {msg.fileName || 'archivo adjunto'}
                    </a>
                  ) : (
                    msg.content
                  )}
                  {msg.timestamp && (
                    <Typography variant="caption" sx={{ ml: 1 }} color="text.secondary">
                      ({new Date(msg.timestamp).toLocaleTimeString()})
                    </Typography>
                  )}
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Paper>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe un mensaje..."
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
