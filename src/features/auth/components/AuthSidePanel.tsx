interface AuthSidePanelProps {
    title: string;
    subtitle: string;
    imageUrl: string;
    imageAlt: string;
}

export function AuthSidePanel({
    title,
    subtitle,
    imageUrl,
    imageAlt,
}: AuthSidePanelProps) {
    return (
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary-dark to-primary-light lg:block lg:w-1/2">
            {/* Background image */}
            <img
                src={imageUrl}
                alt={imageAlt}
                className="absolute inset-0 h-full w-full object-cover opacity-20"
            />

            {/* Text overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-12">
                <div className="space-y-6 text-center text-white">
                    <h2 className="text-4xl font-bold xl:text-5xl">{title}</h2>
                    <p className="text-xl text-gray-200">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}
