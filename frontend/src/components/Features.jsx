import React from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

// --- Icon components (GlobeIcon, MailIcon, etc.) remain the same ---

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
        <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
);

const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
    </svg>
);

const MessageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path>
    </svg>
);
const DesignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

// --- Data for Features ---

const featuresData = [
  {
    icon: <GlobeIcon />,
    title: 'AI Website Generation',
    description: 'Transform ideas into stunning websites with AI-powered design, intelligent content suggestions, and mobile-responsive layouts. No coding required.',
    items: ['Custom design with industry', 'Mobile responsive layouts', 'SEO optimization included']
  },
  {
    icon: <MailIcon />,
    title: 'Smart Email Marketing',
    description: 'Automatically craft and send personalized marketing emails and newsletters that convert leads into customers.',
    items: ['Automated compelling copy', 'Automated scheduling', 'Performance tracking']
  },
  {
    icon: <ImageIcon />,
    title: 'AI Image Creation',
    description: 'Generate stunning product images and marketing visuals from simple text descriptions or basic sketches.',
    items: ['Text-to-image generation', 'Image enhancement tools', 'Multiple style options']
  },
  {
    icon: <MessageIcon />,
    title: 'AI Support',
    description: 'Deploy intelligent chatbots that handle customer queries 24/7, improving satisfaction and reducing support costs.',
    items: ['Natural language processing', 'Multi-language support', 'Seamless handoff to Humans']
  },
  {
    icon: <DesignIcon />,
    title: 'Logo Generator',
    description: 'Deploy intelligent chatbots that handle customer queries 24/7, improving satisfaction and reducing support costs.',
    items: ['Natural language processing', 'Multi-language support', 'Seamless handoff to Humans']
  }
];

function Features() {
  const navigate = useNavigate();
  return (
    <section className="features" id="features">
      <div className="features-grid">
        {featuresData.map((feature, index) => (
          <div 
            key={index} 
            className="feature-card" 
             onClick={() => {
              if (index === 0) navigate('/BuildWed');
              else if (index === 2) navigate('/Image');
              else if (index === 1) navigate('/Email');
              else if (index === 3) navigate('/ChatAi');
              else if (index === 4) navigate('/Logo');
            }}
            style={(index === 0 || index === 2) ? { cursor: 'pointer' } : {}}
          >
            <div className="feature-card-icon-wrapper">
              {feature.icon}
            </div>
            <h3 className="feature-card-title">{feature.title}</h3>
            <p className="feature-card-description">{feature.description}</p>
            <ul className="feature-card-list">
              {feature.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {/* The button has been removed from here */}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;