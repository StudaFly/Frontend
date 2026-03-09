export interface CountryData {
    slug: string;
    name: string;
    city: string;
    students: string;
    description: string;
    image: string;
    overview: {
        language: string;
        currency: string;
        climate: string;
        visaRequired: boolean;
    };
    budget: {
        housing: string;
        food: string;
        transport: string;
        leisure: string;
        totalEstimate: string;
    };
    steps: {
        title: string;
        description: string;
        timeline: string;
    }[];
}
