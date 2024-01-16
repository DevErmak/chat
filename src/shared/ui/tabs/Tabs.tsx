import { useState } from 'react';

interface ITabProps {
  tabs: { title: React.ReactNode; content: React.ReactNode }[];
  classNameTab?: string | string[];
  classNameContent?: string | string[];
}
export const Tabs: React.FC<ITabProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={index === activeTab ? 'active' : ''}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="content">{tabs[activeTab].content}</div>
    </div>
  );
};
