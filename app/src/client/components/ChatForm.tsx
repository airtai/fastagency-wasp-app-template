import React, { useRef, useState, useEffect, useCallback } from 'react';

import { type Chat } from 'wasp/entities';
import { createNewChat } from 'wasp/client/operations';
import { useHistory } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { useSocketListener } from 'wasp/client/webSocket';

interface ChatFormProps {
  handleFormSubmit: (userQuery: string, isUserRespondedWithNextAction?: boolean, retrySameChat?: boolean) => void;
  currentChatDetails: Chat | null | undefined;
  triggerChatFormSubmitMsg?: string | null;
  setNotificationErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ChatForm({
  handleFormSubmit,
  currentChatDetails,
  triggerChatFormSubmitMsg,
  setNotificationErrorMessage,
}: ChatFormProps) {
  const [message, setMessage] = useState<string>('');
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const history = useHistory();
  const hasTriggerSubmitted = useRef(false);

  const isInputDisabled = useCallback(() => {
    return (
      hasTriggerSubmitted.current || currentChatDetails?.team_status === 'inprogress' || currentChatDetails?.showLoader
    );
  }, [currentChatDetails]);

  useEffect(() => {
    if (!isInputDisabled()) {
      textAreaRef.current?.focus();
    }
  }, [isInputDisabled]);

  useEffect(() => {
    if (currentChatDetails && currentChatDetails.isChatTerminated) {
      return;
    }
    textAreaRef.current?.focus();
  }, [currentChatDetails]);

  useSocketListener('streamFromTeamFinished', () => {
    textAreaRef.current?.focus();
    hasTriggerSubmitted.current = false;
  });

  const formRef = useCallback(
    async (node: HTMLFormElement | null) => {
      if (node !== null && triggerChatFormSubmitMsg && !hasTriggerSubmitted.current) {
        hasTriggerSubmitted.current = true;
        await handleFormSubmit(triggerChatFormSubmitMsg, true);
      }
    },
    [triggerChatFormSubmitMsg, handleFormSubmit]
  );

  const submitMessage = async () => {
    if (isInputDisabled() || !message.trim()) return;

    hasTriggerSubmitted.current = true;

    try {
      if (!currentChatDetails) {
        const chat = await createNewChat();
        history.push(`/chat/${chat.uuid}?initiateChatMsg=${encodeURIComponent(message.trim())}`);
        hasTriggerSubmitted.current = false;
      } else {
        await handleFormSubmit(message.trim());
      }
      setMessage('');
    } catch (err) {
      console.error('Error submitting message:', err);
      setNotificationErrorMessage('Oops! Something went wrong while sending your message. Please try again later.');
    } finally {
      hasTriggerSubmitted.current = false;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  return (
    <form data-testid='chat-form' onSubmit={handleSubmit} className='mt-2 mb-2' ref={formRef}>
      <div className='relative flex items-center m-1'>
        <TextareaAutosize
          ref={textAreaRef}
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Enter your message...'
          minRows={1}
          maxRows={4}
          className='w-full p-2 text-sm text-white bg-primary rounded-lg focus:outline-none focus:ring-0'
          style={{ resize: 'none', lineHeight: '1.5' }}
        />
        <button
          type='submit'
          disabled={isInputDisabled() || !message.trim()}
          className={`absolute right-2 p-1.5 rounded-lg ${
            isInputDisabled() || !message.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-secondary hover:opacity-90 cursor-pointer'
          }`}
          aria-label='Send message'
        >
          <svg width='20' height='20' viewBox='0 0 24 24' fill='none' className='text-primary'>
            <path
              d='M7 11L12 6L17 11M12 18V7'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
