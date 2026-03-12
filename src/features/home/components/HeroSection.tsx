import { Link } from "react-router-dom";
import { ArrowRight, Users, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { HeroStat } from "./HeroStat";

export function HeroSection() {
    const { t } = useTranslation();

    return (
        <section
            className="sticky top-[100px] z-0 flex min-h-[600px] items-center overflow-hidden bg-gradient-to-br from-primary-dark to-primary-light text-white"
            style={{ height: "calc(100vh - 100px)" }}
        >
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-32 lg:px-8 lg:py-40">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left — Text */}
                    <div className="space-y-8 md:space-y-10">
                        <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                            {t("home.hero.title_before")}{" "}
                            <span className="text-secondary">{t("home.hero.title_highlight")}</span>{" "}
                            {t("home.hero.title_after")}
                        </h1>
                        <p className="text-lg leading-relaxed text-gray-200 md:text-xl">
                            {t("home.hero.subtitle")}
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-8 py-4 text-center font-bold text-primary-dark transition-colors hover:bg-secondary/80"
                            >
                                {t("home.hero.cta_primary")}
                                <ArrowRight size={20} />
                            </Link>
                            <a
                                href="#features"
                                className="rounded-lg border border-white/30 bg-white/10 px-8 py-4 text-center backdrop-blur-sm transition-colors hover:bg-white/20"
                            >
                                {t("home.hero.cta_secondary")}
                            </a>
                        </div>
                        <div className="flex flex-wrap gap-8 pt-4">
                            <HeroStat
                                icon={Users}
                                value={t("home.hero.stat_students_value")}
                                label={t("home.hero.stat_students_label")}
                            />
                            <HeroStat
                                icon={Globe}
                                value={t("home.hero.stat_countries_value")}
                                label={t("home.hero.stat_countries_label")}
                            />
                        </div>
                    </div>

                    {/* Right — Image */}
                    <div className="hidden lg:block">
                        <img
                            src="https://images.unsplash.com/photo-1761295231159-4eb997ccca2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                            alt={t("home.hero.hero_image_alt")}
                            className="rounded-2xl shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
