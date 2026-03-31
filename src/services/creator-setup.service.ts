import {
  canAccessCreatorWorkspace,
  getCreatorAccessState,
  getCreatorProfile,
  getCreatorResourceStatusSummary,
} from "@/services/creator.service";

export interface CreatorSetupState {
  /** True if the creator has set both a display name and a public slug. */
  hasProfile: boolean;
  totalResources: number;
  draftResources: number;
  publishedResources: number;
  archivedResources: number;
  /**
   * True when the creator has no published resources yet.
   * Used to decide whether to render the first-run experience.
   */
  isFirstRun: boolean;
  steps: {
    profileComplete: boolean;
    firstResourceCreated: boolean;
    firstResourcePublished: boolean;
  };
}

/**
 * Derives the creator's setup completion state in a single parallel fetch.
 * Reuses existing service functions — no new DB queries introduced.
 */
export async function getCreatorSetupState(userId: string): Promise<CreatorSetupState> {
  const [access, profile] = await Promise.all([
    getCreatorAccessState(userId),
    getCreatorProfile(userId),
  ]);

  const statusSummary = canAccessCreatorWorkspace(access)
    ? await getCreatorResourceStatusSummary(userId)
    : {
        draft: 0,
        published: 0,
        archived: 0,
      };

  const profileComplete = Boolean(
    profile?.creatorSlug &&
      profile.creatorSlug.length > 0 &&
      profile?.creatorDisplayName &&
      profile.creatorDisplayName.length > 0,
  );

  const totalResources =
    statusSummary.draft + statusSummary.published + statusSummary.archived;

  return {
    hasProfile: profileComplete,
    totalResources,
    draftResources: statusSummary.draft,
    publishedResources: statusSummary.published,
    archivedResources: statusSummary.archived,
    isFirstRun: statusSummary.published === 0,
    steps: {
      profileComplete,
      firstResourceCreated: totalResources > 0,
      firstResourcePublished: statusSummary.published > 0,
    },
  };
}
