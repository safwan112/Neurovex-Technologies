import { getEpisodeDetails } from "./get-episode-details";
import { getPageTitles } from "./get-page-titles";
import { submitSuggestion } from "./submit-suggestion";
import { submitNewEpisode } from "./submit-new-episode";
import { submitContact } from "./submit-contact";

export const server = {
  getEpisodeDetails,
  getPageTitles,
  submitSuggestion,
  submitNewEpisode,
  submitContact,
};
