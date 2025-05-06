import { TabsContent } from "@/components/ui/tabs";
import { ReactNode } from "react";

import { UserList } from "./list.layout";

export default function Page(): ReactNode {
    return (
        <TabsContent value="users">
            <UserList />
        </TabsContent>
    );
}
