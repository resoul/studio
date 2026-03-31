'use client';
import { Basics } from "./components/general-settings/basics";
import { Preferences } from "./components/general-settings/preferences";
import { ContactChannels } from "./components/general-settings/contact-cannels";
import { AIFeatures } from "./components/general-settings/ai-features";

export function GeneralSettings() {
  return ( 
    <div className="space-y-5">
      <Basics /> 
      <Preferences />
      <AIFeatures />
      <ContactChannels />
    </div>
  );
}