import { Link } from 'react-router-dom';

export function DestinationCtaButton() {
    return (
        <Link
            to="/register"
            className="block w-full rounded-xl bg-secondary py-4 text-center font-bold text-primary-dark transition-colors hover:bg-secondary/80"
        >
            Commencer ma préparation →
        </Link>
    );
}
