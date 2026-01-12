import { 
  Building2, 
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Linkedin, 
  Instagram, 
  Facebook,
  Twitter,
  Youtube,
  Copy,
  Check,
  Tag,
  MessageSquare,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CardData {
  company_name: string | null;
  person_name: string | null;
  designation: string | null;
  phone_numbers: string[];
  email: string | null;
  website: string | null;
  full_address: string | null;
  city: string | null;
  pincode: string | null;
  social_handles: {
    linkedin: string | null;
    instagram: string | null;
    facebook: string | null;
    x: string | null;
    youtube: string | null;
    other: string | null;
  };
  industry_field?: string | null;
  remarks?: string | null;
}

interface ExtractedDataCardProps {
  data: CardData;
  previewImage: string | null;
}

const ExtractedDataCard = ({ data, previewImage }: ExtractedDataCardProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    toast({
      title: "JSON copied!",
      description: "Card data has been copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const DataRow = ({ 
    icon: Icon, 
    label, 
    value 
  }: { 
    icon: any; 
    label: string; 
    value: string | null | string[];
  }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    
    return (
      <div className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-subtle">
        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
          {Array.isArray(value) ? (
            <div className="flex flex-wrap gap-2">
              {value.map((item, idx) => (
                <Badge key={idx} variant="secondary" className="font-medium">
                  {item}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="font-medium text-foreground break-words">{value}</p>
          )}
        </div>
      </div>
    );
  };

  const SocialLink = ({ 
    icon: Icon, 
    url, 
    label 
  }: { 
    icon: any; 
    url: string | null; 
    label: string;
  }) => {
    if (!url) return null;
    
    return (
      <a
        href={url.startsWith('http') ? url : `https://${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-primary hover:border-primary/40 hover:shadow-lg transition-all duration-300"
      >
        <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium">{label}</span>
        <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
      </a>
    );
  };

  return (
    <div className="space-y-6">
      {/* Preview Image */}
      {previewImage && (
        <div className="rounded-2xl overflow-hidden shadow-elevated border border-border/50">
          <img 
            src={previewImage} 
            alt="Card preview" 
            className="w-full h-auto max-h-80 object-contain bg-gradient-to-br from-muted to-muted/50"
          />
        </div>
      )}

      {/* Extracted Data */}
      <Card className="shadow-elevated border-0 overflow-hidden">
        <CardHeader className="gradient-primary text-primary-foreground p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-heading mb-1">Extracted Data</CardTitle>
              <p className="text-primary-foreground/70 text-sm">AI-powered extraction results</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={copyToClipboard}
              className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0 backdrop-blur-sm"
            >
              {copied ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copied ? 'Copied!' : 'Copy JSON'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4 gradient-card">
          <DataRow icon={Building2} label="Company" value={data.company_name} />
          <DataRow icon={User} label="Name" value={data.person_name} />
          <DataRow icon={Briefcase} label="Designation" value={data.designation} />
          <DataRow icon={Phone} label="Phone Numbers" value={data.phone_numbers} />
          <DataRow icon={Mail} label="Email" value={data.email} />
          <DataRow icon={Globe} label="Website" value={data.website} />
          <DataRow icon={MapPin} label="Address" value={data.full_address} />
          
          {(data.city || data.pincode) && (
            <div className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 transition-all duration-300 hover:border-primary/30">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Location</p>
                <p className="font-medium">
                  {[data.city, data.pincode].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
          )}

          {/* Industry Field */}
          {data.industry_field && (
            <div className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg gradient-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Tag className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Industry / Field</p>
                <Badge className="bg-accent/20 text-accent hover:bg-accent/30 border-0">
                  {data.industry_field}
                </Badge>
              </div>
            </div>
          )}

          {/* Remarks */}
          {data.remarks && (
            <div className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Remarks</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{data.remarks}</p>
              </div>
            </div>
          )}

          {/* Social Handles */}
          {(data.social_handles?.linkedin || 
            data.social_handles?.instagram || 
            data.social_handles?.facebook || 
            data.social_handles?.x ||
            data.social_handles?.youtube ||
            data.social_handles?.other) && (
            <div className="pt-6 border-t border-border">
              <p className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Social Media</p>
              <div className="flex flex-wrap gap-3">
                <SocialLink 
                  icon={Linkedin} 
                  url={data.social_handles?.linkedin} 
                  label="LinkedIn" 
                />
                <SocialLink 
                  icon={Instagram} 
                  url={data.social_handles?.instagram} 
                  label="Instagram" 
                />
                <SocialLink 
                  icon={Facebook} 
                  url={data.social_handles?.facebook} 
                  label="Facebook" 
                />
                <SocialLink 
                  icon={Twitter} 
                  url={data.social_handles?.x} 
                  label="X" 
                />
                <SocialLink 
                  icon={Youtube} 
                  url={data.social_handles?.youtube} 
                  label="YouTube" 
                />
                {data.social_handles?.other && (
                  <SocialLink 
                    icon={Globe} 
                    url={data.social_handles.other} 
                    label="Other" 
                  />
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtractedDataCard;