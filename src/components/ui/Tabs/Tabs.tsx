import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  ReactElement,
  ReactNode,
  useContext,
  useId,
  useMemo,
  useState
} from 'react';
import clsx from 'clsx';
import styles from './Tabs.module.css';

type TabsContextValue = {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  tabsId: string;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

type TabsProps = {
  children: ReactNode;
  defaultIndex?: number;
  className?: string;
};

export const Tabs = ({ children, defaultIndex = 0, className }: TabsProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const tabsId = useId();
  const contextValue = useMemo(() => ({ activeIndex, setActiveIndex, tabsId }), [activeIndex, tabsId]);

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={clsx(styles.tabs, className)}>{children}</div>
    </TabsContext.Provider>
  );
};

type TabListProps = {
  children: ReactNode;
  className?: string;
};

export const TabList = ({ children, className }: TabListProps) => (
  <div className={clsx(styles['tabs__list'], className)} role="tablist">
    {children}
  </div>
);

type TabProps = {
  children: ReactNode;
  index: number;
  className?: string;
};

export const Tab = ({ children, index, className }: TabProps) => {
  const context = useTabsContext();
  const isActive = context.activeIndex === index;
  const id = `${context.tabsId}-tab-${index}`;
  const panelId = `${context.tabsId}-panel-${index}`;

  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={isActive}
      aria-controls={panelId}
      className={clsx(styles['tabs__tab'], { [styles['tabs__tab--active']]: isActive }, className)}
      onClick={() => context.setActiveIndex(index)}
    >
      {children}
    </button>
  );
};

type TabPanelsProps = {
  children: ReactNode;
  className?: string;
};

export const TabPanels = ({ children, className }: TabPanelsProps) => {
  const context = useTabsContext();
  const childrenArray = Children.toArray(children) as ReactElement[];

  return (
    <div className={clsx(styles['tabs__panels'], className)}>
      {childrenArray.map((child, index) => {
        if (!isValidElement(child)) {
          return null;
        }
        return cloneElement(child, { index, key: child.key ?? index, isActive: context.activeIndex === index });
      })}
    </div>
  );
};

type TabPanelProps = {
  children: ReactNode;
  index?: number;
  isActive?: boolean;
  className?: string;
};

export const TabPanel = ({ children, index = 0, isActive = false, className }: TabPanelProps) => {
  const context = useTabsContext();
  const id = `${context.tabsId}-panel-${index}`;
  const tabId = `${context.tabsId}-tab-${index}`;

  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={tabId}
      hidden={!isActive}
      className={clsx(styles['tabs__panel'], className)}
    >
      {children}
    </div>
  );
};

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be rendered within Tabs');
  }
  return context;
};
