import { ReactNode } from "react";

import { TabsLayout } from "./tabs.layout";

export default function Layout({ children }: { children: ReactNode }): ReactNode {
    return (
        <div>
            <div className="w-full h-max border-b-[1px] p-2">
                <TabsLayout />
            </div>
            <div className="p-2 h-[calc(100vh-140px)] overflow-x-hidden overflow-y-scroll">
                {children}
            </div>
        </div>
    );
}
