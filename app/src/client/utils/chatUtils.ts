import {
  updateCurrentChat,
  updateCurrentConversation,
  createNewAndReturnAllConversations,
  createNewAndReturnLastConversation,
  getAgentResponse,
  deleteLastConversationInChat,
  pingServer,
} from 'wasp/client/operations';

import { retryFunction } from './commonUtils';

import { type Conversation, type Chat } from 'wasp/entities';

export const exceptionMessage = 'Oops! An unexpected problem occurred. Please click the button below to retry.';

type OutputMessage = {
  role: string;
  content: string;
};

export function prepareOpenAIRequest(input: Conversation[]): OutputMessage[] {
  const messages: OutputMessage[] = input.map((message) => {
    return {
      role: message.role,
      content: message.message,
    };
  });
  return messages;
}

export async function updateCurrentChatStatus(
  activeChatId: number,
  isUserRespondedWithNextAction: boolean,
  removeQueryParameters: Function
) {
  isUserRespondedWithNextAction && removeQueryParameters();
  await updateCurrentChat({
    id: activeChatId,
    data: {
      userRespondedWithNextAction: isUserRespondedWithNextAction,
    },
  });
}

export async function getFormattedChatMessages(activeChatId: number, userQuery: string, retrySameChat: boolean) {
  let allConversations;
  if (retrySameChat) {
    allConversations = await deleteLastConversationInChat(activeChatId);
  } else {
    allConversations = await createNewAndReturnAllConversations({
      chatId: activeChatId,
      userQuery,
      role: 'user',
    });
  }
  const messages: any = prepareOpenAIRequest(allConversations);
  await updateCurrentChat({
    id: activeChatId,
    data: {
      showLoader: true,
    },
  });
  return messages;
}

export async function getInProgressConversation(activeChatId: number, userQuery: string, retrySameChat: boolean) {
  const message = retrySameChat ? '' : userQuery;
  const inProgressConversation = await createNewAndReturnLastConversation({
    chatId: activeChatId,
    userQuery: message,
    role: 'assistant',
    isLoading: true,
  });
  return inProgressConversation;
}

export const continueChat = async (
  socket: any,
  currentChatDetails: any,
  inProgressConversation: any,
  userQuery: string,
  messages: any,
  activeChatId: number
) => {
  socket.emit(
    'sendMessageToTeam',
    currentChatDetails,
    currentChatDetails.team_uuid,
    userQuery,
    inProgressConversation.id
  );
  await updateCurrentChat({
    id: activeChatId,
    data: {
      showLoader: false,
      team_status: 'inprogress',
    },
  });
};

export const initiateChat = async (
  activeChatId: number,
  currentChatDetails: any,
  inProgressConversation: any,
  socket: any,
  messages: any,
  refetchChatDetails: () => void
) => {
  console.log('Ping server before initiating chat.');
  await retryFunction(pingServer, 3, 30000); // 30 seconds
  const response = await getAgentResponse({ chatId: activeChatId });
  await handleAgentResponse(
    response,
    currentChatDetails,
    inProgressConversation,
    socket,
    messages,
    activeChatId,
    refetchChatDetails
  );
};

export const handleAgentResponse = async (
  response: any,
  currentChatDetails: any,
  inProgressConversation: any,
  socket: any,
  messages: any,
  activeChatId: number,
  refetchChatDetails: () => void
) => {
  socket.emit('sendMessageToTeam', currentChatDetails, response.team_uuid, messages, inProgressConversation.id);

  response['content'] &&
    (await updateCurrentConversation({
      id: inProgressConversation.id,
      data: {
        isLoading: false,
        message: response['content'],
      },
    }));

  const chatName = currentChatDetails.isChatNameUpdated
    ? null
    : response['conversation_name']
      ? response['conversation_name']
      : null;

  await updateCurrentChat({
    id: activeChatId,
    data: {
      showLoader: false,
      team_uuid: response['team_uuid'],
      team_name: response['team_name'],
      team_status: response['team_status'],
      isExceptionOccured: response['is_exception_occured'] || false,
      ...(chatName && {
        name: chatName,
        isChatNameUpdated: true,
      }),
    },
  });

  chatName && refetchChatDetails();
};

export const handleChatError = async (err: any, activeChatId: number, inProgressConversation: any, history: any) => {
  await updateCurrentChat({
    id: activeChatId,
    data: { showLoader: false },
  });
  console.log('Error: ' + err.message);
  if (err.message === 'No Subscription Found') {
    history.push('/');
  } else {
    await updateCurrentConversation({
      //@ts-ignore
      id: inProgressConversation.id,
      data: {
        isLoading: false,
        message: exceptionMessage,
      },
    });
    await updateCurrentChat({
      id: activeChatId,
      data: {
        showLoader: false,
        isExceptionOccured: true,
      },
    });
  }
};
