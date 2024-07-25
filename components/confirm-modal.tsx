import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"

interface ConfirmModalProps {
  children: React.ReactNode
  onConfirm: () => void
  disabled?: boolean
  header: string
  description?: string
}

export const ConfirmModal: React.FC<ConfirmModalProps> = (props) => {
  const onClickHandler = () => {
    props.onConfirm()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {props.children}    
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {props.header}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {props.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cencel</AlertDialogCancel>
          <AlertDialogAction disabled={props.disabled} onClick={onClickHandler}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}