import { ReactNode } from "react";

import { TabsLayout as Tabs } from "./tabs.layout";

export default function Layout({ children }: { children: ReactNode }): ReactNode {
    return <Tabs>{children}</Tabs>;
}
