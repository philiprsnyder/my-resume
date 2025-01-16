import JobInterface from "./job";
import SkillInterface from "./skill";
import ResumeInterface from "./resume";

interface GetResumeRequest {
}

interface SaveResumeRequest {
  resume: ResumeInterface;
}

interface GetSkillsetRequest {
}

interface SaveSkillsetRequest {
  skillset: SkillInterface[];
}

interface GetJobRequest {
  id: string;
}

interface SaveJobRequest {
  url: string;
  employer: string;
  title: string;
  description: string;
  keywords: string[];
}

interface SaveJobResponse {
  job: JobInterface;
}

interface GetKeywordRequest {
  jobId: string;
}

export type {
  JobInterface,
  SkillInterface,
  ResumeInterface,
  // Request interfaces
  GetResumeRequest,
  SaveResumeRequest,
  GetSkillsetRequest,
  SaveSkillsetRequest,
  GetJobRequest,
  SaveJobRequest,
  SaveJobResponse,
  GetKeywordRequest,
};