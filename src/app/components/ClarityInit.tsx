"use client";
import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

export default function ClarityInit() {
    useEffect(() => {
        if (typeof window !== "undefined") {
            Clarity.init('sh3gwrtagw');
        }
    }, []);

    return null;
}