import { type User, type Chat, type Conversation } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import {
  type UpdateCurrentUser,
  type UpdateUserById,
  type CreateNewChat,
  type CreateNewAndReturnAllConversations,
  type CreateNewAndReturnLastConversation,
  type UpdateCurrentChat,
  type UpdateCurrentConversation,
  type GetAgentResponse,
  type DeleteLastConversationInChat,
  type RetryTeamChat,
  type PingServer,
} from 'wasp/server/operations';

import { FASTAGENCY_SERVER_URL } from './common/constants';

export const updateUserById: UpdateUserById<{ id: number; data: Partial<User> }, User> = async (
  { id, data },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const updatedUser = await context.entities.User.update({
    where: {
      id,
    },
    data,
  });

  return updatedUser;
};

export const updateCurrentUser: UpdateCurrentUser<Partial<User>, User> = async (user, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: user,
  });
};

export const createNewChat: CreateNewChat<void, Chat> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const chat = await context.entities.Chat.create({
    data: {
      user: { connect: { id: context.user.id } },
    },
  });

  return chat;
};

export const updateCurrentChat: UpdateCurrentChat<{ id: number; data: Partial<Chat> }, Chat> = async (
  { id, data },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const chat = await context.entities.Chat.update({
    where: {
      id: id,
    },
    data,
  });

  return chat;
};

export const updateCurrentConversation: UpdateCurrentConversation<
  { id: number; data: Partial<Conversation> },
  Conversation
> = async ({ id, data }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const conversation = await context.entities.Conversation.update({
    where: {
      id: id,
    },
    data,
  });

  return conversation;
};

export const deleteLastConversationInChat: DeleteLastConversationInChat<number, Conversation[]> = async (
  chatId: number,
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const conversations = await context.entities.Conversation.findMany({
    where: { chatId: chatId },
    orderBy: { id: 'desc' },
  });

  const lastConvId = conversations[0].id;
  await context.entities.Conversation.delete({
    where: { id: lastConvId },
  });

  const allConversations = await context.entities.Conversation.findMany({
    where: { chatId: chatId, userId: context.user.id },
    orderBy: { id: 'asc' },
  });
  return allConversations;
};

export const retryTeamChat: RetryTeamChat<number, [Chat, string]> = async (chatId: number, context: any) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const newChat = await context.entities.Chat.create({
    data: {
      user: { connect: { id: context.user.id } },
    },
  });

  const allChatConversations = await context.entities.Conversation.findMany({
    where: { chatId: chatId, userId: context.user.id },
    orderBy: { id: 'asc' },
  });

  const lastInitialConversationindex = allChatConversations.findIndex(
    (conversation: Conversation) => conversation.agentConversationHistory !== null
  );

  let initialConversations = allChatConversations.slice(
    0,
    lastInitialConversationindex >= 0 ? lastInitialConversationindex : allChatConversations.length
  );
  let lastConversation = initialConversations.pop();

  initialConversations = initialConversations.map((conversation: Conversation) => {
    return {
      message: conversation.message,
      role: conversation.role,
      isLoading: conversation.isLoading,
      chatId: newChat.id,
      userId: context.user.id,
    };
  });

  await context.entities.Conversation.createMany({
    data: initialConversations,
  });

  return [newChat, lastConversation.message];
};

export const createNewAndReturnAllConversations: CreateNewAndReturnAllConversations<
  { chatId: number; userQuery: string; role: 'user' | 'assistant' },
  Conversation[]
> = async ({ chatId, userQuery, role }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  await context.entities.Conversation.create({
    data: {
      chat: { connect: { id: chatId } },
      user: { connect: { id: context.user.id } },
      message: userQuery,
      role,
    },
  });

  return context.entities.Conversation.findMany({
    where: { chatId: chatId, userId: context.user.id },
    orderBy: { id: 'asc' },
  });
};

export const createNewAndReturnLastConversation: CreateNewAndReturnLastConversation<
  {
    chatId: number;
    userQuery: string;
    role: 'user' | 'assistant';
    isLoading: boolean;
  },
  Conversation
> = async ({ chatId, userQuery, role, isLoading }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return await context.entities.Conversation.create({
    data: {
      chat: { connect: { id: chatId } },
      user: { connect: { id: context.user.id } },
      message: userQuery,
      role,
      isLoading,
    },
  });
};

type AgentPayload = {
  chatId: number;
};

export const getAgentResponse: GetAgentResponse<AgentPayload, Record<string, any>> = async (
  {
    chatId,
  }: {
    chatId: number;
  },
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const deploymentUUID = process.env.FASTAGENCY_DEPLOYMENT_UUID;
  const url = `${FASTAGENCY_SERVER_URL}/deployment/${deploymentUUID}/chat`;
  console.log('===========');
  console.log('Sending message to: ', url);
  console.log('===========');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const json: any = (await response.json()) as { detail?: string }; // Parse JSON once

    if (!response.ok) {
      const errorMsg = json.detail || `HTTP error with status code ${response.status}`;
      console.error('Server Error:', errorMsg);
      throw new Error(errorMsg);
    }

    return {
      team_status: json['team_status'],
      team_name: json['team_name'],
      team_uuid: json['team_uuid'],
      ...(json['conversation_name'] !== undefined && {
        conversation_name: json['conversation_name'],
      }),
      ...(json['is_exception_occured'] !== undefined && {
        is_exception_occured: Boolean(json['is_exception_occured']),
      }),
    };
  } catch (error: any) {
    throw new HttpError(500, 'Something went wrong. Please try again later');
  }
};

export const pingServer: PingServer<void, any> = async (args: any, context: any) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const deploymentUUID = process.env.FASTAGENCY_DEPLOYMENT_UUID;
  const url = `${FASTAGENCY_SERVER_URL}/deployment/${deploymentUUID}/ping`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const json: any = (await response.json()) as { detail?: string };
    if (!response.ok) {
      throw new Error('Unable to reach the server. Please try again later.');
    }
    return json.detail;
  } catch (error: any) {
    throw new HttpError(500, 'Unable to reach the server. Please try again later.');
  }
};
