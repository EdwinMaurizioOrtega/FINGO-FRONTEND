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
import { JwtSignInView } from '../../auth/view/jwt';

const socket = io(process.env.NEXT_PUBLIC_SERVER_SOCKET); // Asegúrate de que esta variable esté definida correctamente

const COOPERATIVAS = ['Cooperativa Caja'];

export function ChatView({ onClose }) {
  const { user } = useAuthContext();

  const [cooperativa, setCooperativa] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [requireLogin, setRequireLogin] = useState(false);

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
        const safeMessages = Array.isArray(data) ? data : data.messages || [];
        setMessages(safeMessages);
      })
      .catch((err) => {
        console.error('Error cargando mensajes:', err);
        setMessages([]);
      });
  }, [roomId]);

  const joinRoom = (coop) => {
    if (!user?.display_name) {
      setRequireLogin(true); // Mostrar el login
      return <JwtSignInView />;
    }

    setRequireLogin(false); // Ocultar si ya está autenticado

    const room = `${coop}_${user.display_name}`.replace(/\s+/g, '_');

    setCooperativa(coop);
    setRoomId(room);
    setJoined(true);

    socket.emit('joinRoom', {
      roomId: room,
      user: user.display_name,
      cooperativa: coop,
    });
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit('message', {
      roomId,
      content: message,
      sender: user.display_name,
      type: 'text',
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
        content: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          width: 400,
          height: 500,
          display: 'flex',
          boxShadow: 6,
          borderRadius: 2,
          overflow: 'hidden',
          zIndex: 1300,
          backgroundColor: '#fff',
          border: '1px solid #ccc',
        }}
      >
        {/* Panel izquierdo: cooperativas */}
        <Box sx={{ width: 120, borderRight: '1px solid #ddd', p: 1 }}>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Coops
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <List dense>
            {COOPERATIVAS.map((coop) => (
              <ListItem key={coop} disablePadding>
                <ListItemButton
                  onClick={() => joinRoom(coop)}
                  selected={coop === cooperativa}
                  sx={{ px: 1 }}
                >
                  <ListItemText primaryTypographyProps={{ fontSize: 12 }} primary={coop} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Panel derecho: chat */}
        <Box sx={{ flexGrow: 1, p: 1.5, display: 'flex', flexDirection: 'column' }}>
          {joined ? (
            <>
              <Box
                sx={{
                  mb: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  {cooperativa}
                </Typography>
                <Button onClick={onClose} size="small" variant="text">
                  ✖
                </Button>
              </Box>

              <Paper
                elevation={1}
                sx={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  p: 1,
                  mb: 1,
                  backgroundColor: '#f9f9f9',
                  borderRadius: 1,
                }}
              >
                {Array.isArray(messages) &&
                  messages.map((msg, idx) => (
                    <Box key={idx} sx={{ mb: 1 }}>
                      <Typography variant="caption" fontWeight="bold">
                        {msg.sender}:
                      </Typography>{' '}
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
                        <Typography variant="body2" component="span">
                          {msg.content}
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
                  placeholder="Mensaje..."
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={sendMessage}
                  disabled={!message.trim()}
                >
                  ➤
                </Button>
              </Box>

              <Box sx={{ mt: 1 }}>
                <Button variant="text" component="label" fullWidth size="small">
                  Subir archivo
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
              </Box>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Selecciona una cooperativa.
            </Typography>
          )}
        </Box>
      </Box>
      {requireLogin && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            right: 10,
            bottom: 10,
            background: '#fff',
            zIndex: 2000,
          }}
        >
          <JwtSignInView />
        </Box>
      )}
    </>
  );
}
