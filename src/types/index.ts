export interface DreamDetails {
  brand?: string;
  color?: string;
  pets?: string[];
  destinations?: string[];
  activities?: string[];
  hobbies?: string[];
  text?: string;
}

export interface FormData {
  time: string;
  dreams: string[];
  details: Record<string, DreamDetails>;
  name: string;
  motto: string;
  addLabels: boolean;
}

export interface GenerationResult {
  imageUrl: string;
  shareSlug: string;
  prompt: string;
}
