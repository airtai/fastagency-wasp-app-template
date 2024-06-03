import React from 'react';

interface NotificationBoxProps {
  type: 'success' | 'error';
  message: string;
  onClick: () => void;
}

const NotificationBox: React.FC<NotificationBoxProps> = ({ type, message, onClick }) => {
  const isSuccess = type === 'success';

  return (
    <div className='fixed inset-0 flex items-center justify-center z-99999 p-16 backdrop-blur-sm bg-white/30'>
      <div className='bg-primary rounded-lg shadow-lg p-8 m-4 max-w-sm mx-auto'>
        <h2 className='text-xl font-bold mb-4 text-white'>{isSuccess ? 'Success' : 'Error'}</h2>
        <p className='text-white'>{message}</p>
        <div className='mt-4 text-right'>
          <button
            onClick={onClick}
            className={`py-2 px-4 rounded text-white focus:outline-none hover:bg-opacity-85 ${
              isSuccess ? 'bg-secondary' : 'bg-danger'
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationBox;
