import React from "react";
import CheckUrlSafe from "../urls/check-url-safe";

const CheckLink = () => {
  return (
    <div className="flex min-h-[100vh] flex-1 flex-col items-center justify-center p-6 md:p-24" id="check-link">
      <div className="w-full max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Check Your Link</h1>
        {/* <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Paste your long URL and get a shortened one. It&apos;s free and easy to use.</p> */}
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Paste your URL and check, It&apos;s free and easy to use.</p>

        <CheckUrlSafe />
      </div>
    </div>
  );
};

export default CheckLink;
