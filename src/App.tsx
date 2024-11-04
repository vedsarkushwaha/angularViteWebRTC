"use client"

import { useEffect, useState, useRef } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [myUniqueId, setMyUniqueId] = useState<string>("");

  const generateRandomString= () => Math.random().toString(8).substring(2);

  const myVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      }).then(stream => {
        if(myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
      });
    }
  }, []);

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
