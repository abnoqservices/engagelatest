import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, X, SwitchCamera, Loader2, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { scanCard, updateCard } from "@/lib/api";
import axiosClient from "@/lib/axiosClient"; // ← Changed import
import ExtractedDataCard from "./ExtractedDataCard";
import CardFieldSelection from "./CardFieldSelection";

interface ExtractedCardData {
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

interface CameraScannerProps {
  onCardScanned?: () => void;
}

const CameraScanner = ({ onCardScanned }: CameraScannerProps) => {
  const [cameraState, setCameraState] = useState<'idle' | 'starting' | 'ready' | 'error'>('idle');
  const [isScanning, setIsScanning] = useState(false);
  const [cardData, setCardData] = useState<ExtractedCardData | null>(null);
  const [cardId, setCardId] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showFieldSelection, setShowFieldSelection] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  // Check for multiple cameras on mount
  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices().then(devices => {
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      setHasMultipleCameras(videoDevices.length > 1);
    }).catch(() => {});
  }, []);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped:', track.kind);
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState('idle');
  }, []);

  const startCamera = useCallback(async () => {
    console.log('Starting camera with facingMode:', facingMode);
    setCameraState('starting');
    setErrorMessage('');

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera not supported on this device/browser');
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
        },
        audio: false,
      };

      console.log('Requesting camera with constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Got stream:', stream.getVideoTracks().length, 'video tracks');
      
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) throw new Error('Video element not found');

      video.srcObject = stream;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('autoplay', 'true');
      video.muted = true;

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Camera initialization timeout'));
        }, 10000);

        const onCanPlay = () => {
          console.log('Video can play, dimensions:', video.videoWidth, 'x', video.videoHeight);
          clearTimeout(timeout);
          video.removeEventListener('canplay', onCanPlay);
          video.removeEventListener('error', onError);
          resolve();
        };

        const onError = (e: Event) => {
          console.error('Video error:', e);
          clearTimeout(timeout);
          video.removeEventListener('canplay', onCanPlay);
          video.removeEventListener('error', onError);
          reject(new Error('Video playback error'));
        };

        video.addEventListener('canplay', onCanPlay);
        video.addEventListener('error', onError);

        if (video.readyState >= 3) {
          console.log('Video already ready');
          clearTimeout(timeout);
          video.removeEventListener('canplay', onCanPlay);
          video.removeEventListener('error', onError);
          resolve();
        }
      });

      await video.play();
      console.log('Video playing, dimensions:', video.videoWidth, 'x', video.videoHeight);
      
      setCameraState('ready');
    } catch (error) {
      console.error('Camera error:', error);
      const message = error instanceof Error ? error.message : 'Unknown camera error';
      setErrorMessage(message);
      setCameraState('error');
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      toast({
        title: "Camera Error",
        description: message.includes('Permission') || message.includes('NotAllowed') 
          ? "Please allow camera access in your browser settings."
          : message,
        variant: "destructive",
      });
    }
  }, [facingMode, toast]);

  const switchCamera = useCallback(async () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    
    if (cameraState === 'ready') {
      stopCamera();
      setTimeout(() => {
        startCamera();
      }, 100);
    }
  }, [facingMode, cameraState, stopCamera, startCamera]);

  const captureImage = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) {
      console.error('Video or canvas not available');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    console.log('Capturing image, video dimensions:', video.videoWidth, 'x', video.videoHeight);

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      toast({
        title: "Capture failed",
        description: "Camera not ready. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const maxSize = 1024;
    let width = video.videoWidth;
    let height = video.videoHeight;
    
    if (width > height) {
      if (width > maxSize) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(video, 0, 0, width, height);

    const imageData = canvas.toDataURL('image/jpeg', 0.85);
    console.log('Image captured, size:', Math.round(imageData.length / 1024), 'KB');
    
    setCapturedImage(imageData);
    stopCamera();
    processImage(imageData);
  }, [stopCamera, toast]);

  const processImage = async (imageData: string) => {
    setIsScanning(true);

    try {
      console.log('Sending image to AI for processing...');
      const result = await scanCard(imageData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to scan card');
      }

      console.log('Card scanned successfully:', result);
      setCardData(result.data!);
      setCardId(result.card_id || null);
      setSavedImageUrl(result.image_url || null);
      setShowFieldSelection(true);
      toast({
        title: "Card scanned!",
        description: "Please select an industry and add remarks.",
      });
    } catch (error) {
      console.error('Error scanning card:', error);
      toast({
        title: "Scan failed",
        description: error instanceof Error ? error.message : "Failed to scan the card. Please try again.",
        variant: "destructive",
      });
      setCapturedImage(null);
    } finally {
      setIsScanning(false);
    }
  };

  // Updated WhatsApp sending using axiosClient
  const sendWhatsAppMessages = async (phoneNumbers: string[], personName: string | null) => {
    if (!phoneNumbers?.length) {
      console.log('No phone numbers to send WhatsApp messages to');
      return;
    }

    try {
      console.log('Sending WhatsApp messages to:', phoneNumbers);

      const { data } = await axiosClient.post('/api/send-whatsapp', {
        phoneNumbers,
        personName: personName || 'there'
      });

      toast({
        title: "WhatsApp messages sent!",
        description: data.message || `Sent to ${phoneNumbers.length} number(s)`,
      });
    } catch (error: any) {
      console.error('WhatsApp send error:', error);

      const errorMsg = error.response?.data?.message 
        || error.message 
        || "Could not send WhatsApp messages";

      toast({
        title: "WhatsApp messages failed",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const handleFieldSave = async (industryField: string | null, remarks: string | null) => {
    if (!cardId) return;
    
    try {
      await updateCard(cardId, { industry_field: industryField, remarks });
      setCardData(prev => prev ? { ...prev, industry_field: industryField, remarks } : prev);
      setShowFieldSelection(false);
      toast({
        title: "Card saved!",
        description: "Your visiting card has been saved with all details.",
      });
      
      if (cardData?.phone_numbers?.length) {
        sendWhatsAppMessages(cardData.phone_numbers, cardData.person_name);
      }
      
      onCardScanned?.();
    } catch (error) {
      toast({
        title: "Failed to save details",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleFieldSkip = () => {
    setShowFieldSelection(false);
    toast({
      title: "Card saved!",
      description: "Your visiting card has been saved.",
    });
    
    if (cardData?.phone_numbers?.length) {
      sendWhatsAppMessages(cardData.phone_numbers, cardData.person_name);
    }
    
    onCardScanned?.();
  };

  const handleScanAnother = () => {
    setCardData(null);
    setCardId(null);
    setCapturedImage(null);
    setSavedImageUrl(null);
    setShowFieldSelection(false);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (showFieldSelection && cardData) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
        <ExtractedDataCard data={cardData} previewImage={savedImageUrl || capturedImage} />
        <CardFieldSelection onSave={handleFieldSave} onSkip={handleFieldSkip} />
      </div>
    );
  }

  if (cardData && !showFieldSelection) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/30">
          <div className="w-10 h-10 rounded-full gradient-secondary flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-medium text-foreground">Card saved to database successfully!</span>
        </div>
        <ExtractedDataCard data={cardData} previewImage={savedImageUrl || capturedImage} />
        <div className="flex justify-center">
          <Button 
            onClick={handleScanAnother}
            size="lg"
            className="gradient-primary text-primary-foreground shadow-glow hover:shadow-elevated transition-all duration-300 px-8"
          >
            <Camera className="w-5 h-5 mr-2" />
            Scan Another Card
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      {cameraState === 'idle' && !capturedImage && !isScanning && (
        <div 
          onClick={startCamera}
          className="group relative flex flex-col items-center justify-center w-full h-80 md:h-96 rounded-3xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-card to-accent/5 cursor-pointer transition-all duration-500 hover:border-primary hover:shadow-glow overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 delay-100" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                <Camera className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full gradient-secondary flex items-center justify-center border-2 border-background">
                <Sparkles className="w-3 h-3 text-accent-foreground" />
              </div>
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">Scan Visiting Card</h3>
            <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
              Tap to open camera and capture a visiting card instantly
            </p>
            <Button className="gradient-primary text-primary-foreground shadow-lg group-hover:shadow-glow transition-all duration-300">
              Open Camera
            </Button>
          </div>
        </div>
      )}

      {cameraState === 'error' && (
        <div className="flex flex-col items-center justify-center w-full h-80 rounded-3xl border-2 border-destructive/30 bg-gradient-to-br from-destructive/5 to-destructive/10">
          <div className="p-6 rounded-2xl bg-destructive/20 mb-6">
            <X className="w-12 h-12 text-destructive" />
          </div>
          <h3 className="text-xl font-heading font-semibold mb-2 text-destructive">Camera Error</h3>
          <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
            {errorMessage || 'Could not access camera'}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setCameraState('idle')} className="border-border">
              Cancel
            </Button>
            <Button onClick={startCamera} className="gradient-primary text-primary-foreground">
              Try Again
            </Button>
          </div>
        </div>
      )}

      {(cameraState === 'starting' || cameraState === 'ready') && (
        <div className="relative rounded-3xl overflow-hidden bg-foreground/95 shadow-elevated">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto min-h-80 max-h-[70vh] object-cover"
            style={{ display: cameraState === 'ready' ? 'block' : 'none' }}
          />
          
          {cameraState === 'starting' && (
            <div className="flex flex-col items-center justify-center min-h-80 bg-foreground/95">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center pulse-glow">
                  <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
                </div>
              </div>
              <p className="text-primary-foreground font-medium mb-2">Starting camera...</p>
              <p className="text-primary-foreground/60 text-sm">Please allow camera access if prompted</p>
            </div>
          )}
          
          {cameraState === 'ready' && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-6 md:inset-10 border-2 border-primary-foreground/50 rounded-2xl">
                <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
                
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground/80 backdrop-blur-sm text-primary-foreground text-xs px-4 py-2 rounded-full whitespace-nowrap border border-primary-foreground/20">
                  Position card within frame
                </div>
              </div>
            </div>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
            <Button
              variant="outline"
              size="icon"
              onClick={stopCamera}
              className="w-12 h-12 rounded-full bg-primary-foreground/20 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/30"
            >
              <X className="w-5 h-5" />
            </Button>
            
            <Button
              size="lg"
              onClick={captureImage}
              disabled={cameraState !== 'ready'}
              className="w-16 h-16 rounded-full gradient-primary shadow-glow hover:scale-110 transition-transform duration-300 disabled:opacity-50"
            >
              <Camera className="w-7 h-7" />
            </Button>

            {hasMultipleCameras && (
              <Button
                variant="outline"
                size="icon"
                onClick={switchCamera}
                disabled={cameraState !== 'ready'}
                className="w-12 h-12 rounded-full bg-primary-foreground/20 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/30"
              >
                <SwitchCamera className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      )}

      {isScanning && (
        <div className="flex flex-col items-center justify-center w-full min-h-80 rounded-3xl border border-border bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center pulse-glow">
              <Sparkles className="w-10 h-10 text-primary-foreground animate-pulse" />
            </div>
            <div className="absolute inset-0 w-20 h-20 rounded-2xl border-4 border-primary/30 animate-ping" />
          </div>
          <h3 className="text-xl font-heading font-semibold mb-2">Processing with AI</h3>
          <p className="text-muted-foreground text-center max-w-xs">
            Extracting data from your visiting card...
          </p>
          <div className="flex gap-1 mt-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraScanner;