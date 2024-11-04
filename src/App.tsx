"use client"

import { useEffect, useState, useRef } from "react";
import Peer from 'peerjs';

function App() {
  const [myUniqueId, setMyUniqueId] = useState<string>("");

  const generateRandomString= () => Math.random().toString(16).substring(2);

  const myVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if(myUniqueId) {
      let peer: Peer;

      if (typeof window !== 'undefined') {
        peer = new Peer(myUniqueId, {
          host: '54.241.147.183',
          key: 'peerjskey',
          secure: true,
          path: '/',
          port: 9000,
          config: {
            'iceServers': [
              {
                url: 'stun:stun.l.google.com:19302'
              },
              {
                url: 'stun:stun1.l.google.com:19302'
              },
              {
                url: 'turn:54.241.147.183',
                username: "vomipTurn",
                credential: "Chess123"
              },
            ]
          }
        })

        navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        }).then(stream => {
          if(myVideoRef.current) {
            myVideoRef.current.srcObject = stream;
          }
        });
      }

      return () => {
        if(peer) {
          peer.destroy();
        }
      };
    }
  }, [myUniqueId]);

  useEffect(() => {
    setMyUniqueId(generateRandomString);
  }, [])

  return (
    <main>
      <div className='flex flex-col justify-center items-center p-12'>
        <p> your id: {myUniqueId} </p>
        <video className='w-72' playsInline ref={myVideoRef} autoPlay />
      </div>
    </main>
  );
}

export default App;
