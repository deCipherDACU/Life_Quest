import PageHeader from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { AppearanceForm } from "@/components/settings/AppearanceForm";
import { NotificationsForm } from "@/components/settings/NotificationsForm";
import { DataManagement } from "@/components/settings/DataManagement";

export default function SettingsPage() {
    return (
        <>
            <PageHeader
                title="Settings"
                description="Manage your account, preferences, and notifications."
            />
            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="data">Data</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="space-y-4">
                    <ProfileForm />
                </TabsContent>
                <TabsContent value="appearance" className="space-y-4">
                    <AppearanceForm />
                </TabsContent>
                <TabsContent value="notifications" className="space-y-4">
                    <NotificationsForm />
                </TabsContent>
                 <TabsContent value="data" className="space-y-4">
                    <DataManagement />
                </TabsContent>
            </Tabs>
        </>
    );
}
