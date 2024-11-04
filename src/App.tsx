"use client"

import { useEffect, useState, useRef } from "react";
import Peer from 'peerjs';

function App() {
  const [myUniqueId, setMyUniqueId] = useState<string>("");
  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
  const [idToCall, setIdToCall] = useState('');

  const generateRandomString= () => Math.random().toString(16).substring(2);

  const myVideoRef = useRef<HTMLVideoElement>(null);
  const callingVideoRef = useRef<HTMLVideoElement>(null);

  const handleCall = () => {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    }).then(stream => {
      const call = peerInstance?.call(idToCall, stream);

      if(call) {
        call.on('stream', userVideoStream => {
          if(callingVideoRef.current) {
            callingVideoRef.current.srcObject = userVideoStream;
          }
        });
      }
    });
  };

  useEffect(() => {
    if(myUniqueId) {
      let peer: Peer;

      if (typeof window !== 'undefined') {
        peer = new Peer(myUniqueId, {
          host: '54.241.147.183',
          key: 'peerjs',
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

        setPeerInstance(peer);

        navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        }).then(stream => {
          if(myVideoRef.current) {
            myVideoRef.current.srcObject = stream;
          }

          peer.on('call', call => {
            call.answer(stream);
            call.on('stream', userVideoStream => {
              if(callingVideoRef.current) {
                callingVideoRef.current.srcObject = userVideoStream;
              }
            });
          });
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
        <input className='text-black' placeholder="id to call" value={idToCall} onChange={e => setIdToCall(e.target.value)} />
        <button onClick={handleCall}>call</button>
        <video className='w-72' playsInline ref={callingVideoRef} autoPlay />
      </div>
    </main>
  );
};

export default App;
