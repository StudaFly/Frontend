import { Link } from "react-router-dom";

interface AuthPageHeaderProps {
    title: string;
    subtitle: string;
}

export function AuthPageHeader({ title, subtitle }: AuthPageHeaderProps) {
    return (
        <div className="mb-8 text-center">
            <Link to="/" className="mb-6 inline-block text-2xl font-bold text-primary-dark">
                Studa<span className="text-secondary">Fly</span>
            </Link>
            <h1 className="mb-2 text-3xl font-bold text-primary-dark md:text-4xl">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
        </div>
    );
}
