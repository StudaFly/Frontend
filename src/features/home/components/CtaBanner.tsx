import { Link } from "react-router-dom";
import { ArrowRight, Plane } from "lucide-react";
import { useTranslation } from "react-i18next";

export function CtaBanner() {
    const { t } = useTranslation();

    return (
        <section className="relative z-10 bg-gradient-to-br from-primary-dark to-primary-light py-24 text-white md:py-32">
            <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                <Plane className="mx-auto mb-8 h-16 w-16 text-secondary" />
                <h2 className="mb-8 text-3xl font-bold md:text-4xl lg:text-5xl">
                    {t("home.cta.title")}
                </h2>
                <p className="mb-10 text-lg leading-relaxed text-gray-200 md:text-xl">
                    {t("home.cta.subtitle")}
                </p>
                <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-lg bg-secondary px-8 py-4 text-lg font-bold text-primary-dark transition-colors hover:bg-secondary/80"
                >
                    {t("home.cta.button")}
                    <ArrowRight size={20} />
                </Link>
                <p className="mt-4 text-sm text-gray-300">{t("home.cta.no_card")}</p>
            </div>
        </section>
    );
}
