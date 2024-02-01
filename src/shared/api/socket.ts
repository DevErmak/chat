import { io } from 'socket.io-client';

export const socket = io('http://localhost:4000');
// const socket = io('http://localhost:4000');

// // setSocket(newSocket);
// console.log('---------------->34qqqwww');
// socket.emit('get prev message', { roomId });
// console.log('---------------->qqqwww2');

// socket.on('get prev message', (msg) => {
//   console.log('---------------->!!!msg', msg);
//   setMessages(msg);
//   console.log('---------------->222messages', messages);
// });

// socket.on('send message', (msg) => {
//   console.log('--------------qwemsg', msg);
//   addMessages(msg);
// });

// return () => {
//   socket.disconnect();
// };
