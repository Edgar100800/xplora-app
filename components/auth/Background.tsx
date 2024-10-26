"use client";

import Image from 'next/image'
import { FaXTwitter } from "react-icons/fa6";

export default function Background() {
    return (
        <div className="relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex">
            <Image
                className="absolute inset-0 w-full h-full object-cover brightness-50"
                alt="bg"
                src="/background/bg.webp"
                width={1280}
                height={843}
            />

            <div className="relative z-20 flex items-center text-lg font-medium">
                <FaXTwitter className="mr-2 h-6 w-6" />
                Xplora
            </div>
            <div className="relative z-20 mt-auto">
                <blockquote className="space-y-2">
                    <p className="text-lg">
                        <span className="font-bold">"Aprende, comparte y crece"</span>
                    </p>
                </blockquote>
            </div>
        </div>
    );
}