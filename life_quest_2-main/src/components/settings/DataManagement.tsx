"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"


export function DataManagement() {
    const { toast } = useToast()

    const handleExport = () => {
        toast({
            title: "Exporting data...",
            description: "Your data is being prepared for download.",
        })
    }
    
    const handleDelete = () => {
         toast({
            title: "Account Deletion Requested",
            description: "Your account is scheduled for deletion. You will receive an email confirmation.",
            variant: "destructive",
        })
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>
                        Export or delete your personal data.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-medium">Export Your Data</h3>
                        <p className="text-sm text-muted-foreground">Download a copy of all your data from LifeQuest.</p>
                    </div>
                     <div>
                        <h3 className="font-medium">Delete Your Account</h3>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4 flex justify-between">
                     <Button variant="secondary" onClick={handleExport}>Export Data</Button>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete Account</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                </CardFooter>
            </Card>
        </>
    )
}
