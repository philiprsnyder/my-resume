export default interface ResumeInterface {
  applicant: {
    name: {
      first: string;
      last: string;
    };
    address: {
      street1: string;
      street2?: string;
      city: string;
      state: string;
      postalCode: string;
    };
    contactInfo: {
      type: "Phone" | "Email" | "LinkedIn" | "GitHub" | "StackOverflow" | "Bitbucket" | "Other";
      url: string; // For types like "Email" or "Phone", this could be `mailto:` or `tel:`
      label?: string; // Optional human-readable label
    }[];
  };
  title: string;
  intro: string;
  experience: {
    employer: string;
    startDate: string; // ISO date format
    endDate?: string; // null or omitted for ongoing
    title: string;
    bulletPoints: { description: string; keyAchievement?: boolean }[];
  }[];
  education: {
    degree: string;
    schoolName: string;
    dateString: string;
  }[];
}
