import { useState, useEffect, useRef } from "react";
import { matchSymptomsFromText } from "../utils/voiceSymptomMatcher";

export default function VoiceSymptomButton({ lang, onSymptomsDetected, labels }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [detectedSummary, setDetectedSummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  const isHindi = lang === "hi";

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  function startListening() {
    setErrorMessage("");
    setDetectedSummary(null);
    setTranscript("");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setErrorMessage(
        isHindi
          ? "आपके ब्राउज़र में वॉइस रिकग्निशन सपोर्ट नहीं है। कृपया टाइप करें या चेकबॉक्स चुनें।"
          : "Voice recognition is not supported in your browser. Please type or use checkboxes."
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Select speech language: Hindi or Indian English / US English
      recognition.lang = isHindi ? "hi-IN" : "en-IN";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        // Check if final
        const isFinal = event.results[event.results.length - 1].isFinal;
        if (isFinal && currentTranscript.trim()) {
          processSpokenSpeech(currentTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setErrorMessage(
            isHindi
              ? "माइक्रोफ़ोन की अनुमति अस्वीकृत है। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन चालू करें।"
              : "Microphone permission was denied. Please allow microphone access."
          );
        } else if (event.error === "no-speech") {
          setErrorMessage(
            isHindi
              ? "कोई आवाज़ नहीं सुनी गई। कृपया दोबारा माइक दबाकर बोलें।"
              : "No speech detected. Please click the mic and try speaking again."
          );
        } else {
          setErrorMessage(
            isHindi
              ? "आवाज़ पहचानने में समस्या हुई। कृपया दोबारा प्रयास करें।"
              : "Could not recognize speech. Please try again."
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
      setErrorMessage(
        isHindi
          ? "माइक्रोफ़ोन शुरू नहीं हो सका। कृपया पुनः प्रयास करें।"
          : "Could not start microphone. Please try again."
      );
    }
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }

  function processSpokenSpeech(spokenText) {
    const { matchedKeys, customSymptoms } = matchSymptomsFromText(spokenText);
    
    // Call parent handler
    onSymptomsDetected({
      matchedKeys,
      customSymptoms,
      transcript: spokenText,
    });

    const matchedNames = matchedKeys.map((k) => labels[k] || k);
    const allDetected = [...matchedNames, ...customSymptoms];

    if (allDetected.length > 0) {
      setDetectedSummary({
        success: true,
        items: allDetected,
        message: isHindi
          ? `पहचाने गए लक्षण: ${allDetected.join(", ")}`
          : `Recognized symptoms: ${allDetected.join(", ")}`,
      });
    } else {
      setDetectedSummary({
        success: false,
        items: [],
        message: isHindi
          ? `"${spokenText}" सुना गया, पर कोई विशिष्ट लक्षण नहीं मिला। आप नीचे टाइप कर सकते हैं।`
          : `Heard "${spokenText}", but no specific symptoms matched. You can type them below.`,
      });
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDetectedSummary(null);
    }, 6000);
  }

  return (
    <div className="w-full bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-200/80 rounded-2xl p-5 mb-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left info */}
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="relative">
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md
                ${isListening
                  ? "bg-rose-500 text-white shadow-rose-200 scale-105 animate-pulse"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 hover:scale-105"
                }`}
              title={isListening ? (isHindi ? "बोलना रोकें" : "Stop speaking") : (isHindi ? "बोलकर बताएं" : "Click to speak")}
            >
              {isListening ? (
                <svg className="w-7 h-7 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
            {isListening && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
                <span>🎙️</span>
                {isHindi ? "बोलकर लक्षण बताएं (Voice Input)" : "Speak Symptoms (Voice Input)"}
              </h3>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                {isHindi ? "हिंदी" : "English"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isListening
                ? (isHindi ? "सुन रहे हैं... कृपया अपने लक्षण स्पष्ट बोलें (जैसे: 'मुझे बुखार और सिरदर्द है')" : "Listening... Speak symptoms clearly (e.g. 'fever and headache')")
                : (isHindi ? "टाइप करने की ज़रूरत नहीं! माइक दबाएं और अपने लक्षण बोलें।" : "No typing needed! Tap mic and speak your symptoms.")
              }
            </p>
          </div>
        </div>

        {/* Action Button on Right */}
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-sm flex items-center gap-2
              ${isListening
                ? "bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-300"
                : "bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-300"
              }`}
          >
            {isListening ? (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                {isHindi ? "सुनना रोकें" : "Stop Listening"}
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                {isHindi ? "आवाज़ शुरू करें" : "Start Voice"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Transcript / Hearing Box */}
      {isListening && (
        <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center gap-3 text-sm text-emerald-900 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3">
          <span className="flex space-x-1">
            <span className="w-1.5 h-4 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="w-1.5 h-6 bg-emerald-600 rounded-full animate-pulse delay-75"></span>
            <span className="w-1.5 h-3 bg-emerald-400 rounded-full animate-pulse delay-150"></span>
          </span>
          <div className="flex-1 overflow-hidden">
            <span className="text-xs font-semibold text-emerald-600 block mb-0.5">
              {isHindi ? "सुनाई दे रहा है:" : "Hearing:"}
            </span>
            <span className="font-medium italic text-slate-700">
              {transcript || (isHindi ? "बोलिए..." : "Listening for symptoms...")}
            </span>
          </div>
        </div>
      )}

      {/* Feedback Alert for recognized symptoms */}
      {detectedSummary && (
        <div
          className={`mt-4 pt-3 border-t text-xs font-medium rounded-xl px-4 py-3 flex items-start justify-between gap-3 animate-in fade-in duration-300
            ${detectedSummary.success
              ? "bg-emerald-100/70 border-emerald-300 text-emerald-800"
              : "bg-amber-50 border-amber-200 text-amber-800"
            }`}
        >
          <div className="flex items-center gap-2">
            <span>{detectedSummary.success ? "✨" : "ℹ️"}</span>
            <span>{detectedSummary.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setDetectedSummary(null)}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Error display */}
      {errorMessage && (
        <div className="mt-4 pt-3 border-t border-rose-200 text-xs font-medium text-rose-700 bg-rose-50 rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="text-rose-400 hover:text-rose-600 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {!isSupported && (
        <p className="text-[11px] text-slate-400 mt-2 text-center">
          {isHindi
            ? "* आपके वर्तमान ब्राउज़र में वेब स्पीच API उपलब्ध नहीं है, आप नीचे टाइप या चेकबॉक्स से चुन सकते हैं।"
            : "* Web Speech API is not available in this browser. You can type or use checkboxes below."}
        </p>
      )}
    </div>
  );
}
