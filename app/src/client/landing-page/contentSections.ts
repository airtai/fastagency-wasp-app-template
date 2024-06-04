import { DOCS_URL, FASTAGENCY_WEBSITE__URL } from '../../shared/constants';
import daBoiAvatar from '../static/da-boi.png';
import avatarPlaceholder from '../static/avatar-placeholder.png';

const appName = import.meta.env.REACT_APP_NAME || 'Your SaaS';

export const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Chat', href: '/chat' },
];
export const features = [
  {
    name: 'Real-time Chat Responses',
    description:
      'Engage in seamless real-time conversations with our chat agents that provide instant responses to user queries.',
    icon: '🤝',
    href: FASTAGENCY_WEBSITE__URL,
  },
  {
    name: 'Autonomous Operations',
    description: `Our platform empowers your chat agents to handle complex tasks and decision-making autonomously, reducing the need for constant human oversight.`,
    icon: '🤖',
    href: '',
  },
  {
    name: 'Intelligent Strategy Customization',
    description:
      'Our AI-driven platform analyzes your business objectives to create personalized strategies that resonate with your audience.',
    icon: '⚙️',
    href: '',
  },
  {
    name: 'Data Privacy First',
    description: 'We prioritize data privacy and security, ensuring that user information is protected at all times.',
    icon: '🔐',
    href: '',
  },
];
export const testimonials = [
  {
    name: 'Da Boi',
    role: 'Wasp Mascot',
    avatarSrc: daBoiAvatar,
    socialUrl: 'https://twitter.com/wasplang',
    quote: "I don't even know how to code. I'm just a plushie.",
  },
  {
    name: 'Mr. Foobar',
    role: 'Founder @ Cool Startup',
    avatarSrc: avatarPlaceholder,
    socialUrl: '',
    quote: 'This product makes me cooler than I already am.',
  },
  {
    name: 'Jamie',
    role: 'Happy Customer',
    avatarSrc: avatarPlaceholder,
    socialUrl: '#',
    quote: 'My cats love it!',
  },
];

export const faqs = [
  {
    id: 1,
    question: `What is ${appName}?`,
    answer: `${appName} is a cloud-based software platform that enables users to interact with Multi-agent Large Language Models (LLMs) created using FastAgency. It provides a seamless interface for leveraging AI capabilities in various applications.`,
    href: '',
  },
  {
    id: 2,
    question: 'How do I get started?',
    answer: `To get started, simply sign up for an account and follow the onboarding process. You can start using ${appName} within minutes of signing up.`,
    href: '',
  },
  {
    id: 3,
    question: `What can I do with ${appName}?`,
    answer: `You can use this application to chat with agents created in FastAgency, and any updates to the agents in FastAgency will automatically reflect here.`,
    href: '',
  },
  {
    id: 4,
    question: `Is there a subscription fee for ${appName}?`,
    answer: `No, ${appName} does not require a subscription or payment. It's a free-to-use platform for interacting with Multi-agent LLMs.`,
    href: '',
  },
  {
    id: 5,
    question: `Can I integrate ${appName} with other systems or applications?`,
    answer: `Currently, ${appName} is focused on providing a standalone platform for interacting with Multi-agent LLMs. However, we are exploring integration capabilities for future updates that may allow users to integrate with other systems and applications.`,
    href: '',
  },
];
export const footerNavigation = {
  // app: [
  //   { name: 'Documentation', href: DOCS_URL },
  //   { name: 'Blog', href: BLOG_URL },
  // ],
  company: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms & Conditions', href: '/toc' },
  ],
};
