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
}

export default function ChatForm({ handleFormSubmit, currentChatDetails, triggerChatFormSubmitMsg }: ChatFormProps) {
  const [formInputValue, setFormInputValue] = useState('');
  const [disableFormSubmit, setDisableFormSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toggleTextAreaFocus, setToggleTextAreaFocus] = useState(false);
  const isProcessing = useRef(false);
  const textAreaRef = React.useRef<HTMLTextAreaElement>();
  const isEmptyMessage = formInputValue.trim().length === 0;
  const history = useHistory();

  const formRef = useCallback(
    async (node: any) => {
      if (node !== null && triggerChatFormSubmitMsg) {
        await handleFormSubmit(triggerChatFormSubmitMsg, true);
      }
    },
    [triggerChatFormSubmitMsg]
  );

  const setFocusOnTextArea = () => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };
  useEffect(() => {
    const responseCompleted = !disableFormSubmit || !isSubmitting || !isProcessing.current;
    if (toggleTextAreaFocus && responseCompleted) {
      setFocusOnTextArea();
    }
  }, [disableFormSubmit, isSubmitting, isProcessing.current, toggleTextAreaFocus]);

  useSocketListener('streamFromTeamFinished', () => {
    setToggleTextAreaFocus(true);
  });

  useEffect(() => {
    if (currentChatDetails) {
      setDisableFormSubmit(currentChatDetails.team_status === 'inprogress');
    } else {
      setDisableFormSubmit(false);
    }
    setFocusOnTextArea();
  }, [currentChatDetails]);

  const submitForm = async () => {
    if (isSubmitting || disableFormSubmit || isProcessing.current || isEmptyMessage) return;

    const msgToSubmit = formInputValue.trim();

    setIsSubmitting(true);
    setToggleTextAreaFocus(false);
    isProcessing.current = true;

    try {
      if (!currentChatDetails) {
        const chat: Chat = await createNewChat();
        history.push(`/chat/${chat.uuid}?initiateChatMsg=${msgToSubmit}`);
        setFormInputValue('');
      } else if (
        currentChatDetails &&
        !currentChatDetails.showLoader &&
        currentChatDetails.team_status !== 'inprogress'
      ) {
        setFormInputValue('');
        handleFormSubmit(msgToSubmit);
      }
    } catch (err: any) {
      console.log('Error: ' + err.message);
      window.alert('Error: Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
      isProcessing.current = false;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitForm();
  };

  const handleButtonClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await submitForm();
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await submitForm();
    }
  };

  return (
    <div className='mt-2 mb-2'>
      <form data-testid='chat-form' onSubmit={handleSubmit} className='' ref={formRef}>
        <label htmlFor='search' className='mb-2 text-sm font-medium text-captn-dark-blue sr-only dark:text-white'>
          Search
        </label>
        <div className='relative bottom-0 left-0 right-0 flex items-center justify-between m-1'>
          <TextareaAutosize
            autoFocus
            minRows={1}
            maxRows={4}
            style={{
              lineHeight: 2,
              resize: 'none',
            }}
            id='userQuery'
            name='search'
            className='block rounded-lg w-full h-12 text-sm text-white bg-primary focus:outline-none focus:ring-0 focus:border-captn-light-blue'
            placeholder='Enter your message...'
            required
            value={formInputValue}
            onChange={(e) => setFormInputValue(e.target.value)}
            disabled={disableFormSubmit || isSubmitting}
            ref={textAreaRef}
            onKeyDown={handleKeyDown}
          />
          <button
            type='button'
            disabled={disableFormSubmit || isSubmitting || isEmptyMessage}
            onClick={handleButtonClick}
            className={`text-primary bg-secondary hover:opacity-90 absolute right-2 font-medium rounded-lg text-sm px-1.5 py-1.5 ${
              disableFormSubmit || isSubmitting || isEmptyMessage
                ? 'cursor-not-allowed bg-white opacity-70 hover:opacity-70'
                : 'cursor-pointer'
            }`}
          >
            <span className=''>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none' className='text-primary'>
                <path
                  d='M7 11L12 6L17 11M12 18V7'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
