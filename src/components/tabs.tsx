type Tab = {
  label: string;
  content: JSX.Element;
};

type Props = {
  tabs: Tab[];
  tabIndex: number;
  setTabIndex: (index: number) => void;
};

const Tabs = ({ tabs, tabIndex, setTabIndex }: Props) => {

  return (
    <div>
      <div>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setTabIndex(index)}
            style={{
              fontWeight: index === tabIndex ? 'bold' : 'normal',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[tabIndex].content}</div>
    </div>
  );
};

export default Tabs;