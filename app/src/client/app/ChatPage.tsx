import { useState, useEffect } from 'react';
import _ from 'lodash';
import { useSocket, useSocketListener } from 'wasp/client/webSocket';
import { type User } from 'wasp/entities';

import { updateCurrentChat, useQuery, getChat, getChatFromUUID, getConversations } from 'wasp/client/operations';

import { useHistory, useLocation } from 'react-router-dom';

import CustomAuthRequiredLayout from './layout/CustomAuthRequiredLayout';
import ChatLayout from './layout/ChatLayout';
import ConversationsList from '../components/ConversationList';
import NotificationBox from '../components/NotificationBox';

import {
  updateCurrentChatStatus,
  getInProgressConversation,
  getFormattedChatMessages,
  continueChat,
  initiateChat,
  handleChatError,
} from '../utils/chatUtils';
import Loader from '../admin/common/Loader';

const chatPage = ({ user }: { user: User }) => {
  const [refetchAllChatDetails, setRefetchAllChatDetails] = useState(false);
  const { socket } = useSocket();
  const location = useLocation();
  const { pathname } = location;
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const [notificationErrorMessage, setNotificationErrorMessage] = useState<string | null>(null);

  const uuidFromURL = pathname.split('/').pop();
  const activeChatUUId = uuidFromURL === 'chat' ? null : uuidFromURL;
  const { data: activeChat } = useQuery(getChatFromUUID, {
    chatUUID: activeChatUUId,
  });
  const [triggerChatFormSubmitMsg, setTriggerChatFormSubmitMsg] = useState<string | null>(null);
  const activeChatId = Number(activeChat?.id);
  const { data: currentChatDetails, refetch: refetchChat }: { data: any; refetch: any } = useQuery(
    getChat,
    { chatId: activeChatId },
    { enabled: !!activeChatId }
  );
  const { data: conversations, refetch: refetchConversation } = useQuery(
    getConversations,
    { chatId: activeChatId },
    { enabled: !!activeChatId }
  );
  const [triggerScrollBarMove, settriggerScrollBarMove] = useState(false);

  useSocketListener('streamFromTeamFinished', updateState);

  function updateState() {
    refetchConversation();
    refetchChat();
  }

  // Function to remove query parameters
  const removeQueryParameters = () => {
    history.push({
      search: '', // This removes all query parameters
    });
  };

  const refetchChatDetails = () => {
    setRefetchAllChatDetails(!refetchAllChatDetails);
  };

  const formSubmitMsg = queryParams.get('initiateChatMsg');
  useEffect(() => {
    if (formSubmitMsg && currentChatDetails) {
      if (!currentChatDetails.userRespondedWithNextAction) {
        setTriggerChatFormSubmitMsg(decodeURIComponent(formSubmitMsg));
      }
      removeQueryParameters();
    }
  }, [formSubmitMsg, currentChatDetails]);

  const handleFormSubmit = async (
    userQuery: string,
    isUserRespondedWithNextAction: boolean = false,
    retrySameChat: boolean = false
  ) => {
    if (currentChatDetails.userId !== user.id) {
      window.alert('Error: This chat does not belong to you.');
    } else if (currentChatDetails.isChatTerminated) {
      setNotificationErrorMessage('This chat has been completed. Please start a new chat.');
    } else {
      let inProgressConversation;
      try {
        if (isUserRespondedWithNextAction) {
          await updateCurrentChatStatus(activeChatId, isUserRespondedWithNextAction, removeQueryParameters);
          setTriggerChatFormSubmitMsg(null);
        }
        const messages: any = await getFormattedChatMessages(activeChatId, userQuery, retrySameChat);
        inProgressConversation = await getInProgressConversation(activeChatId, userQuery, retrySameChat);
        if (currentChatDetails.team_uuid) {
          await continueChat(socket, currentChatDetails, inProgressConversation, userQuery, messages, activeChatId);
        } else {
          await initiateChat(
            activeChatId,
            currentChatDetails,
            inProgressConversation,
            socket,
            messages,
            refetchChatDetails
          );
        }
        settriggerScrollBarMove(true);
      } catch (err: any) {
        await handleChatError(err, activeChatId, inProgressConversation, history);
      }
    }
  };

  const onStreamAnimationComplete = () => {
    updateCurrentChat({
      id: activeChatId,
      data: {
        streamAgentResponse: false,
      },
    });
  };

  // const userSelectedAction: any = queryParams.get('selected_user_action');
  let userSelectedActionMessage: string | null = null;

  // if (isLoading) {
  //   return (
  //     <div className='z-[999999] absolute inset-0 flex items-center justify-center bg-white bg-opacity-50'>
  //       <Loader />
  //     </div>
  //   );
  // }

  const notificationOnClick = () => {
    setNotificationErrorMessage(null);
  };
  return (
    <ChatLayout
      handleFormSubmit={handleFormSubmit}
      currentChatDetails={currentChatDetails}
      triggerChatFormSubmitMsg={triggerChatFormSubmitMsg}
      refetchAllChatDetails={refetchAllChatDetails}
      triggerScrollBarMove={triggerScrollBarMove}
      setNotificationErrorMessage={setNotificationErrorMessage}
    >
      <div className='flex h-full flex-col'>
        {currentChatDetails ? (
          <div className='flex-1 overflow-hidden'>
            {conversations && conversations.length > 0 ? (
              <>
                <ConversationsList
                  conversations={conversations}
                  currentChatDetails={currentChatDetails}
                  handleFormSubmit={handleFormSubmit}
                  userSelectedActionMessage={userSelectedActionMessage}
                  onStreamAnimationComplete={onStreamAnimationComplete}
                />
              </>
            ) : (
              <div className='z-[999999] absolute inset-0 flex items-center justify-center bg-white bg-opacity-50'>
                <Loader />
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
        {notificationErrorMessage && (
          <NotificationBox type='error' onClick={notificationOnClick} message={notificationErrorMessage} />
        )}
      </div>
    </ChatLayout>
  );
};

const ChatPageWithCustomAuth = CustomAuthRequiredLayout(chatPage);
export default ChatPageWithCustomAuth;
