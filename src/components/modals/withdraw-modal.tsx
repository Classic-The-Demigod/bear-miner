import { Button } from "@/components/ui/button";

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
} from "@/components/ui/alert-dialog";

const WithdrawModal = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-primary text-[#F4D2AF] font-serif hover:bg-primary/90 px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform shadow-[0_4px_0_rgba(0,0,0,1)] border-2 border-[#0E0000]">
          Withdraw Tokens
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl">
            Thank You for Your Interest
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-4 pt-4">
            <p className="text-base font-medium">
              Claim will be live once launch.
            </p>
            <p className="text-base font-medium">
              Gear up for more exciting news coming!
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction className="bg-primary text-[#F4D2AF] font-serif hover:bg-primary/90 px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform shadow-[0_4px_0_rgba(0,0,0,1)] border-2 border-[#0E0000]">
            Got it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WithdrawModal;
