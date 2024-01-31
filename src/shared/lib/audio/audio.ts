export const handlePlayAudio = (audioElement: HTMLAudioElement) => {
  audioElement.play();
};

export const handlePauseAudio = (audioElement: HTMLAudioElement) => {
  audioElement.pause();
};

// export const handleStopRecording = () => {
//   if (mediaRecorderRef.current) {
//     mediaRecorderRef.current.stop();
//     setRecording(false);
//   }
// };

// export const handleStartRecording = () => {
//   navigator.mediaDevices
//     .getUserMedia({ audio: true })
//     .then((stream) => {
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;

//       const chunks: BlobPart[] = [];
//       mediaRecorder.ondataavailable = (e) => {
//         if (e.data.size > 0) {
//           chunks.push(e.data);
//         }
//       };

//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(chunks, { type: 'audio/wav' });
//         setAudioBlob(audioBlob);
//       };

//       mediaRecorder.start();
//       setRecording(true);
//     })
//     .catch((error) => {
//       console.error('Error accessing audio stream:', error);
//     });
// };
