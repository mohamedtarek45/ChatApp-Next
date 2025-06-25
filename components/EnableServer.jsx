"use client";
import { useEffect } from "react";

export default function EnableServer() {
  useEffect(() => {
    const startServer = async () => {
     await fetch(
        "https://console.cron-job.org/jobs/6266237",
        { cache: "no-store" }
      );
    };
    startServer();
  }, []);

  return null;
}
