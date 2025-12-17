"use client"

import Link from "next/link"
import { ShieldAlert, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F8EBDD] p-4 text-center">
            <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">

                {/* Animated Icon */}
                <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping" />
                    <div className="relative bg-white p-4 rounded-full shadow-xl border border-red-100 flex items-center justify-center h-full w-full">
                        <ShieldAlert className="w-12 h-12 text-red-500" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black font-serif text-[#2D1B0D] tracking-tight">
                        Access Denied
                    </h1>
                    <p className="text-lg text-[#2D1B0D]/60 font-medium leading-relaxed">
                        "The bear cave is reserved for the guardians. <br />
                        Turn back, wanderer." 🐻⛔
                    </p>
                </div>

                <div className="pt-4">
                    <Link href="/">
                        <Button size="lg" className="bg-[#7A4A33] hover:bg-[#633c2a] text-white font-serif rounded-xl h-12 px-8 shadow-lg shadow-[#7A4A33]/20 transition-all hover:scale-105 group">
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Return Home
                        </Button>
                    </Link>
                </div>

                <div className="text-xs text-[#2D1B0D]/30 font-mono mt-12 uppercase tracking-widest">
                    Error: 403_FORBIDDEN
                </div>
            </div>
        </div>
    )
}
