import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";

import { SignupForm } from "@/components/forms/signup-form";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/logo.svg"
              alt="Bear Miner Logo"
              width={50}
              height={50}
            />

            <h1 className="text-2xl font-serif">Bear Miner</h1>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
    <div className="bg-primary/10   relative hidden lg:block">
        <Image
          src="/assets/hero.svg"
          alt="Hero Image"
        //   width={800}
        //   height={600}
          className="absolute inset-0 h-full w-full object-cover"
         fill
        />
      </div>
    </div>
  );
}
