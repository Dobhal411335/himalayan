import News from "@/components/Admin/News";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function ManagerChatPage() {
    return (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                </div>
            </header>
            <News />
        </SidebarInset>
    );
}
