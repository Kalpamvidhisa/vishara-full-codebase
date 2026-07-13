import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";
import {
  Download,
  Upload,
  Wand2,
  AlertTriangle,
  CheckCircle2,
  FileImage,
  RefreshCw,
  Brain,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";
import { useEffect, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import firebaseApp from "@/lib/firebase";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/disease-analyzer")({
  head: () => ({ meta: [{ title: "AI Disease & Report Analyzer · Vishara" }] }),
  component: DiseaseAnalyzerPage,
});

interface AIAnalysisReport {
  type: string;
  summary: string;
  urgency: "low" | "medium" | "high";
  findings: Array<{
    name: string;
    value: string;
    status: "normal" | "abnormal" | "warning" | "attention";
    description: string;
  }>;
  explanation: string;
  recommendations: string[];
}

const MOCK_ANALYSES: Record<string, AIAnalysisReport> = {
  skin: {
    type: "Disease Image",
    summary: "The image shows localized skin redness, mild scaling, and inflammation, characteristic of mild dermatitis or contact eczema.",
    urgency: "low",
    findings: [
      { name: "Inflammation", value: "Mild Redness", status: "warning", description: "Localized patch of skin is inflamed and red." },
      { name: "Scaling/Dryness", value: "Slight", status: "normal", description: "Minor scaling around the edges of the rash." },
      { name: "Itching Severity", value: "Reported Moderate", status: "attention", description: "Consistent with histamine response in dermatitis." }
    ],
    explanation: "This appears to be contact dermatitis, which is a skin reaction caused by touching something like a soap, chemical, plant, or cosmetic. It is not contagious or dangerous, but can be uncomfortable.",
    recommendations: [
      "Keep the affected skin area clean and dry.",
      "Apply an over-the-counter hydrocortisone cream (if approved by a pharmacist).",
      "Avoid scratching to prevent secondary bacterial infection.",
      "Identify and avoid recent cosmetic or chemical triggers."
    ]
  },
  blood: {
    type: "Lab Report",
    summary: "The uploaded lab result shows borderline low Hemoglobin levels and normal White Blood Cell count, indicating mild iron-deficiency anemia.",
    urgency: "medium",
    findings: [
      { name: "Hemoglobin", value: "10.8 g/dL", status: "abnormal", description: "Normal range is 12.0-15.5 g/dL. Lower levels reduce oxygen carrying capacity." },
      { name: "WBC Count", value: "6,500 /uL", status: "normal", description: "Within normal limits (4,500-11,000 /uL). No sign of acute infection." },
      { name: "Platelet Count", value: "250,000 /uL", status: "normal", description: "Healthy levels (150,000-450,000 /uL) for proper clotting." }
    ],
    explanation: "Mild anemia can lead to feelings of tiredness, weakness, or cold hands. It is typically resolved through dietary changes or iron supplements.",
    recommendations: [
      "Increase consumption of iron-rich foods (spinach, beans, lean meats).",
      "Pair iron-rich foods with Vitamin C (oranges, tomatoes) to improve absorption.",
      "Schedule a follow-up consultation with your doctor to review if supplements are needed."
    ]
  },
  general: {
    type: "Other Record",
    summary: "The document is identified as a health checkup summary sheet. General vitals are stable, with a minor warning on resting heart rate.",
    urgency: "low",
    findings: [
      { name: "Resting Heart Rate", value: "85 bpm", status: "warning", description: "Within standard limits but slightly elevated. Ideal is 60-80 bpm." },
      { name: "Blood Pressure", value: "120/80 mmHg", status: "normal", description: "Optimal blood pressure reading." },
      { name: "Body Mass Index", value: "23.5", status: "normal", description: "Healthy weight range (18.5 - 24.9)." }
    ],
    explanation: "Overall wellness is good. The slightly elevated heart rate could be temporary due to stress, caffeine, or lack of rest.",
    recommendations: [
      "Ensure 7-8 hours of sound sleep.",
      "Limit caffeine intake close to bedtime.",
      "Include 30 minutes of moderate cardiovascular activity daily."
    ]
  }
};

