import { useTranslation } from "react-i18next";

export function HowItWorks() {
    const { t } = useTranslation();

    const steps = [
        { number: 1, titleKey: "home.how_it_works.step1_title", descKey: "home.how_it_works.step1_desc" },
        { number: 2, titleKey: "home.how_it_works.step2_title", descKey: "home.how_it_works.step2_desc" },
        { number: 3, titleKey: "home.how_it_works.step3_title", descKey: "home.how_it_works.step3_desc" },
    ];

    return (
        <section className="relative z-10 bg-white py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center md:mb-20">
                    <h2 className="mb-4 text-3xl font-bold text-primary-dark md:text-4xl lg:text-5xl">
                        {t("home.how_it_works.title")}
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">
                        {t("home.how_it_works.subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
                    {steps.map(({ number, titleKey, descKey }) => (
                        <div key={number} className="text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-dark to-primary-light text-2xl font-bold text-white">
                                {number}
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-primary-dark">{t(titleKey)}</h3>
                            <p className="leading-relaxed text-gray-600">{t(descKey)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
