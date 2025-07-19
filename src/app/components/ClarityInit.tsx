"use client";
import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

export default function ClarityInit() {
    useEffect(() => {
        if (typeof window !== "undefined") {
            Clarity.init(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID as string);
        }
    }, []);

    return null;
}