function downloadAIReportPDF(report: AIAnalysisReport, patientName: string) {
  const doc = new jsPDF();
  
  let headerColor = [59, 130, 246]; // Default Blue
  if (report.urgency === "high") headerColor = [239, 68, 68];
  else if (report.urgency === "medium") headerColor = [245, 158, 11];
  else if (report.urgency === "low") headerColor = [16, 185, 129];

  // Header Band
  doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("VISHARA AI - MEDICAL DIAGNOSTIC SUMMARY", 20, 24);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${new Date().toLocaleString()} | Urgency: ${report.urgency.toUpperCase()}`, 20, 32);
  
  // Patient Details
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("PATIENT INFORMATION:", 20, 55);
  doc.setFont("helvetica", "normal");
  doc.text(`Patient Name: ${patientName}`, 20, 62);
  doc.text(`Type of Analysis: ${report.type}`, 20, 68);
  
  // Summary Section
  doc.setFont("helvetica", "bold");
  doc.text("CLINICAL SUMMARY:", 20, 80);
  doc.setFont("helvetica", "normal");
  const summaryLines = doc.splitTextToSize(report.summary, 170);
  doc.text(summaryLines, 20, 87);
  
  let y = 87 + (summaryLines.length * 6) + 10;
  
  // Findings Table
  doc.setFont("helvetica", "bold");
  doc.text("KEY FINDINGS:", 20, y);
  y += 8;
  
  // Table Header
  doc.setFillColor(240, 240, 240);
  doc.rect(20, y - 5, 170, 8, "F");
  doc.setFontSize(10);
  doc.text("Parameter / Symptom", 22, y);
  doc.text("Value / Status", 85, y);
  doc.text("Details / Explanation", 125, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  report.findings.forEach(finding => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.text(finding.name, 22, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${finding.value} (${finding.status})`, 85, y);
    
    const detailLines = doc.splitTextToSize(finding.description, 60);
    doc.text(detailLines, 125, y);
    
    y += Math.max(8, detailLines.length * 5) + 2;
    doc.line(20, y - 5, 190, y - 5);
  });
  
  y += 5;
  
  // Recommendations
  if (y > 230) {
    doc.addPage();
    y = 20;
  }
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("RECOMMENDED CARE & ACTION PLAN:", 20, y);
  y += 8;
  
  doc.setFont("helvetica", "normal");
  report.recommendations.forEach(rec => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(`- ${rec}`, 25, y);
    y += 6;
  });
  
  // Disclaimer Banner
  y += 10;
  if (y > 255) {
    doc.addPage();
    y = 20;
  }
  
  doc.setFillColor(254, 243, 199);
  doc.rect(20, y, 170, 18, "F");
  doc.setDrawColor(245, 158, 11);
  doc.rect(20, y, 170, 18, "D");
  
  doc.setTextColor(146, 64, 14);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("MEDICAL DISCLAIMER:", 23, y + 5);
  doc.setFont("helvetica", "normal");
  doc.text("This report is generated by AI for educational/informational purposes only. It is NOT a substitute", 23, y + 10);
  doc.text("for professional medical advice, diagnosis, or treatment. Always consult a physician.", 23, y + 14);
  
  doc.save(`Vishara_AI_Report_${report.type.replace(/\s+/g, "_")}.pdf`);
  toast.success("AI Diagnostic PDF downloaded successfully!");
}

async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  });
  
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}

