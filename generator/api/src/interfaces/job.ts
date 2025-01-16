export default interface JobInterface {
  id?: string;
  url?: string;
  employer: string;
  title: string;
  description: string;
  keywords?: string[];
}