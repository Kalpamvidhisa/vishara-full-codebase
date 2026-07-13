import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DashboardShell } from "@/components/DashboardShell";

export const Route = createFileRoute("/medicine-guide")({
    component: MedicineGuidePage,
});

interface Medicine {
    id: string;
    name: string;
    genericName: string;
    imageUrl: string;
    uses: string;
    symptoms: string[];
    dosage: string;
    sideEffects: string[];
    warnings: string;
    category: string;
}

const DEFAULT_MEDICINES = [
    {
        name: "Paracetamol",
        genericName: "Acetaminophen",
        imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
        uses: "Relieves mild to moderate pain and reduces fever.",
        symptoms: ["Fever", "Headache", "Body Ache", "Toothache"],
        dosage: "500mg - 1000mg every 4-6 hours as needed (Max 4g/day)",
        sideEffects: ["Nausea", "Allergic reaction (rare)", "Liver damage (if overdosed)"],
        warnings: "Avoid drinking alcohol while taking. Do not exceed recommended dose.",
        category: "Analgesic"
    },
    {
        name: "Amoxicillin",
        genericName: "Amoxicillin Trihydrate",
        imageUrl: "https://images.unsplash.com/photo-1607619056574-7b8d304a2c06?w=500&auto=format&fit=crop&q=60",
        uses: "Treats bacterial infections such as pneumonia, tonsillitis, and ear infections.",
        symptoms: ["Bacterial Infection", "Throat Infection", "Ear Pain", "Cough"],
        dosage: "250mg - 500mg every 8 hours or as prescribed by a doctor.",
        sideEffects: ["Diarrhea", "Nausea", "Skin rash"],
        warnings: "Finish the entire course even if you feel better. Does not treat viral infections.",
        category: "Antibiotic"
    },
    {
        name: "Cetirizine",
        genericName: "Cetirizine Hydrochloride",
        imageUrl: "https://images.unsplash.com/photo-1631549916768-4119b2554c26?w=500&auto=format&fit=crop&q=60",
        uses: "Provides temporary relief from symptoms of hay fever and upper respiratory allergies.",
        symptoms: ["Allergy", "Running Nose", "Sneezing", "Itchy Eyes", "Hives"],
        dosage: "10mg once daily.",
        sideEffects: ["Drowsiness", "Dry mouth", "Fatigue"],
        warnings: "May cause drowsiness. Avoid driving or operating machinery after taking.",
        category: "Antihihistamine"
    },
    {
        name: "Ibuprofen",
        genericName: "Ibuprofen",
        imageUrl: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&auto=format&fit=crop&q=60",
        uses: "Reduces hormones that cause pain and inflammation in the body.",
        symptoms: ["Joint Pain", "Inflammation", "Muscle Pain", "Menstrual Cramps"],
        dosage: "200mg - 400mg every 4-6 hours with food.",
        sideEffects: ["Stomach upset", "Heartburn", "Dizziness"],
        warnings: "Take with food to avoid stomach irritation. Long-term use can cause ulcers.",
        category: "NSAID"
    },
    {
        name: "Metformin",
        genericName: "Metformin Hydrochloride",
        imageUrl: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?w=500&auto=format&fit=crop&q=60",
        uses: "Improves glycemic control in people with type 2 diabetes.",
        symptoms: ["High Blood Sugar", "Diabetes", "Insulin Resistance"],
        dosage: "500mg - 1000mg daily with meals as prescribed.",
        sideEffects: ["Nausea", "Diarrhea", "Metallic taste"],
        warnings: "Risk of lactic acidosis (rare but serious). Monitor kidney function regularly.",
        category: "Antidiabetic"
    }
];

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60";

// Pool of diverse medicine images for any medicine not explicitly mapped
const FALLBACK_IMAGE_POOL = [
    "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1563213126-a4273aed2016?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=500&auto=format&fit=crop&q=60",
];

