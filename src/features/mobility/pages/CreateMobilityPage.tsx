import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Globe, GraduationCap, Award, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { createMobility, type MobilityType } from "@/core/api/mobilities";
import { useReference } from "@/core/hooks/useReference";
import type { Destination } from "@/core/api/destinations";
import { getApiErrorMessage } from "@/core/api/errors";
import { MOBILITIES_QUERY_KEY } from "@/core/hooks/useActiveMobility";
import { todayIso } from "@/core/utils/dates";
import { DestinationCombobox } from "../components/DestinationCombobox";

// Icons only: the list, labels and descriptions come from GET /reference.
const TYPE_ICONS: Record<string, typeof Globe> = {
    erasmus: Globe,
    stage: Briefcase,
    semestre: GraduationCap,
    double_diplome: Award,
};

const STEPS = [
    { title: "Ton type de mobilité", subtitle: "Quel programme as-tu choisi ?" },
    { title: "Ta destination", subtitle: "Vers quelle ville pars-tu ?" },
    { title: "Ta date de départ", subtitle: "On calculera toutes tes deadlines à partir de cette date." },
    { title: "Ton établissement d'accueil", subtitle: "Optionnel — tu pourras le renseigner plus tard." },
];

export default function CreateMobilityPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { mobilityTypes } = useReference();
    const [step, setStep] = useState(0);
    const [type, setType] = useState<MobilityType | null>(null);
    const [destination, setDestination] = useState<Destination | null>(null);
    const [departureDate, setDepartureDate] = useState("");
    const [school, setSchool] = useState("");

    const mutation = useMutation({
        mutationFn: () =>
            createMobility({
                type: type!,
                destinationId: destination!.id,
                departureDate,
                school: school.trim() || undefined,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: MOBILITIES_QUERY_KEY });
            toast.success("Ton parcours est prêt !");
            navigate("/dashboard");
        },
        onError: (err) => toast.error(getApiErrorMessage(err, "Impossible de créer ta mobilité")),
    });

    const canProceed = [type !== null, destination !== null, departureDate !== "", true][step];
    const isLastStep = step === STEPS.length - 1;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!canProceed) return;
        if (isLastStep) mutation.mutate();
        else setStep((s) => s + 1);
    };

    return (
        <div className="min-h-[calc(100vh-100px)] bg-gray-50 px-4 py-12">
            <form onSubmit={handleSubmit} className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-10">
                <ol className="mb-8 flex gap-2" aria-label={`Étape ${step + 1} sur ${STEPS.length}`}>
                    {STEPS.map((s, i) => (
                        <li
                            key={s.title}
                            className={`h-2 flex-1 rounded-full ${i <= step ? "bg-secondary" : "bg-gray-200"}`}
                            aria-current={i === step ? "step" : undefined}
                        />
                    ))}
                </ol>

                <fieldset className="space-y-6">
                    <legend className="mb-6">
                        <span className="block text-sm font-semibold text-secondary">Étape {step + 1} sur {STEPS.length}</span>
                        <span className="block font-heading text-3xl font-bold text-primary-dark">{STEPS[step].title}</span>
                        <span className="mt-1 block text-gray-600">{STEPS[step].subtitle}</span>
                    </legend>

                    {step === 0 && (
                        <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Type de mobilité">
                            {mobilityTypes.map(({ key, label, description }) => {
                                const value = key as MobilityType;
                                const Icon = TYPE_ICONS[key] ?? Globe;
                                return (
                                <button
                                    key={value}
                                    type="button"
                                    role="radio"
                                    aria-checked={type === value}
                                    onClick={() => setType(value)}
                                    className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${
                                        type === value ? "border-secondary bg-secondary/10" : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <Icon className="mt-0.5 h-6 w-6 text-primary-dark" aria-hidden />
                                    <span>
                                        <span className="block font-semibold text-primary-dark">{label}</span>
                                        <span className="block text-sm text-gray-500">{description}</span>
                                    </span>
                                </button>
                                );
                            })}
                        </div>
                    )}

                    {step === 1 && <DestinationCombobox selected={destination} onSelect={setDestination} />}

                    {step === 2 && (
                        <div>
                            <label htmlFor="departure-date" className="mb-2 block text-sm font-medium text-gray-700">
                                Date de départ
                            </label>
                            <input
                                id="departure-date"
                                type="date"
                                min={todayIso()}
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <label htmlFor="school" className="mb-2 block text-sm font-medium text-gray-700">
                                École ou entreprise d'accueil
                            </label>
                            <input
                                id="school"
                                type="text"
                                value={school}
                                maxLength={255}
                                onChange={(e) => setSchool(e.target.value)}
                                placeholder="ex : Universitat de Barcelona"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                        </div>
                    )}
                </fieldset>

                <div className="mt-10 flex items-center justify-between gap-4">
                    {step > 0 ? (
                        <button
                            type="button"
                            onClick={() => setStep((s) => s - 1)}
                            className="flex items-center gap-2 rounded-lg px-4 py-3 font-semibold text-primary-dark hover:bg-gray-100"
                        >
                            <ArrowLeft className="h-4 w-4" aria-hidden /> Retour
                        </button>
                    ) : (
                        <span />
                    )}
                    <button
                        type="submit"
                        disabled={!canProceed || mutation.isPending}
                        className="flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 font-bold text-primary-dark transition-colors hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLastStep ? (
                            <>
                                <Sparkles className="h-4 w-4" aria-hidden />
                                {mutation.isPending ? "Génération…" : "Générer mon parcours"}
                            </>
                        ) : (
                            <>
                                Continuer <ArrowRight className="h-4 w-4" aria-hidden />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
