import { test, expect, describe, vi, beforeEach } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderInContext } from 'wasp/client/test';
import { act } from 'react-dom/test-utils';
import ChatForm from '../components/ChatForm';
import { Chat } from 'wasp/entities';
import * as operations from 'wasp/client/operations';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const defaultChatDetails: Chat = {
  id: 1,
  uuid: '1312312312321313',
  createdAt: new Date(),
  updatedAt: new Date(),
  team_uuid: '',
  team_name: '',
  team_status: '',
  userRespondedWithNextAction: false,
  agentChatHistory: '',
  isExceptionOccured: false,
  showLoader: false,
  streamAgentResponse: false,
  customerBrief: '',
  userId: 1,
  name: '',
  isChatNameUpdated: false,
  selectedTeam: '',
  isChatTerminated: false,
};

const renderChatForm = (props = {}) => {
  const defaultProps = {
    handleFormSubmit: vi.fn(),
    currentChatDetails: null,
    triggerChatFormSubmitMsg: null,
    setNotificationErrorMessage: vi.fn(),
  };
  return renderInContext(<ChatForm {...defaultProps} {...props} />);
};

describe('ChatForm', () => {
  let mockCreateNewChat: ReturnType<typeof vi.fn>;
  let history: ReturnType<typeof createMemoryHistory>;
  let pushSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockCreateNewChat = vi.fn().mockResolvedValue({ uuid: 'new-chat-uuid' });
    // @ts-ignore
    vi.spyOn(operations, 'createNewChat').mockImplementation(mockCreateNewChat);
    history = createMemoryHistory();
    // @ts-ignore
    pushSpy = vi.spyOn(history, 'push');
  });

  describe('New chat creation', () => {
    test('creates a new chat when currentChatDetails is null', async () => {
      renderInContext(
        <Router history={history}>
          <ChatForm
            handleFormSubmit={vi.fn()}
            currentChatDetails={null}
            triggerChatFormSubmitMsg={null}
            setNotificationErrorMessage={vi.fn()}
          />
        </Router>
      );

      const input = screen.getByPlaceholderText('Enter your message...');
      await act(async () => {
        fireEvent.change(input, { target: { value: 'New chat message' } });
      });

      const form = screen.getByTestId('chat-form');
      await act(async () => {
        fireEvent.submit(form);
      });

      expect(pushSpy).toHaveBeenCalledWith('/chat/new-chat-uuid?initiateChatMsg=New%20chat%20message');
      expect(mockCreateNewChat).toHaveBeenCalled();
    });
  });

  describe('Form submission', () => {
    test('auto submits the form with triggerChatFormSubmitMsg', async () => {
      const handleFormSubmit = vi.fn();
      const triggerChatFormSubmitMsg = 'Test message';

      renderChatForm({ handleFormSubmit, currentChatDetails: defaultChatDetails, triggerChatFormSubmitMsg });

      expect(screen.getByTestId('chat-form')).toBeInTheDocument();
      expect(handleFormSubmit).toHaveBeenCalledWith(triggerChatFormSubmitMsg, true);
    });

    test('submits the form with user input', async () => {
      const handleFormSubmit = vi.fn();

      renderChatForm({ handleFormSubmit, currentChatDetails: defaultChatDetails });

      const input = screen.getByPlaceholderText('Enter your message...');
      fireEvent.change(input, { target: { value: 'Hello World!' } });
      fireEvent.submit(screen.getByTestId('chat-form'));

      await waitFor(() => expect(handleFormSubmit).toHaveBeenCalledWith('Hello World!'));
    });

    test('prevents submission of empty messages', async () => {
      const handleFormSubmit = vi.fn();

      renderChatForm({ handleFormSubmit, currentChatDetails: defaultChatDetails });

      fireEvent.submit(screen.getByTestId('chat-form'));

      await waitFor(() => expect(handleFormSubmit).not.toHaveBeenCalled());
    });

    test('submits form when Enter key is pressed', async () => {
      const handleFormSubmit = vi.fn();

      renderChatForm({ handleFormSubmit, currentChatDetails: defaultChatDetails });

      const input = screen.getByPlaceholderText('Enter your message...');
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      await waitFor(() => expect(handleFormSubmit).toHaveBeenCalledWith('Test message'));
    });

    test('does not submit form when Shift+Enter is pressed', async () => {
      const handleFormSubmit = vi.fn();

      renderChatForm({ handleFormSubmit, currentChatDetails: defaultChatDetails });

      const input = screen.getByPlaceholderText('Enter your message...');
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: true });

      await waitFor(() => expect(handleFormSubmit).not.toHaveBeenCalled());
    });
  });

  describe('Form state', () => {
    test('disables form submission when team_status is inprogress', () => {
      renderChatForm({
        currentChatDetails: { ...defaultChatDetails, team_status: 'inprogress' },
      });

      const input = screen.getByPlaceholderText('Enter your message...');
      const submitButton = screen.getByRole('button');

      expect(input).not.toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });
});
