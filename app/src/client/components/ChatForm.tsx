import React, { useRef, useState, useEffect, useCallback } from 'react';

import _ from 'lodash';

import { type Chat } from 'wasp/entities';
import { createNewChat } from 'wasp/client/operations';
import { useHistory } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';

interface ChatFormProps {
  handleFormSubmit: (userQuery: string) => void;
  currentChatDetails: Chat | null | undefined;
  triggerChatFormSubmitMsg?: string | null;
}

export default function ChatForm({ handleFormSubmit, currentChatDetails, triggerChatFormSubmitMsg }: ChatFormProps) {
  const [formInputValue, setFormInputValue] = useState('');
  const [disableFormSubmit, setDisableFormSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();

  const formInputRef = useCallback(
    async (node: any) => {
      if (node !== null && triggerChatFormSubmitMsg) {
        // @ts-ignore
        await handleFormSubmit(triggerChatFormSubmitMsg, true);
      }
    },
    [triggerChatFormSubmitMsg]
  );

  useEffect(() => {
    if (currentChatDetails) {
      setDisableFormSubmit(currentChatDetails.team_status === 'inprogress');
    } else {
      setDisableFormSubmit(false);
    }
  }, [currentChatDetails]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const msgToSubmit = formInputValue.trim();
    setIsSubmitting(true);

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
    }
  };

  const debouncedHandleSubmit = _.debounce(handleSubmit, 500);

  return (
    <div className='mt-2 mb-2'>
      <form data-testid='chat-form' onSubmit={debouncedHandleSubmit} className=''>
        <label htmlFor='search' className='mb-2 text-sm font-medium text-captn-dark-blue sr-only dark:text-white'>
          Search
        </label>
        <div className='relative bottom-0 left-0 right-0 flex items-center justify-between m-1'>
          <TextareaAutosize
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
            ref={formInputRef}
            value={formInputValue}
            onChange={(e) => setFormInputValue(e.target.value)}
            disabled={disableFormSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                debouncedHandleSubmit(e as any);
              }
            }}
          />
          <button
            type='submit'
            className={`text-primary bg-secondary hover:opacity-90 absolute right-2 font-medium rounded-lg text-sm px-1.5 py-1.5 ${
              disableFormSubmit ? 'cursor-not-allowed bg-white opacity-70 hover:opacity-70' : 'cursor-pointer'
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
