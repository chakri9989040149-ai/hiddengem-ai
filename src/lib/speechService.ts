/**
 * SPEECH RECOGNITION SERVICE (Browser Web Speech API)
 * Provides voice listening with permissions checks and fallback to keyboard typing.
 */

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export class SpeechInputService {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public startListening(
    langCode: string,
    onResult: (text: string) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): void {
    if (!this.recognition) {
      onError('Voice recognition not supported in this browser. Please use text typing.');
      return;
    }

    if (this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }

    this.recognition.lang = langCode || 'en-IN';

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      if (event.error === 'not-allowed') {
        onError('Microphone permission denied. Please allow microphone access or type your message.');
      } else {
        onError(`Voice input error (${event.error}). Please type below.`);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.isListening = true;
      this.recognition.start();
    } catch {
      this.isListening = false;
      onError('Unable to access microphone. Please type your message.');
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.isListening = false;
    }
  }
}

export const speechService = new SpeechInputService();
