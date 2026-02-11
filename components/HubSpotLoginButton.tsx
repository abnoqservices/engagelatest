'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plug, Unplug } from "lucide-react";

interface HubSpotLoginButtonProps {
  connected: boolean;                    // controlled from parent
  onDisconnectSuccess?: () => void;      // callback when disconnect succeeds
}

export default function HubSpotLoginButton({
  connected,
  onDisconnectSuccess,
}: HubSpotLoginButtonProps) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleLogin = () => {
    // You might want to move these to environment variables in production
    const clientId = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID || "0b326f43-29e3-4d0c-b250-c83607cb3b3f";
    const redirectUri = process.env.NEXT_PUBLIC_HUBSPOT_REDIRECT_URI || "http://localhost:3000/api/hubspot/integrations";

    const scopes = [
      "crm.schemas.contacts.write",
      "oauth",
      "crm.schemas.contacts.read",
      "crm.objects.leads.read",
      "crm.objects.leads.write",
      // Add more scopes if needed, e.g.:
      // "crm.objects.companies.read", "crm.objects.deals.read/write", etc.
    ].join(" ");

    const authUrl = `https://app-na2.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes)}`;

    window.location.href = authUrl;
  };

  const handleDisconnect = async () => {
    if (isDisconnecting) return;

    setIsDisconnecting(true);

    try {
      const response = await fetch("/api/hubspot/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // credentials: "include",    // ← add if you're using cookies/sessions
      });

      if (!response.ok) {
        throw new Error(`Disconnect failed: ${response.status}`);
      }

      // Success
      onDisconnectSuccess?.();   // ← This tells parent to refresh status
    } catch (err) {
      console.error("HubSpot disconnect error:", err);
      // Optional: show toast from here if you have access to toast context
      // showToast("Failed to disconnect HubSpot", "error");
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <Button
      size="sm"
      className="w-full"
      onClick={connected ? handleDisconnect : handleLogin}
      variant={connected ? "destructive" : "default"}
      disabled={isDisconnecting}
    >
      {isDisconnecting ? (
        <>Disconnecting...</>
      ) : connected ? (
        <>
          <Unplug className="h-4 w-4 mr-2" />
          Disconnect HubSpot
        </>
      ) : (
        <>
          <Plug className="h-4 w-4 mr-2" />
          Connect HubSpot
        </>
      )}
    </Button>
  );
}