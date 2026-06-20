"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Monitor,
  Gamepad2,
  Bot,
  Cloud,
  Video,
  Mail,
  Laptop,
  Smartphone,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { EMISSION_FACTORS } from "@/lib/emission-factors";
import type { StreamingQuality, GamingPlatform } from "@/types";

const getSingleValue = (val: number | readonly number[]): number => {
  return typeof val === "number" ? val : val[0];
};

export function HabitForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Collapsible section states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    streaming: true,
    gaming: false,
    aiUsage: false,
    cloudStorage: false,
    videoMeetings: false,
    emails: false,
    devices: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Form states
  const [streaming, setStreaming] = useState<{ hoursPerDay: number; quality: StreamingQuality }>({
    hoursPerDay: 2,
    quality: "1080p",
  });
  const [gaming, setGaming] = useState<{ hoursPerDay: number; platform: GamingPlatform }>({
    hoursPerDay: 1,
    platform: "pc",
  });
  const [aiUsage, setAiUsage] = useState({ promptsPerDay: 10, imageGensPerDay: 2, codingHours: 1 });
  const [cloudStorage, setCloudStorage] = useState({ storageGB: 50 });
  const [videoMeetings, setVideoMeetings] = useState({ hoursPerWeek: 10 });
  const [emails, setEmails] = useState({ sentPerDay: 15 });
  const [devices, setDevices] = useState({ laptopHours: 6, desktopHours: 0, smartphoneHours: 4 });

  // Client-side real-time calculation in kg CO2 per month (derived state)
  const streamVal = (streaming.hoursPerDay * EMISSION_FACTORS.streaming[streaming.quality] * 30) / 1000;
  const gameVal = (gaming.hoursPerDay * EMISSION_FACTORS.gaming[gaming.platform] * 30) / 1000;

  const promptVal = aiUsage.promptsPerDay * EMISSION_FACTORS.ai.textPrompt * 30;
  const imgVal = aiUsage.imageGensPerDay * EMISSION_FACTORS.ai.imageGeneration * 30;
  const aiCodeVal = aiUsage.codingHours * EMISSION_FACTORS.ai.codingAssistant * 30;
  const aiVal = (promptVal + imgVal + aiCodeVal) / 1000;

  const cloudVal = (cloudStorage.storageGB * EMISSION_FACTORS.cloudStorage) / 1000;
  const videoVal = (videoMeetings.hoursPerWeek * 4.33 * EMISSION_FACTORS.videoMeetings) / 1000;
  const emailVal = (emails.sentPerDay * EMISSION_FACTORS.emails * 30) / 1000;

  const lapVal = devices.laptopHours * EMISSION_FACTORS.devices.laptop * 30;
  const deskVal = devices.desktopHours * EMISSION_FACTORS.devices.desktop * 30;
  const smartVal = devices.smartphoneHours * EMISSION_FACTORS.devices.smartphone * 30;
  const devVal = (lapVal + deskVal + smartVal) / 1000;

  const estimatedEmissions = {
    streaming: Math.round(streamVal * 100) / 100,
    gaming: Math.round(gameVal * 100) / 100,
    aiUsage: Math.round(aiVal * 100) / 100,
    cloudStorage: Math.round(cloudVal * 100) / 100,
    videoMeetings: Math.round(videoVal * 100) / 100,
    emails: Math.round(emailVal * 100) / 100,
    devices: Math.round(devVal * 100) / 100,
    total: Math.round((streamVal + gameVal + aiVal + cloudVal + videoVal + emailVal + devVal) * 100) / 100,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const habitRes = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          streaming,
          gaming,
          aiUsage,
          cloudStorage,
          videoMeetings,
          emails,
          devices,
        }),
      });

      const habitData = await habitRes.json();
      if (!habitRes.ok || !habitData.success) {
        throw new Error(habitData.error || "Failed to log habits");
      }

      const habitEntryId = habitData.data._id;

      const calcRes = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitEntryId }),
      });

      const calcData = await calcRes.json();
      if (!calcRes.ok || !calcData.success) {
        throw new Error(calcData.error || "Failed to calculate emissions");
      }

      toast.success("Habits logged and carbon footprint calculated!");
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Error submitting habits";
      toast.error(message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border border-emerald-500/25 bg-emerald-500/5 sticky top-16 z-10 backdrop-blur-md">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-emerald-500">Real-time Estimate</h4>
            <p className="text-xs text-muted-foreground">Monthly digital carbon footprint based on your selections</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-500">
              {estimatedEmissions.total ? estimatedEmissions.total.toFixed(1) : "0.0"} kg
            </span>
            <span className="text-xs text-muted-foreground block">CO₂ equivalent</span>
          </div>
        </CardContent>
      </Card>

      {/* 1. Streaming */}
      <Card className="glass border-border/40 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("streaming")}
          className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-muted/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Monitor className="h-5 w-5" />
            </div>
            <div className="text-left">
              <CardTitle className="text-base font-bold">1. Video Streaming</CardTitle>
              <CardDescription>Netflix, YouTube, Twitch, etc.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
              {estimatedEmissions.streaming || 0} kg/mo
            </span>
            {openSections.streaming ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
          </div>
        </button>
        <AnimatePresence>
          {openSections.streaming && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden border-t border-border/30"
            >
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="streaming-hours" className="text-sm font-semibold">Hours per Day</Label>
                    <span className="text-xs font-bold text-emerald-500">{streaming.hoursPerDay} hours</span>
                  </div>
                  <Slider
                    id="streaming-hours"
                    min={0}
                    max={12}
                    step={0.5}
                    value={[streaming.hoursPerDay]}
                    onValueChange={(val) => setStreaming((prev) => ({ ...prev, hoursPerDay: getSingleValue(val) }))}
                    className="cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="streaming-quality" className="text-sm font-semibold">Default Resolution</Label>
                  <Select
                    value={streaming.quality}
                    onValueChange={(val) => setStreaming((prev) => ({ ...prev, quality: val as StreamingQuality }))}
                  >
                    <SelectTrigger id="streaming-quality" className="border-border/60 bg-background/50">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="480p" className="cursor-pointer">480p (Standard definition)</SelectItem>
                      <SelectItem value="720p" className="cursor-pointer">720p (High definition)</SelectItem>
                      <SelectItem value="1080p" className="cursor-pointer">1080p (Full HD)</SelectItem>
                      <SelectItem value="4K" className="cursor-pointer">4K (Ultra HD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* 2. Gaming */}
      <Card className="glass border-border/40 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("gaming")}
          className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-muted/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div className="text-left">
              <CardTitle className="text-base font-bold">2. Video Gaming</CardTitle>
              <CardDescription>PC, console, or cloud gaming platforms</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500">
              {estimatedEmissions.gaming || 0} kg/mo
            </span>
            {openSections.gaming ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
          </div>
        </button>
        <AnimatePresence>
          {openSections.gaming && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden border-t border-border/30"
            >
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="gaming-hours" className="text-sm font-semibold">Hours per Day</Label>
                    <span className="text-xs font-bold text-blue-500">{gaming.hoursPerDay} hours</span>
                  </div>
                  <Slider
                    id="gaming-hours"
                    min={0}
                    max={12}
                    step={0.5}
                    value={[gaming.hoursPerDay]}
                    onValueChange={(val) => setGaming((prev) => ({ ...prev, hoursPerDay: getSingleValue(val) }))}
                    className="cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gaming-platform" className="text-sm font-semibold">Platform</Label>
                  <Select
                    value={gaming.platform}
                    onValueChange={(val) => setGaming((prev) => ({ ...prev, platform: val as GamingPlatform }))}
                  >
                    <SelectTrigger id="gaming-platform" className="border-border/60 bg-background/50">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="pc" className="cursor-pointer">Gaming PC (high-intensity)</SelectItem>
                      <SelectItem value="console" className="cursor-pointer">Console (PlayStation, Xbox, Switch)</SelectItem>
                      <SelectItem value="cloud" className="cursor-pointer">Cloud Gaming (GeForce Now, Xbox Cloud)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* 3. AI Usage */}
      <Card className="glass border-border/40 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("aiUsage")}
          className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-muted/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div className="text-left">
              <CardTitle className="text-base font-bold">3. AI Tools & Assistants</CardTitle>
              <CardDescription>ChatGPT prompts, image generation, copilot coders</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-500">
              {estimatedEmissions.aiUsage || 0} kg/mo
            </span>
            {openSections.aiUsage ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
          </div>
        </button>
        <AnimatePresence>
          {openSections.aiUsage && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden border-t border-border/30"
            >
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-prompts" className="text-sm font-semibold">Text Prompts per Day</Label>
                    <Input
                      id="ai-prompts"
                      type="number"
                      min={0}
                      value={aiUsage.promptsPerDay}
                      onChange={(e) => setAiUsage((prev) => ({ ...prev, promptsPerDay: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="border-border/60 bg-background/50 text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ai-images" className="text-sm font-semibold">Image Generations per Day</Label>
                    <Input
                      id="ai-images"
                      type="number"
                      min={0}
                      value={aiUsage.imageGensPerDay}
                      onChange={(e) => setAiUsage((prev) => ({ ...prev, imageGensPerDay: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="border-border/60 bg-background/50 text-foreground"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="ai-coding" className="text-sm font-semibold">AI Coding (Hours/Day)</Label>
                    <span className="text-xs font-bold text-purple-500">{aiUsage.codingHours} hours</span>
                  </div>
                  <Slider
                    id="ai-coding"
                    min={0}
                    max={12}
                    step={0.5}
                    value={[aiUsage.codingHours]}
                    onValueChange={(val) => setAiUsage((prev) => ({ ...prev, codingHours: getSingleValue(val) }))}
                    className="cursor-pointer"
                  />
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* 4. Cloud Storage */}
      <Card className="glass border-border/40 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("cloudStorage")}
          className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-muted/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Cloud className="h-5 w-5" />
            </div>
            <div className="text-left">
              <CardTitle className="text-base font-bold">4. Cloud Storage</CardTitle>
              <CardDescription>iCloud, Google Drive, OneDrive space in use</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400">
              {estimatedEmissions.cloudStorage || 0} kg/mo
            </span>
            {openSections.cloudStorage ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
          </div>
        </button>
        <AnimatePresence>
          {openSections.cloudStorage && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden border-t border-border/30"
            >
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cloud-gb" className="text-sm font-semibold">Total Cloud Storage (GB)</Label>
                  <Input
                    id="cloud-gb"
                    type="number"
                    min={0}
                    value={cloudStorage.storageGB}
                    onChange={(e) => setCloudStorage({ storageGB: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="border-border/60 bg-background/50 text-foreground"
                  />
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* 5. Video Meetings */}
      <Card className="glass border-border/40 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("videoMeetings")}
          className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-muted/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Video className="h-5 w-5" />
            </div>
            <div className="text-left">
              <CardTitle className="text-base font-bold">5. Video Meetings</CardTitle>
              <CardDescription>Zoom, Meet, Teams conference calls</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500">
              {estimatedEmissions.videoMeetings || 0} kg/mo
            </span>
            {openSections.videoMeetings ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
          </div>
        </button>
        <AnimatePresence>
          {openSections.videoMeetings && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden border-t border-border/30"
            >
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="video-hours" className="text-sm font-semibold">Hours per Week</Label>
                    <span className="text-xs font-bold text-rose-500">{videoMeetings.hoursPerWeek} hours</span>
                  </div>
                  <Slider
                    id="video-hours"
                    min={0}
                    max={40}
                    step={1}
                    value={[videoMeetings.hoursPerWeek]}
                    onValueChange={(val) => setVideoMeetings({ hoursPerWeek: getSingleValue(val) })}
                    className="cursor-pointer"
                  />
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* 6. Emails */}
      <Card className="glass border-border/40 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("emails")}
          className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-muted/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <div className="text-left">
              <CardTitle className="text-base font-bold">6. Emails</CardTitle>
              <CardDescription>Emails sent & received daily</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-500">
              {estimatedEmissions.emails || 0} kg/mo
            </span>
            {openSections.emails ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
          </div>
        </button>
        <AnimatePresence>
          {openSections.emails && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden border-t border-border/30"
            >
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-sent" className="text-sm font-semibold">Sent/Received per Day</Label>
                  <Input
                    id="email-sent"
                    type="number"
                    min={0}
                    value={emails.sentPerDay}
                    onChange={(e) => setEmails({ sentPerDay: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="border-border/60 bg-background/50 text-foreground"
                  />
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* 7. Screen Time / Devices */}
      <Card className="glass border-border/40 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("devices")}
          className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-muted/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
              <Laptop className="h-5 w-5" />
            </div>
            <div className="text-left">
              <CardTitle className="text-base font-bold">7. Device Screen Time</CardTitle>
              <CardDescription>Laptop, desktop PC, and smartphone usage</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-500">
              {estimatedEmissions.devices || 0} kg/mo
            </span>
            {openSections.devices ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
          </div>
        </button>
        <AnimatePresence>
          {openSections.devices && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden border-t border-border/30"
            >
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="laptop-hours" className="text-sm font-semibold flex items-center gap-1.5">
                      <Laptop className="h-4 w-4 text-pink-400" /> Laptop (Hours/Day)
                    </Label>
                    <span className="text-xs font-bold text-pink-500">{devices.laptopHours} hours</span>
                  </div>
                  <Slider
                    id="laptop-hours"
                    min={0}
                    max={16}
                    step={0.5}
                    value={[devices.laptopHours]}
                    onValueChange={(val) => setDevices((prev) => ({ ...prev, laptopHours: getSingleValue(val) }))}
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="desktop-hours" className="text-sm font-semibold flex items-center gap-1.5">
                      <Monitor className="h-4 w-4 text-pink-400" /> Desktop PC (Hours/Day)
                    </Label>
                    <span className="text-xs font-bold text-pink-400">{devices.desktopHours} hours</span>
                  </div>
                  <Slider
                    id="desktop-hours"
                    min={0}
                    max={16}
                    step={0.5}
                    value={[devices.desktopHours]}
                    onValueChange={(val) => setDevices((prev) => ({ ...prev, desktopHours: getSingleValue(val) }))}
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="smartphone-hours" className="text-sm font-semibold flex items-center gap-1.5">
                      <Smartphone className="h-4 w-4 text-pink-400" /> Smartphone (Hours/Day)
                    </Label>
                    <span className="text-xs font-bold text-pink-400">{devices.smartphoneHours} hours</span>
                  </div>
                  <Slider
                    id="smartphone-hours"
                    min={0}
                    max={16}
                    step={0.5}
                    value={[devices.smartphoneHours]}
                    onValueChange={(val) => setDevices((prev) => ({ ...prev, smartphoneHours: getSingleValue(val) }))}
                    className="cursor-pointer"
                  />
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={submitting}
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-6 rounded-2xl cursor-pointer shadow-lg"
        >
          {submitting ? "Calculating Footprint..." : "Calculate Carbon Footprint"}
        </Button>
      </div>
    </form>
  );
}
