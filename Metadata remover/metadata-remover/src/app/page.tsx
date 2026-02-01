"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { HeroSection } from "@/components/marketing/hero-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";

// Lazy Load Components
const MissionSection = dynamic(
  () => import("@/components/marketing/mission-section").then((mod) => mod.MissionSection),
  { loading: () => <div className="h-[50vh] bg-transparent" /> }
);

const UploadZone = dynamic(
  () => import("@/components/ui/upload-zone").then((mod) => mod.UploadZone),
  { loading: () => <div className="h-64 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl" /> }
);

const ProcessingView = dynamic(
  () => import("@/components/app/processing-view").then((mod) => mod.ProcessingView)
);

export default function Home() {
  const [showApp, setShowApp] = useState(false);
  const { files, addFiles, reset } = useAppStore();

  // Reset state on initial mount to ensure clean slate
  useEffect(() => {
    reset();
  }, [reset]);

  const handleStartApp = () => {
    setShowApp(true);
    // Smooth scroll to top when entering app
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilesSelected = (newFiles: File[]) => {
    addFiles(newFiles);
  };

  const handleBackToHome = () => {
    setShowApp(false);
    setTimeout(() => reset(), 500); // Reset after animation
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatePresence mode="wait">
        {!showApp ? (
          <motion.div
            key="hero"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <HeroSection onStartApp={handleStartApp} />
            <MissionSection />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto pt-24 pb-12 px-4 space-y-6"
          >
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleBackToHome} className="gap-2 hover:bg-muted/50 transition-colors shadow-sm">
                <ArrowLeft className="h-4 w-4" /> Back to Home
              </Button>
            </div>

            <div className="max-w-6xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Remove Metadata</h1>
                <p className="text-[var(--text-secondary)]">
                  Upload your images to strip hidden data instantly.
                </p>
              </div>

              {files.length > 0 ? (
                <ProcessingView />
              ) : (
                <Card className="max-w-4xl mx-auto">
                  <CardHeader>
                    <CardTitle>Upload Images</CardTitle>
                    <CardDescription>
                      Supported formats: JPG, PNG, WebP
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UploadZone onFilesSelected={handleFilesSelected} />
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
