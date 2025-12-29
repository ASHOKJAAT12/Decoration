"use client";

import { useState } from 'react';
import { Button } from "@/app/ui/button";
import { Input } from "@/app/ui/input";
import { Label } from "@/app/ui/label";
import { Textarea } from "@/app/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/ui/card";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult("Sending...");

    const formData = new FormData(event.target);
    formData.append("access_key", "ebf6434a-b6d2-4805-988c-70d8358317f8");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("🎉 Form submitted successfully! We'll contact you soon.");
        setResult("Success! Your inquiry has been sent.");
        event.target.reset();
      } else {
        toast.error("Something went wrong. Please try again.");
        setResult("Error: " + (data.message || "Submission failed"));
      }
    } catch (error) {
      toast.error("Network error. Please check your connection.");
      setResult("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-0 shadow-2xl bg-linear-to-br from-white via-slate-50/50 to-indigo-50/30 backdrop-blur-sm">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-4xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          Let's Plan Your Perfect Event
        </CardTitle>
        <CardDescription className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Fill out the details below and our event specialists will create a customized proposal just for you.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <form onSubmit={onSubmit} className="p-8 space-y-8">
          {/* Personal Info - 2 Column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-semibold text-slate-900 tracking-wide">
                Full Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                className="h-14 text-lg border-2 bg-white/80 hover:border-indigo-400 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30 transition-all duration-200 shadow-sm"
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="mobile" className="text-sm font-semibold text-slate-900 tracking-wide">
                Mobile Number *
              </Label>
              <Input
                id="mobile"
                name="mobile"
                type="tel"
                placeholder="+91 98765 43210"
                required
                className="h-14 text-lg border-2 bg-white/80 hover:border-indigo-400 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30 transition-all duration-200 shadow-sm"
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-900 tracking-wide">
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                className="h-14 text-lg border-2 bg-white/80 hover:border-indigo-400 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30 transition-all duration-200 shadow-sm"
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="address" className="text-sm font-semibold text-slate-900 tracking-wide">
                Venue Address
              </Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Event venue address or city"
                className="h-14 text-lg border-2 bg-white/80 hover:border-indigo-400 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30 transition-all duration-200 shadow-sm"
                disabled={loading}
              />
            </div>
          </div>

          {/* Event Details - 2 Column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="eventName" className="text-sm font-semibold text-slate-900 tracking-wide">
                Event Name *
              </Label>
              <Input
                id="eventName"
                name="eventName"
                type="text"
                placeholder="Wedding, Birthday, Corporate Gala..."
                required
                className="h-14 text-lg border-2 bg-white/80 hover:border-indigo-400 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30 transition-all duration-200 shadow-sm"
                disabled={loading}
              />
            </div>

            <div className="space-y-3 relative">
              <Label htmlFor="eventDate" className="text-sm font-semibold text-slate-900 tracking-wide">
                Event Date *
              </Label>
              <Input
                id="eventDate"
                name="eventDate"
                type="date"
                required
                className="h-14 text-lg border-2 bg-white/80 pl-12 hover:border-indigo-400 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30 transition-all duration-200 shadow-sm"
                disabled={loading}
              />
              <Calendar className="w-5 h-5 text-slate-400 absolute left-4 top-13 pointer-events-none" />
            </div>

            <div className="space-y-3">
              <Label htmlFor="budget" className="text-sm font-semibold text-slate-900 tracking-wide">
                Budget Range
              </Label>
              <Input
                id="budget"
                name="budget"
                type="text"
                placeholder="₹50,000 - ₹5,00,000"
                className="h-14 text-lg border-2 bg-white/80 hover:border-indigo-400 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30 transition-all duration-200 shadow-sm"
                disabled={loading}
              />
            </div>
          </div>

          {/* Message Area */}
          <div className="space-y-4">
            <Label htmlFor="message" className="text-sm font-semibold text-slate-900 tracking-wide">
              Event Details & Requirements *
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about your event vision...&#10;&#10;- Guest count&#10;- Theme & decoration style&#10;- Special requirements (stage, lighting, catering, etc.)&#10;- Any inspiration or reference images&#10;- Additional services needed"
              className="min-h-40 text-lg border-2 bg-white/80 p-5 resize-vertical focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30 transition-all duration-200 shadow-sm font-medium leading-relaxed"
              required
              disabled={loading}
            />
            <p className="text-xs text-slate-500 italic flex items-center gap-1">
              💡 The more details you provide, the better we can customize your event
            </p>
          </div>

          {/* Result Message */}
          {result && (
            <div className={`p-5 rounded-2xl text-sm font-medium shadow-lg transform transition-all duration-300 ${
              result.includes('Success') 
                ? 'bg-linear-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-200 text-emerald-800' 
                : 'bg-linear-to-r from-rose-500/10 to-red-500/10 border-2 border-rose-200 text-rose-800'
            }`}>
              {result}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="h-14 flex-1 border-2 text-lg font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={() => {
                setResult("");
                document.querySelector('form')?.reset();
              }}
              disabled={loading}
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-14 flex-1 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 px-8"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                  Sending Request...
                </>
              ) : (
                "Get Free Quote →"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
