import { type Chat } from 'wasp/entities';

import { useSocketListener } from 'wasp/client/webSocket';
import { useAuth } from 'wasp/client/auth';
import { useState, ReactNode, FC, useRef, useEffect } from 'react';
import ChatSidebar from '../../components/ChatSidebar';
import ChatForm from '../../components/ChatForm';
import { useHistory } from 'react-router-dom';
import AutoScrollContainer from '../../components/AutoScrollContainer';
import { cn } from '../../../shared/utils';

interface Props {
  children?: ReactNode;
  handleFormSubmit: any;
  currentChatDetails?: Chat | null;
  triggerChatFormSubmitMsg?: string | null;
  refetchAllChatDetails: boolean;
  triggerScrollBarMove: boolean;
  setNotificationErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const ChatLayout: FC<Props> = ({
  children,
  handleFormSubmit,
  currentChatDetails,
  triggerChatFormSubmitMsg,
  refetchAllChatDetails,
  triggerScrollBarMove,
  setNotificationErrorMessage,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState<boolean>(false);

  const { data: user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push('/login');
    }
  }, [user, history]);

  useSocketListener('newMessageFromTeam', () => setShouldAutoScroll(true));
  useSocketListener('streamFromTeamFinished', () => setShouldAutoScroll(false));

  const wrapperClass = document.body.classList.contains('server-error')
    ? 'h-[calc(100vh-173px)]'
    : 'h-[calc(100vh-80px)]';

  return (
    <div className='dark:bg-boxdark-2 dark:text-bodydark'>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className={`flex ${wrapperClass} overflow-hidden`}>
        {/* <!-- ===== Sidebar Start ===== --> */}
        <ChatSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          refetchAllChatDetails={refetchAllChatDetails}
        />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <AutoScrollContainer shouldAutoScroll={shouldAutoScroll}>
            <main className='flex-auto overflow-y-auto'>
              <div>{children}</div>
            </main>
          </AutoScrollContainer>
          {/* <!-- ===== Main Content End ===== --> */}
          <ChatForm
            handleFormSubmit={handleFormSubmit}
            currentChatDetails={currentChatDetails}
            triggerChatFormSubmitMsg={triggerChatFormSubmitMsg}
            setNotificationErrorMessage={setNotificationErrorMessage}
          />
        </div>

        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default ChatLayout;

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className='sticky top-0 z-9 flex w-full bg-airt-hero-gradient-start dark:bg-boxdark dark:drop-shadow-none lg:hidden'>
      <div className='flex flex-grow items-center justify-between sm:justify-end sm:gap-5 px-8 py-5 shadow '>
        <div className='flex items-center gap-2 sm:gap-4 lg:hidden'>
          {/* <!-- Hamburger Toggle BTN --> */}

          <button
            aria-controls='sidebar'
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className='z-99999 block rounded-sm border border-primary border-hero-gradient-start bg-hero-gradient-start p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden'
          >
            <span className='relative block h-5.5 w-5.5 cursor-pointer'>
              <span className='du-block absolute right-0 h-full w-full'>
                <span
                  className={cn(
                    'relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-primary delay-[0] duration-200 ease-in-out dark:bg-white',
                    {
                      '!w-full delay-300': !sidebarOpen,
                    }
                  )}
                ></span>
                <span
                  className={cn(
                    'relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-primary delay-150 duration-200 ease-in-out dark:bg-white',
                    {
                      'delay-400 !w-full': !sidebarOpen,
                    }
                  )}
                ></span>
                <span
                  className={cn(
                    'relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-primary delay-200 duration-200 ease-in-out dark:bg-white',
                    {
                      '!w-full delay-500': !sidebarOpen,
                    }
                  )}
                ></span>
              </span>
              <span className='absolute right-0 h-full w-full rotate-45'>
                <span
                  className={cn(
                    'absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-primary delay-300 duration-200 ease-in-out dark:bg-white',
                    {
                      '!h-0 !delay-[0]': !sidebarOpen,
                    }
                  )}
                ></span>
                <span
                  className={cn(
                    'delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-primary duration-200 ease-in-out dark:bg-white',
                    {
                      '!h-0 !delay-200': !sidebarOpen,
                    }
                  )}
                ></span>
              </span>
            </span>
          </button>

          {/* <!-- Hamburger Toggle BTN --> */}
        </div>
      </div>
    </header>
  );
};