function DiseaseAnalyzerPage() {
  const [userName, setUserName] = useState("Patient");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisReport | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const user = getUser();
    if (user?.name) {
      setUserName(user.name);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setAnalysisResult(null);
    }
  };

  const triggerSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Please upload an image first.");
      return;
    }

    setIsAnalyzing(true);
    setIsDemoMode(false);
    
    try {
      const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
      const model = getGenerativeModel(ai, {
        model: "gemini-2.5-flash-latest",
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const imagePart = await fileToGenerativePart(selectedFile);
      const prompt = `You are a medical AI assistant trained to analyze medical documents and images.
Analyze the uploaded image. It may be a medical document (e.g., lab test report, prescription, radiology scan, doctor's note) or a picture of a disease/symptom (e.g., skin rash, eye infection, burn, wound).

Provide a structured analysis in JSON format. Do not include any markdown formatting (like \`\`\`json) in your response, just the raw JSON. The JSON must have the following structure:
{
  "type": "Disease Image | Lab Report | Prescription | Scan | Other",
  "summary": "A high-level, clear 1-2 sentence summary of the findings.",
  "urgency": "low | medium | high",
  "findings": [
    {
      "name": "Name of the symptom, disease, or lab parameter (e.g. Hemoglobin, Skin Rash)",
      "value": "Observed value or severity (e.g. 10.5 g/dL, Moderate)",
      "status": "normal | abnormal | warning | attention",
      "description": "A brief explanation of what this parameter means in simple terms."
    }
  ],
  "explanation": "A comprehensive, easy-to-understand explanation of the analysis. Avoid medical jargon, and explain what the diagnosis or report implies in everyday language.",
  "recommendations": [
    "Recommended action 1 (e.g., Consult a dermatologist)",
    "Recommended action 2 (e.g., Avoid scratching, keep the area clean)",
    "Recommended action 3"
  ]
}`;

      const result = await model.generateContent([prompt, imagePart]);
      const textResponse = await result.response.text();
      console.log("Raw Gemini Response:", textResponse);

      const parsed: AIAnalysisReport = JSON.parse(textResponse);
      setAnalysisResult(parsed);
      toast.success("Analysis complete!");
    } catch (error) {
      console.warn("Firebase AI logic failed or was not provisioned. Falling back to Demo Mode:", error);
      
      setIsDemoMode(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const fileName = selectedFile.name.toLowerCase();
      let selectedMock = MOCK_ANALYSES.general;

      if (fileName.includes("skin") || fileName.includes("rash") || fileName.includes("eczema") || fileName.includes("disease") || fileName.includes("face")) {
        selectedMock = MOCK_ANALYSES.skin;
      } else if (fileName.includes("blood") || fileName.includes("cbc") || fileName.includes("report") || fileName.includes("lipid") || fileName.includes("test")) {
        selectedMock = MOCK_ANALYSES.blood;
      }

      setAnalysisResult(selectedMock);
      toast.info("Analysis generated in Preview/Demo mode.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <DashboardShell>
      {/* Header Banner */}
      <div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-hero border border-border shadow-soft relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-primary/10 blur-2xl" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-primary grid place-items-center shadow-soft">
            <Brain className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">AI Disease Analyzer</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Scan symptom photographs or diagnostic laboratory reports to get instant analysis, key parameter tracking, and recommended steps.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-card/80 border border-border/80 px-4 py-2.5 rounded-2xl relative z-10 self-start md:self-auto text-xs text-muted-foreground font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Secure, Encrypted & Private
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
        
        {/* Upload Panel */}
        <div className="space-y-6">
          <Card className="border-border shadow-soft rounded-2xl overflow-hidden bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Image Upload</CardTitle>
              <CardDescription>Upload health documents or symptom photos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                onClick={triggerSelectFile}
                className="border-2 border-dashed border-border hover:border-primary/40 rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center h-52 bg-secondary/20 group relative"
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                />
                
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-muted-foreground mb-3 group-hover:text-primary transition-colors animate-pulse" />
                    <p className="text-sm font-semibold text-foreground">Select medical image</p>
                    <p className="text-xs text-muted-foreground mt-1">Supports PNG, JPG, WEBP</p>
                  </>
                )}
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || isAnalyzing}
                className="w-full h-12 bg-gradient-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-glow cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Image...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" /> Analyze with Vishara AI
                  </>
                )}
              </button>

              {selectedFile && (
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setImagePreview(null);
                    setAnalysisResult(null);
                  }}
                  className="w-full text-xs text-muted-foreground hover:text-foreground text-center cursor-pointer font-medium mt-1 block"
                >
                  Clear uploaded file
                </button>
              )}
            </CardContent>
          </Card>

          {/* Quick Guide Card */}
          <Card className="border-border shadow-soft rounded-2xl bg-card/45">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Supported Cases</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Symptom & Disease Images</p>
                  <p className="text-muted-foreground">Skin rashes, minor wounds, burns, or localized inflammations.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Laboratory Diagnostics</p>
                  <p className="text-muted-foreground">Blood work reports, lipid profiles, thyroid parameters, etc.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {!analysisResult && !isAnalyzing && (
            <div className="border border-dashed border-border rounded-3xl h-[380px] grid place-items-center bg-card text-center p-8 shadow-soft">
              <div className="max-w-md">
                <FileImage className="w-14 h-14 text-muted-foreground/60 mx-auto mb-4" />
                <h3 className="font-bold text-lg">No Analysis Generated Yet</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Upload a photo of a disease symptom or a laboratory report document on the left, then click "Analyze with Vishara AI" to view details.
                </p>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="border border-border rounded-3xl h-[380px] grid place-items-center bg-card shadow-soft">
              <div className="text-center space-y-4">
                <div className="w-14 h-14 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
                <div>
                  <h3 className="font-bold text-lg">Scanning Medical Data</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-[280px] mx-auto leading-relaxed">
                    Extracting parameters, analyzing symptoms using medical AI backend...
                  </p>
                </div>
              </div>
            </div>
          )}

          {analysisResult && !isAnalyzing && (
            <div className="space-y-6 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-soft animate-fade-in">
              
              {isDemoMode && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs px-4 py-3 rounded-2xl flex items-start gap-2.5 font-semibold leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Preview Mode (Simulated AI Analysis). To connect live Gemini API, configure App Check and Gemini Developer API.</span>
                </div>
              )}

              {/* Urgency and Result Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Diagnostic Results</span>
                  <h2 className="text-xl md:text-2xl font-extrabold mt-1 flex items-center gap-2">
                    {analysisResult.type}
                  </h2>
                </div>

                <div className="flex items-center gap-2.5">
                  {analysisResult.urgency === "high" && (
                    <Badge className="bg-rose-500 text-white border-none py-1.5 px-3.5 rounded-full flex items-center gap-1.5 font-extrabold">
                      ⚠️ Urgency: High
                    </Badge>
                  )}
                  {analysisResult.urgency === "medium" && (
                    <Badge className="bg-amber-500 text-white border-none py-1.5 px-3.5 rounded-full flex items-center gap-1.5 font-extrabold">
                      ⚠️ Urgency: Medium
                    </Badge>
                  )}
                  {analysisResult.urgency === "low" && (
                    <Badge className="bg-emerald-500 text-white border-none py-1.5 px-3.5 rounded-full flex items-center gap-1.5 font-extrabold">
                      ✓ Urgency: Low
                    </Badge>
                  )}
                  
                  <button
                    onClick={() => downloadAIReportPDF(analysisResult, userName)}
                    className="h-10 px-4 bg-secondary text-secondary-foreground text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer hover:bg-accent transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-secondary/40 border border-border p-5 rounded-2xl">
                <p className="text-sm leading-relaxed font-semibold">
                  {analysisResult.summary}
                </p>
              </div>

              {/* Extracted Parameters */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Parameters Extracted</h3>
                <div className="grid gap-3.5">
                  {analysisResult.findings.map((finding, index) => (
                    <div 
                      key={index} 
                      className="bg-card border border-border p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm hover:border-border/80 transition-colors"
                    >
                      <div>
                        <p className="font-bold text-sm">{finding.name}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{finding.description}</p>
                      </div>
                      <div className="flex items-center gap-2.5 self-start md:self-center">
                        <span className="text-sm font-bold">{finding.value}</span>
                        {finding.status === "normal" && (
                          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            Normal
                          </span>
                        )}
                        {finding.status === "abnormal" && (
                          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded-full">
                            Abnormal
                          </span>
                        )}
                        {finding.status === "warning" && (
                          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full">
                            Warning
                          </span>
                        )}
                        {finding.status === "attention" && (
                          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                            Attention
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medical Explanation */}
              <div className="space-y-2">
                <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Medical Explanation</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {analysisResult.explanation}
                </p>
              </div>

              {/* Action Steps */}
              <div className="space-y-3">
                <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Recommended Next Steps</h3>
                <ul className="grid gap-2.5 text-sm">
                  {analysisResult.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2.5 bg-secondary/20 border border-border/40 p-3.5 rounded-xl">
                      <CheckCircle2 className="w-4.5 h-4.5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Safety disclaimer */}
              <div className="border border-amber-500/20 bg-amber-500/5 p-4 rounded-2xl text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                ⚠️ <strong>Medical Disclaimer:</strong> Vishara AI analysis reports are created for educational and health tracking purposes. They are not formal diagnostics. For any acute condition or symptom review, seek prompt attention from a certified general physician or specialist.
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
