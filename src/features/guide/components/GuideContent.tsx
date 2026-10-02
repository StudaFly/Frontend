import { BookOpen, HeartPulse, Home, Info, Palette, Phone, TrainFront, type LucideIcon } from "lucide-react";
import type { DestinationGuide } from "@/core/api/destinations";

const SECTION_ICONS: Record<string, LucideIcon> = {
    overview: Info,
    housing: Home,
    transport: TrainFront,
    health: HeartPulse,
    culture: Palette,
};

const PHONE_NUMBER = /^\+?[\d\s.-]{2,}$/;

export function GuideContent({ guide }: { guide: DestinationGuide }) {
    return (
        <div className="space-y-4">
            {guide.sections.map((section) => {
                const Icon = SECTION_ICONS[section.key] ?? BookOpen;
                return (
                    <section key={section.key} className="flex gap-4 rounded-xl bg-white p-5 ring-1 ring-slate-100">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                            <Icon className="h-5 w-5 text-primary-light" aria-hidden />
                        </span>
                        <div>
                            <h3 className="font-bold text-primary-dark">{section.title}</h3>
                            <p className="mt-1 text-gray-600">{section.content}</p>
                        </div>
                    </section>
                );
            })}

            {guide.keySteps.length > 0 && (
                <section className="rounded-xl bg-white p-5 ring-1 ring-slate-100">
                    <h3 className="font-bold text-primary-dark">🗓️ Étapes clés</h3>
                    <ol className="mt-3 space-y-3">
                        {guide.keySteps.map((step) => (
                            <li key={step.title} className="flex gap-3">
                                <span className="h-fit shrink-0 rounded-full bg-secondary/20 px-2 py-0.5 text-xs font-semibold text-primary-dark">
                                    {step.timing}
                                </span>
                                <span>
                                    <span className="block font-semibold text-primary-dark">{step.title}</span>
                                    <span className="block text-gray-600">{step.description}</span>
                                </span>
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            {guide.tips.length > 0 && (
                <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <h3 className="font-bold text-primary-dark">💡 Bons plans</h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-700">
                        {guide.tips.map((tip) => (
                            <li key={tip}>{tip}</li>
                        ))}
                    </ul>
                </section>
            )}

            {Object.keys(guide.emergencyContacts).length > 0 && (
                <section className="rounded-xl bg-white p-5 ring-1 ring-slate-100">
                    <h3 className="font-bold text-primary-dark">🚨 Contacts utiles</h3>
                    <dl className="mt-3 divide-y divide-gray-100">
                        {Object.entries(guide.emergencyContacts).map(([label, value]) => (
                            <div key={label} className="flex items-center justify-between gap-4 py-2">
                                <dt className="text-gray-600 first-letter:uppercase">{label}</dt>
                                <dd className="text-right font-semibold text-primary-dark">
                                    {PHONE_NUMBER.test(value) ? (
                                        <a href={`tel:${value.replace(/[\s.-]/g, "")}`} className="inline-flex items-center gap-1 text-primary-light hover:underline">
                                            <Phone className="h-4 w-4" aria-hidden /> {value}
                                        </a>
                                    ) : (
                                        value
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}
        </div>
    );
}
