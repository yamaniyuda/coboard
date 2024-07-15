import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { OrganizationProfile } from "@clerk/nextjs"
import { Plus } from "lucide-react"

const InviteButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Invite members
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none max-w-max">
        <OrganizationProfile routing="virtual" appearance={{
          elements: {
            cardBox: {
              width: "880px",
              height: "80vh"
            }
          }
        }} />
      </DialogContent>
    </Dialog>
  )
}

export { InviteButton }