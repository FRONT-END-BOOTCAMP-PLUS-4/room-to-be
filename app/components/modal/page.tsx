'use client'

import Modal from "./Modal";

export default function page() {
  return (
    <div className="w-screen h-screen bg-cover bg-[url(/assets/images/room01.jpg)]">
      <Modal 
        width="500px" 
        height="300px" 
        onClose={() => console.log('Modal closed')}
        onBack={()=>console.log('back')}
      >
        <p>Modal Content</p>
      </Modal>
    </div>
  );
}

