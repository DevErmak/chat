import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  audioBlob: Blob;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioBlob }) => {
  console.log('---------------->ssss');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const drawVisualization = (dataArray: any) => {
      const canvas = canvasRef.current;
      const canvasContext = canvas?.getContext('2d');
      if (!canvas || !canvasContext) return;

      const { width, height } = canvas;
      const barWidth = (width / dataArray.length) * 2.5;
      let barHeight;
      let x = 0;

      canvasContext.clearRect(0, 0, width, height);

      for (const data of dataArray) {
        barHeight = data / 2;

        canvasContext.fillStyle = `rgb(${barHeight + 100},50,50)`;
        canvasContext.fillRect(x, height - barHeight / 2, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    const audioContext = new AudioContext();
    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      const audioData = fileReader.result as ArrayBuffer;
      audioContext.decodeAudioData(audioData, (buffer) => {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;

        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        source.start();

        const renderFrame = () => {
          requestAnimationFrame(renderFrame);
          analyser.getByteFrequencyData(dataArray);
          drawVisualization(dataArray);
        };

        renderFrame();
      });
    };

    fileReader.readAsArrayBuffer(audioBlob);
  }, [audioBlob]);

  return <canvas ref={canvasRef} />;
};