function MedicineGuidePage() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Medicine | null>(null);
    const [isSeeding, setIsSeeding] = useState(false);

    useEffect(() => {
        loadMedicines();
    }, []);

    async function loadMedicines() {
        try {
            const snapshot = await getDocs(collection(db, "medicines"));

            let data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Medicine[];
            console.log("Medicines from Firestore:", data);

            const IMAGE_MAPPINGS: Record<string, string> = {
                // Pain relievers & fever reducers
                "aspirin": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=60",
                "paracetamol": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
                "ibuprofen": "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&auto=format&fit=crop&q=60",
                // Antibiotics
                "amoxicillin": "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&auto=format&fit=crop&q=60",
                "azithromycin": "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=500&auto=format&fit=crop&q=60",
                "ciprofloxacin": "https://images.unsplash.com/photo-1563213126-a4273aed2016?w=500&auto=format&fit=crop&q=60",
                // Allergy
                "cetirizine": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&auto=format&fit=crop&q=60",
                "loratadine": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&auto=format&fit=crop&q=60",
                // Diabetes
                "metformin": "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=500&auto=format&fit=crop&q=60",
                // Blood pressure & heart
                "lisinopril": "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500&auto=format&fit=crop&q=60",
                "atorvastatin": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&auto=format&fit=crop&q=60",
                "amlodipine": "https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=500&auto=format&fit=crop&q=60",
                // Vitamins & supplements
                "vitamin d3": "https://images.unsplash.com/photo-1615485736784-de246d5c9948?w=500&auto=format&fit=crop&q=60",
                "vitamin d": "https://images.unsplash.com/photo-1615485736784-de246d5c9948?w=500&auto=format&fit=crop&q=60",
                "vitamin c": "https://images.unsplash.com/photo-1615485736784-de246d5c9948?w=500&auto=format&fit=crop&q=60",
                "vitamin b12": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&auto=format&fit=crop&q=60",
                // Stomach / GI
                "omeprazole": "https://images.unsplash.com/photo-1563213126-a4273aed2016?w=500&auto=format&fit=crop&q=60",
                "pantoprazole": "https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=500&auto=format&fit=crop&q=60",
                // Antifungal
                "fluconazole": "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=500&auto=format&fit=crop&q=60",
            };

            if (data.length === 0 && !isSeeding) {
                setIsSeeding(true);
                console.log("No medicines found in Firestore. Seeding default medicines...");
                const seededData: Medicine[] = [];
                for (const med of DEFAULT_MEDICINES) {
                    const docRef = await addDoc(collection(db, "medicines"), med);
                    seededData.push({ id: docRef.id, ...med });
                }
                data = seededData;
                setIsSeeding(false);
            } else if (data.length > 0) {
                // Self-healing: assign unique images to every medicine card
                for (let i = 0; i < data.length; i++) {
                    const med = data[i];
                    const key = med.name?.toLowerCase().trim();
                    // Prefer exact mapping, then fall back to a unique pool image based on index
                    const targetUrl = (key && IMAGE_MAPPINGS[key])
                        ? IMAGE_MAPPINGS[key]
                        : FALLBACK_IMAGE_POOL[i % FALLBACK_IMAGE_POOL.length];

                    // Always apply locally so every card gets a distinct image
                    data[i].imageUrl = targetUrl;

                    // Attempt to sync the corrected URL back to Firestore
                    const docRef = doc(db, "medicines", med.id);
                    updateDoc(docRef, { imageUrl: targetUrl }).catch((err) => {
                        console.warn(`Firestore write restricted for ${med.name}. Local override applied.`, err);
                    });
                }
            }

            setMedicines(data);
        } catch (error) {
            console.error("Error loading medicines:", error);
            setIsSeeding(false);
        }
    }

    const filtered = medicines.filter((medicine) =>
        medicine.name?.toLowerCase().includes(search.toLowerCase()) ||
        medicine.symptoms?.some((symptom) =>
            symptom.toLowerCase().includes(search.toLowerCase())
        )
    );

    return (
        <DashboardShell>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Medicine Guide</h1>
                    <p className="text-muted-foreground">
                        Learn about medicines, dosage, uses and precautions.
                    </p>
                </div>

                <input
                    type="text"
                    placeholder="Enter disease or symptom (e.g. Fever, Headache)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-12 border rounded-xl px-4"
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((medicine) => (
                        <div
                            key={medicine.id}
                            className="bg-card border border-border rounded-2xl p-4 shadow-sm"
                        >
                            <img
                                src={medicine.imageUrl || FALLBACK_IMAGE}
                                alt={medicine.name}
                                className="w-full h-48 object-cover rounded-xl"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                                }}
                            />

                            <h2 className="mt-3 font-bold text-lg">
                                {medicine.name}
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                {medicine.genericName}
                            </p>

                            <p className="mt-2 text-sm line-clamp-2">
                                {medicine.uses}
                            </p>

                            <button
                                onClick={() => setSelected(medicine)}
                                className="mt-3 w-full h-10 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>

                {selected && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white max-w-xl w-full rounded-2xl p-6 overflow-auto max-h-[90vh]">
                            <img
                                src={selected.imageUrl || FALLBACK_IMAGE}
                                alt={selected.name}
                                className="w-full h-56 object-cover rounded-xl"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                                }}
                            />
                            <h2 className="text-2xl font-bold mt-4">
                                {selected.name}
                            </h2>

                            <p className="text-gray-500">
                                {selected.genericName}
                            </p>

                            <div className="mt-4">
                                <h3 className="font-semibold">Uses</h3>
                                <p>{selected.uses}</p>
                            </div>

                            <div className="mt-4">
                                <h3 className="font-semibold">Symptoms</h3>
                                <ul className="list-disc pl-5">
                                    {selected.symptoms?.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-4">
                                <h3 className="font-semibold">Dosage</h3>
                                <p>{selected.dosage}</p>
                            </div>

                            <div className="mt-4">
                                <h3 className="font-semibold">Side Effects</h3>
                                <ul className="list-disc pl-5">
                                    {selected.sideEffects?.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-4">
                                <h3 className="font-semibold text-red-600">
                                    Warnings
                                </h3>
                                <p>{selected.warnings}</p>
                            </div>

                            <div className="mt-6 p-3 bg-yellow-100 rounded-lg text-sm text-yellow-800">
                                ⚠️ This information is for educational purposes only.
                                Always consult a qualified healthcare professional before
                                taking any medication.
                            </div>

                            <button
                                onClick={() => setSelected(null)}
                                className="mt-5 w-full h-10 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardShell>
    );
}